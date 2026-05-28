"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/server";

/** Auto-complete threshold (% watched) used by the player tracker. */
const AUTO_COMPLETE_PCT = 70;

/**
 * Update a student's watch progress for a lesson. Called by the client player
 * roughly every 10 seconds while playing. Idempotent and safe to call often —
 * it only writes when the percentage moves forward, and flips
 * completed=true once we cross AUTO_COMPLETE_PCT.
 *
 * This is the data source for automated attendance/engagement (M9).
 */
export async function updateWatchProgress(
  lessonId: string,
  watchPercent: number
) {
  const user = await getUser();
  if (!user) return { error: "Not authenticated" };

  const pct = Math.max(0, Math.min(100, Math.round(watchPercent)));
  const supabase = await createClient();

  // Read current row so we never DECREASE a stored percent (e.g. user scrubs back).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: current } = await (supabase.from("lesson_progress") as any)
    .select("watch_percent, completed, completed_at")
    .eq("student_id", user.id)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  const prevPct = current?.watch_percent ?? 0;
  const wasCompleted = current?.completed ?? false;

  // Nothing to do if we already saved a higher percent AND it's already complete.
  if (pct <= prevPct && wasCompleted) return { success: true };

  const nextPct = Math.max(prevPct, pct);
  const nextCompleted = wasCompleted || nextPct >= AUTO_COMPLETE_PCT;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("lesson_progress") as any).upsert(
    {
      student_id:    user.id,
      lesson_id:     lessonId,
      watch_percent: nextPct,
      completed:     nextCompleted,
      completed_at:  nextCompleted && !wasCompleted
        ? new Date().toISOString()
        : current?.completed_at ?? null,
      updated_at:    new Date().toISOString(),
    },
    { onConflict: "student_id,lesson_id" }
  );

  if (error) return { error: error.message };
  return { success: true, watchPercent: nextPct, completed: nextCompleted };
}

export async function markLessonComplete(lessonId: string, courseSlug: string) {
  const user = await getUser();
  if (!user) return { error: "Not authenticated" };

  const supabase = await createClient();

  // Upsert progress — mark as 100% watched and completed
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("lesson_progress") as any).upsert(
    {
      student_id: user.id,
      lesson_id: lessonId,
      watch_percent: 100,
      completed: true,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "student_id,lesson_id" }
  );

  if (error) return { error: error.message };

  revalidatePath(`/student/courses/${courseSlug}`);
  return { success: true };
}
