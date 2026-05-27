"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/server";

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
