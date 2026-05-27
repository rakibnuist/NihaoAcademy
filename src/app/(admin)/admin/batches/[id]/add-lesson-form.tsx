"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { addLesson } from "@/app/(admin)/admin/batches/actions";

export function AddLessonForm({
  batchId,
  courseSlug,
}: {
  batchId: string;
  courseSlug: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [type, setType] = useState<"video" | "live" | "quiz" | "resource">("video");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formRef.current) return;
    setLoading(true);
    const formData = new FormData(formRef.current);
    const result = await addLesson(batchId, courseSlug, formData);
    setLoading(false);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Lesson added");
      formRef.current.reset();
      setType("video");
    }
  }

  const inputCls =
    "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";
  const labelCls = "block text-xs font-semibold mb-1";

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      {/* Row 1: Title + Type */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="al-title">Title *</label>
          <input
            id="al-title"
            name="title"
            required
            placeholder="e.g. Introduction to Pinyin"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls} htmlFor="al-type">Type *</label>
          <select
            id="al-type"
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value as typeof type)}
            className={inputCls}
          >
            <option value="video">Video</option>
            <option value="live">Live class</option>
            <option value="quiz">Quiz</option>
            <option value="resource">Resource</option>
          </select>
        </div>
      </div>

      {/* Row 2: Week + Sort order + Duration */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelCls} htmlFor="al-week">Week *</label>
          <input
            id="al-week"
            name="week_number"
            type="number"
            min="1"
            defaultValue={1}
            required
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls} htmlFor="al-sort">Sort order</label>
          <input
            id="al-sort"
            name="sort_order"
            type="number"
            min="0"
            defaultValue={0}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls} htmlFor="al-duration">Duration (min)</label>
          <input
            id="al-duration"
            name="duration_minutes"
            type="number"
            min="1"
            placeholder="—"
            className={inputCls}
          />
        </div>
      </div>

      {/* Video URL — only for video/live */}
      {(type === "video" || type === "live") && (
        <div>
          <label className={labelCls} htmlFor="al-video">Video URL</label>
          <input
            id="al-video"
            name="video_url"
            type="url"
            placeholder="https://iframe.mediadelivery.net/…"
            className={inputCls}
          />
        </div>
      )}

      {/* Resource URL */}
      {(type === "resource" || type === "quiz") && (
        <div>
          <label className={labelCls} htmlFor="al-resource">Resource URL</label>
          <input
            id="al-resource"
            name="resource_url"
            type="url"
            placeholder="https://…"
            className={inputCls}
          />
        </div>
      )}

      {/* Free preview toggle */}
      <div className="flex items-center gap-2.5">
        <input
          id="al-free"
          name="is_free_preview"
          type="checkbox"
          className="size-4 rounded border-border"
        />
        <label htmlFor="al-free" className="text-sm">
          Free preview (visible without enrollment)
        </label>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          {loading ? "Adding…" : "Add lesson"}
        </button>
      </div>
    </form>
  );
}
