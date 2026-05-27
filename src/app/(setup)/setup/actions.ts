"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function completeProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const fullName     = (formData.get("full_name") as string)?.trim();
  const gender       = formData.get("gender") as string;
  const newPassword  = (formData.get("password") as string)?.trim();
  const courses      = formData.getAll("interested_courses") as string[];
  const eduDegree    = (formData.get("edu_degree") as string) || null;
  const eduYear      = formData.get("edu_passing_year") ? Number(formData.get("edu_passing_year")) : null;
  const eduGrade     = (formData.get("edu_grade") as string)?.trim() || null;
  const intMajor     = (formData.get("interested_major") as string)?.trim() || null;

  if (!fullName)         return { error: "Full name is required." };
  if (!gender)           return { error: "Please select your gender." };
  if (courses.length === 0) return { error: "Select at least one interested course." };

  // 1. Set password if provided
  if (newPassword) {
    if (newPassword.length < 8) return { error: "Password must be at least 8 characters." };
    const { error: pwErr } = await supabase.auth.updateUser({ password: newPassword });
    if (pwErr) return { error: pwErr.message };
  }

  // 2. Update user_metadata with profile_completed flag (used by proxy — no DB needed)
  const { error: metaErr } = await supabase.auth.updateUser({
    data: {
      full_name: fullName,
      profile_completed: true,
    },
  });
  if (metaErr) return { error: metaErr.message };

  // 3. Save full profile to students table
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: dbErr } = await (supabase.from("students") as any).update({
    full_name:          fullName,
    gender,
    interested_courses: courses,
    edu_degree:         eduDegree,
    edu_passing_year:   eduYear,
    edu_grade:          eduGrade,
    interested_major:   intMajor,
    profile_completed:  true,
    updated_at:         new Date().toISOString(),
  }).eq("id", user.id);

  if (dbErr) return { error: dbErr.message };

  revalidatePath("/student/dashboard");
  return { success: true };
}
