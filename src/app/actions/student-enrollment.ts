"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/**
 * Student requests enrollment in a course.
 * Creates a pending enrollment — admin approves, or it auto-activates on payment.
 */
export async function requestEnrollment(
  courseSlug: string,
  division: "live" | "recorded"
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: "Please log in first." };

  // Ensure student record exists (email-only users created by trigger; belt-and-suspenders)
  const supabaseAdmin = await createClient(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabaseAdmin.from("students") as any).upsert(
    {
      id:    user.id,
      email: user.email ?? null,
      phone: user.phone ?? "",
      full_name: user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "Student",
    },
    { onConflict: "id", ignoreDuplicates: true }
  );

  // Check for existing enrollment in this course (via batch)
  const { data: existing } = await supabase
    .from("enrollments")
    .select("id, status, batches(course_slug)")
    .eq("student_id", user.id)
    .in("status", ["pending", "active"])
    .limit(20);

  type ExistingRow = { id: string; status: string; batches: { course_slug: string } | null };
  const alreadyEnrolled = (existing as ExistingRow[] | null)?.some(
    (e) => e.batches?.course_slug === courseSlug
  );

  if (alreadyEnrolled) {
    return { success: false, message: "You already have an enrollment for this course." };
  }

  // Find the best matching active batch
  const { data: batchRaw } = await supabaseAdmin
    .from("batches")
    .select("id")
    .eq("course_slug", courseSlug)
    .eq("division", division)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const batchId = (batchRaw as { id: string } | null)?.id ?? null;

  // Create pending enrollment
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabaseAdmin.from("enrollments") as any).insert({
    student_id: user.id,
    batch_id:   batchId,
    status:     "pending",
    fee_status: "unpaid",
    notes:      `Self-enrollment request · ${courseSlug} · ${division}`,
  });

  if (error) return { success: false, message: error.message };

  revalidatePath("/student/dashboard");
  revalidatePath(`/courses/${courseSlug}`);

  return {
    success: true,
    message: "Enrollment requested! Our team will confirm within 24 hours.",
  };
}
