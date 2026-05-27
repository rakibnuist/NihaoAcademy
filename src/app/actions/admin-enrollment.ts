"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// ── Approve: pending → active + assign batch ──────────────────────────────────
export async function approveEnrollment(enrollmentId: string, batchId: string | null) {
  const supabase = await createClient(true);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("enrollments") as any)
    .update({ status: "active", batch_id: batchId || null })
    .eq("id", enrollmentId);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/enrollments");
}

// ── Cancel enrollment ─────────────────────────────────────────────────────────
export async function cancelEnrollment(enrollmentId: string) {
  const supabase = await createClient(true);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("enrollments") as any)
    .update({ status: "cancelled" })
    .eq("id", enrollmentId);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/enrollments");
}

// ── Update fee status ─────────────────────────────────────────────────────────
export async function updateFeeStatus(
  enrollmentId: string,
  feeStatus: "unpaid" | "partial" | "paid"
) {
  const supabase = await createClient(true);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("enrollments") as any)
    .update({ fee_status: feeStatus })
    .eq("id", enrollmentId);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/enrollments");
}

// ── Assign batch ──────────────────────────────────────────────────────────────
export async function assignBatch(enrollmentId: string, batchId: string) {
  const supabase = await createClient(true);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("enrollments") as any)
    .update({ batch_id: batchId })
    .eq("id", enrollmentId);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/enrollments");
}
