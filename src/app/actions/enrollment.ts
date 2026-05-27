"use server";

import { createClient } from "@/lib/supabase/server";

export interface EnrollmentInput {
  fullName:  string;
  phone:     string;
  email?:    string;
  courseSlug: string;
  division:  "live" | "recorded";
  notes?:    string;
}

export async function submitEnrollment(input: EnrollmentInput): Promise<{ success: true }> {
  // Use service-role so the public enroll form can write without auth
  const supabase = await createClient(true);

  const normPhone = normalisePhone(input.phone.trim());

  // 1. Upsert student record (phone is the natural key)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: studentRaw, error: studentErr } = await (supabase.from("students") as any)
    .upsert(
      {
        full_name:         input.fullName.trim(),
        phone:             normPhone,
        email:             input.email?.trim().toLowerCase() || null,
        status:            "active",
        marketing_source:  "website_enroll_form",
      },
      {
        onConflict:        "phone",
        ignoreDuplicates:  false,        // update name/email if they re-enroll
      }
    )
    .select("id")
    .single();

  if (studentErr || !studentRaw) {
    throw new Error(studentErr?.message ?? "Could not save student record");
  }

  const studentId = (studentRaw as { id: string }).id;

  // 2. Find the best active batch for this course+division
  const { data: batchRaw } = await supabase
    .from("batches")
    .select("id")
    .eq("course_slug", input.courseSlug)
    .eq("division", input.division)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const batchId = (batchRaw as { id: string } | null)?.id ?? null;

  // 3. Avoid duplicate pending enrollment for the same course
  const { data: existingRaw } = await supabase
    .from("enrollments")
    .select("id, status")
    .eq("student_id", studentId)
    .in("status", ["pending", "active"])
    .maybeSingle();

  const existing = existingRaw as { id: string; status: string } | null;
  if (existing) {
    // Already has a pending or active enrollment — silently succeed
    return { success: true };
  }

  // 4. Create enrollment
  const noteLines: string[] = [];
  if (input.notes?.trim()) noteLines.push(input.notes.trim());
  noteLines.push(`Course: ${input.courseSlug} · ${input.division}`);
  if (!batchId) noteLines.push("No batch assigned yet — awaiting admin assignment");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: enrollErr } = await (supabase.from("enrollments") as any).insert({
    student_id: studentId,
    batch_id:   batchId,
    status:     "pending",
    fee_status: "unpaid",
    notes:      noteLines.join("\n"),
  });

  if (enrollErr) throw new Error(enrollErr.message);

  return { success: true };
}

// ── Phone normalisation ───────────────────────────────────────────────────────
function normalisePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("01") && digits.length === 11) return `+880${digits.slice(1)}`;
  if (digits.startsWith("880") && digits.length === 13) return `+${digits}`;
  return raw.startsWith("+") ? raw : `+${raw}`;
}
