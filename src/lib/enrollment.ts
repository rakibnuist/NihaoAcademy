/**
 * Shared enrollment helpers (no "use server" — safe to import anywhere).
 *
 * Enrollment state model (uses existing DB columns, no migration):
 *   - Free trial : status "active" + fee_status "unpaid" + notes contains TRIAL_NOTE_TAG
 *                  → access limited to lessons marked is_free_preview (the 2 free classes)
 *   - Paid (full): status "active" + fee_status "paid"
 *                  → full course, drip-unlocked
 *   - Pending    : status "pending" → awaiting payment/admin confirmation, no access yet
 */

export const TRIAL_NOTE_TAG = "[trial]";

export type EnrollmentStatus = "pending" | "active" | "completed" | "cancelled";
export type FeeStatus = "unpaid" | "partial" | "paid";

/** A trial enrollment: active access but not yet paid, tagged in notes. */
export function isTrial(
  status: string | null | undefined,
  feeStatus: string | null | undefined,
  notes: string | null | undefined
): boolean {
  return (
    status === "active" &&
    feeStatus !== "paid" &&
    typeof notes === "string" &&
    notes.includes(TRIAL_NOTE_TAG)
  );
}

/** A fully paid, active enrollment → full course access. */
export function isPaidActive(
  status: string | null | undefined,
  feeStatus: string | null | undefined
): boolean {
  return status === "active" && feeStatus === "paid";
}
