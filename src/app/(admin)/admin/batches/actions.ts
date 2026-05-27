"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/* ── Batch CRUD ────────────────────────────────────────────────────────────── */

export async function createBatch(formData: FormData) {
  const supabase = await createClient(true);

  const courseSlug   = formData.get("course_slug") as string;
  const name         = formData.get("name") as string;
  const division     = formData.get("division") as "live" | "recorded";
  const startDate    = formData.get("start_date") as string | null;
  const schedule     = formData.get("schedule") as string | null;
  const instructorId = formData.get("instructor_id") as string | null;
  const capacity     = Number(formData.get("capacity") ?? 30);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from("batches") as any).insert({
    course_slug: courseSlug,
    name,
    division,
    start_date:    startDate    || null,
    schedule:      schedule     || null,
    instructor_id: instructorId || null,
    capacity,
    is_active: true,
  }).select("id").single();

  if (error) return { error: error.message };

  revalidatePath("/admin/batches");
  redirect(`/admin/batches/${data.id}`);
}

export async function updateBatch(batchId: string, formData: FormData) {
  const supabase = await createClient(true);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("batches") as any)
    .update({
      name:          formData.get("name") as string,
      start_date:    (formData.get("start_date") as string) || null,
      schedule:      (formData.get("schedule") as string)   || null,
      instructor_id: (formData.get("instructor_id") as string) || null,
      capacity:      Number(formData.get("capacity") ?? 30),
      is_active:     formData.get("is_active") === "true",
    })
    .eq("id", batchId);

  if (error) return { error: error.message };
  revalidatePath(`/admin/batches/${batchId}`);
  revalidatePath("/admin/batches");
  return { success: true };
}

/* ── Lesson CRUD ───────────────────────────────────────────────────────────── */

export async function addLesson(batchId: string, courseSlug: string, formData: FormData) {
  const supabase = await createClient(true);

  const type = formData.get("type") as "video" | "live" | "quiz" | "resource";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("lessons") as any).insert({
    course_slug:      courseSlug,
    batch_id:         batchId,
    title:            formData.get("title") as string,
    type,
    week_number:      Number(formData.get("week_number") ?? 1),
    sort_order:       Number(formData.get("sort_order") ?? 0),
    duration_minutes: Number(formData.get("duration_minutes") ?? null) || null,
    video_url:        (formData.get("video_url") as string) || null,
    resource_url:     (formData.get("resource_url") as string) || null,
    is_free_preview:  formData.get("is_free_preview") === "on",
  });

  if (error) return { error: error.message };
  revalidatePath(`/admin/batches/${batchId}`);
  return { success: true };
}

export async function deleteLesson(lessonId: string, batchId: string) {
  const supabase = await createClient(true);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("lessons") as any)
    .delete()
    .eq("id", lessonId);

  if (error) return { error: error.message };
  revalidatePath(`/admin/batches/${batchId}`);
  return { success: true };
}

export async function toggleBatchActive(batchId: string, isActive: boolean) {
  const supabase = await createClient(true);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from("batches") as any)
    .update({ is_active: isActive })
    .eq("id", batchId);

  revalidatePath(`/admin/batches/${batchId}`);
  revalidatePath("/admin/batches");
}
