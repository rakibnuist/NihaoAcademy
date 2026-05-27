"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { TRIAL_NOTE_TAG } from "@/lib/enrollment";

type Division = "live" | "recorded";

interface EnrollResult {
  success: boolean;
  message: string;
  /** Set when a paid checkout should begin (real gateway wired later). */
  redirectUrl?: string;
}

interface ExistingEnrollment {
  id: string;
  status: string;
  notes: string | null;
  batches: { course_slug: string } | null;
}

type Prep =
  | { ok: false; result: EnrollResult }
  | {
      ok: true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      user: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      supabaseAdmin: SupabaseClient<any, any, any>;
      existing: ExistingEnrollment | null;
      batchId: string | null;
    };

/**
 * Shared guard: ensures the user is logged in, their student row exists,
 * and surfaces any existing live enrollment for this course.
 */
async function prepareEnrollment(courseSlug: string, division: Division): Promise<Prep> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, result: { success: false, message: "Please log in first." } };
  }

  const supabaseAdmin = await createClient(true);

  // Ensure student record exists (trigger usually does this; belt-and-suspenders).
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

  // Already has a pending/active enrollment for this course?
  const { data: existing } = await supabase
    .from("enrollments")
    .select("id, status, notes, batches(course_slug)")
    .eq("student_id", user.id)
    .in("status", ["pending", "active"])
    .limit(20);

  const match = (existing as ExistingEnrollment[] | null)?.find(
    (e) => e.batches?.course_slug === courseSlug || (e.notes ?? "").includes(courseSlug)
  );

  // Find the best matching active batch.
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

  return {
    ok: true,
    user,
    supabaseAdmin,
    existing: match ?? null,
    batchId,
  };
}

/**
 * Start a FREE 2-class trial. Creates an active + unpaid enrollment whose
 * access is limited (in the course pages) to lessons marked is_free_preview.
 */
export async function startFreeTrial(
  courseSlug: string,
  division: Division
): Promise<EnrollResult> {
  const prep = await prepareEnrollment(courseSlug, division);
  if (!prep.ok) return prep.result;
  const { user, supabaseAdmin, existing, batchId } = prep;

  if (existing) {
    return { success: false, message: "You already have access to this course." };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabaseAdmin.from("enrollments") as any).insert({
    student_id: user.id,
    batch_id:   batchId,
    status:     "active",  // immediate access…
    fee_status: "unpaid",  // …but only to free-preview lessons
    notes:      `${TRIAL_NOTE_TAG} Free trial · ${courseSlug} · ${division}`,
  });

  if (error) return { success: false, message: error.message };

  revalidatePath("/student/dashboard");
  revalidatePath(`/courses/${courseSlug}`);

  return {
    success: true,
    message: "Free trial started! Your 2 free classes are unlocked in your dashboard.",
  };
}

/**
 * Begin a PAID enrollment. When an online payment gateway is configured
 * (SSLCommerz), this will return a checkout redirect URL. Until then it
 * records a pending enrollment so the team can confirm payment manually.
 */
export async function requestPaidEnrollment(
  courseSlug: string,
  division: Division
): Promise<EnrollResult> {
  const prep = await prepareEnrollment(courseSlug, division);
  if (!prep.ok) return prep.result;
  const { user, supabaseAdmin, existing, batchId } = prep;

  if (existing && existing.status === "active" && (existing.notes ?? "").includes(TRIAL_NOTE_TAG)) {
    // Trial → paid UPGRADE: keep the row, flip it to a pending paid request.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabaseAdmin.from("enrollments") as any)
      .update({
        status: "pending",
        notes: `Upgrade from trial · ${courseSlug} · ${division}`,
      })
      .eq("id", existing.id);
    if (error) return { success: false, message: error.message };
  } else if (existing) {
    return { success: false, message: "You already have an enrollment for this course." };
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabaseAdmin.from("enrollments") as any).insert({
      student_id: user.id,
      batch_id:   batchId,
      status:     "pending",
      fee_status: "unpaid",
      notes:      `Paid enrollment request · ${courseSlug} · ${division}`,
    });
    if (error) return { success: false, message: error.message };
  }

  revalidatePath("/student/dashboard");
  revalidatePath(`/courses/${courseSlug}`);

  // TODO(payment): once SSLCommerz creds are set, initiate a session here and
  // return { redirectUrl } so the client can send the user to checkout.
  return {
    success: true,
    message: "Enrollment requested! Our team will confirm your payment within 24 hours.",
  };
}

/** Back-compat alias for older callers. */
export async function requestEnrollment(
  courseSlug: string,
  division: Division
): Promise<{ success: boolean; message: string }> {
  const { success, message } = await requestPaidEnrollment(courseSlug, division);
  return { success, message };
}
