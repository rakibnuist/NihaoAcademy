"use client";

import { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { toast } from "sonner";
import { markLessonComplete } from "@/app/(student)/actions";

export function MarkCompleteButton({
  lessonId,
  courseSlug,
  completed,
}: {
  lessonId: string;
  courseSlug: string;
  completed: boolean;
}) {
  const [done, setDone] = useState(completed);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    if (done) return; // only allow marking complete, not undoing
    setLoading(true);
    const result = await markLessonComplete(lessonId, courseSlug);
    setLoading(false);
    if (result?.error) {
      toast.error(result.error);
    } else {
      setDone(true);
      toast.success("Lesson marked complete!");
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading || done}
      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-default ${
        done
          ? "bg-emerald-500/10 text-emerald-600"
          : "bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
      }`}
    >
      {done ? (
        <>
          <CheckCircle2 className="size-4" /> Completed
        </>
      ) : loading ? (
        "Saving…"
      ) : (
        <>
          <Circle className="size-4" /> Mark complete
        </>
      )}
    </button>
  );
}
