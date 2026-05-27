"use client";

import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteLesson } from "@/app/(admin)/admin/batches/actions";

export function DeleteLessonButton({ lessonId, batchId }: { lessonId: string; batchId: string }) {
  async function handleDelete() {
    if (!confirm("Delete this lesson?")) return;
    const result = await deleteLesson(lessonId, batchId);
    if (result?.error) toast.error(result.error);
    else toast.success("Lesson deleted");
  }
  return (
    <button
      onClick={handleDelete}
      className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
      title="Delete lesson"
    >
      <Trash2 className="size-3.5" />
    </button>
  );
}
