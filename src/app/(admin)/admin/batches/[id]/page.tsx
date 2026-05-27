import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  FileText,
  Plus,
  Radio,
  Video,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { courses } from "@/lib/courses";
import { ToggleBatchActiveButton } from "./toggle-active-button";
import { DeleteLessonButton } from "./delete-lesson-button";
import { AddLessonForm } from "./add-lesson-form";
import type { Lesson } from "@/types/database";

export const metadata: Metadata = { title: "Batch Detail · Admin" };

const TYPE_ICON: Record<Lesson["type"], React.ReactNode> = {
  video:    <Video    className="size-3.5 text-primary" />,
  live:     <Radio    className="size-3.5 text-emerald-500" />,
  quiz:     <FileText className="size-3.5 text-brand-gold" />,
  resource: <BookOpen className="size-3.5 text-muted-foreground" />,
};

const TYPE_LABEL: Record<Lesson["type"], string> = {
  video: "Video",
  live: "Live class",
  quiz: "Quiz",
  resource: "Resource",
};

export default async function BatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient(true);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: batch } = await (supabase.from("batches") as any)
    .select(
      "id, name, course_slug, division, start_date, schedule, capacity, is_active, created_at, instructors(full_name)"
    )
    .eq("id", id)
    .single();

  if (!batch) notFound();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: lessons } = await (supabase.from("lessons") as any)
    .select(
      "id, title, type, week_number, sort_order, duration_minutes, video_url, resource_url, is_free_preview"
    )
    .eq("batch_id", id)
    .order("week_number", { ascending: true })
    .order("sort_order", { ascending: true });

  const course = courses.find((c) => c.slug === batch.course_slug);

  // Group lessons by week
  const byWeek = ((lessons ?? []) as Lesson[]).reduce<Record<number, Lesson[]>>(
    (acc, lesson) => {
      const w = lesson.week_number;
      if (!acc[w]) acc[w] = [];
      acc[w].push(lesson);
      return acc;
    },
    {}
  );

  const weeks = Object.keys(byWeek)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="space-y-8">
      {/* Back nav */}
      <div>
        <Link
          href="/admin/batches"
          className="inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.12em] text-muted-foreground uppercase transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" /> All batches
        </Link>
      </div>

      {/* Batch header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                batch.is_active
                  ? "bg-emerald-500/10 text-emerald-600"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {batch.is_active ? "Active" : "Inactive"}
            </span>
            <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
              {batch.division === "live" ? (
                <>
                  <Radio className="size-3 text-primary" /> Live
                </>
              ) : (
                <>
                  <Video className="size-3 text-[oklch(0.45_0.11_70)]" /> Recorded
                </>
              )}
            </span>
          </div>
          <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight">
            {batch.name}
          </h1>
          {course && (
            <p className="mt-1 text-sm text-muted-foreground">{course.name}</p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Link
            href={`/admin/batches/${id}/edit`}
            className="rounded-lg border border-border px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-secondary"
          >
            Edit
          </Link>
          <ToggleBatchActiveButton
            batchId={id}
            isActive={batch.is_active}
          />
        </div>
      </div>

      {/* Meta strip */}
      <div className="flex flex-wrap gap-6 rounded-xl bg-card px-6 py-4 ring-1 ring-foreground/10 text-sm">
        {batch.schedule && (
          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-muted-foreground" />
            <span className="font-mono text-xs">{batch.schedule}</span>
          </div>
        )}
        {batch.start_date && (
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-muted-foreground" />
            <span className="text-xs">
              Starts{" "}
              {new Date(batch.start_date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        )}
        {batch.instructors && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Instructor:</span>
            <span className="text-xs font-semibold">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(batch.instructors as any).full_name}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Capacity:</span>
          <span className="text-xs font-semibold">{batch.capacity} seats</span>
        </div>
      </div>

      {/* Lessons section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-semibold">Lessons</h2>
          <span className="text-xs text-muted-foreground">
            {(lessons ?? []).length} lesson{(lessons ?? []).length !== 1 ? "s" : ""}
          </span>
        </div>

        {weeks.length === 0 ? (
          <div className="rounded-xl bg-card px-5 py-12 text-center ring-1 ring-foreground/10">
            <BookOpen className="mx-auto size-8 text-muted-foreground/30" />
            <p className="mt-3 text-sm font-medium">No lessons yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Add the first lesson below.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {weeks.map((week) => (
              <div key={week} className="space-y-2">
                <h3 className="font-mono text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  Week {week}
                </h3>
                <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 divide-y divide-border">
                  {byWeek[week].map((lesson, idx) => (
                    <div
                      key={lesson.id}
                      className="flex items-center gap-3 px-5 py-3"
                    >
                      {/* Sort order badge */}
                      <span className="w-5 shrink-0 text-center font-mono text-[10px] text-muted-foreground/60">
                        {idx + 1}
                      </span>

                      {/* Type icon */}
                      <span className="shrink-0">
                        {TYPE_ICON[lesson.type]}
                      </span>

                      {/* Title */}
                      <div className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">
                          {lesson.title}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {TYPE_LABEL[lesson.type]}
                          {lesson.duration_minutes
                            ? ` · ${lesson.duration_minutes} min`
                            : ""}
                          {lesson.is_free_preview ? " · Free preview" : ""}
                        </span>
                      </div>

                      {/* Links */}
                      <div className="flex shrink-0 items-center gap-2">
                        {lesson.video_url && (
                          <a
                            href={lesson.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-[10px] text-primary underline-offset-2 hover:underline"
                          >
                            Video
                          </a>
                        )}
                        {lesson.resource_url && (
                          <a
                            href={lesson.resource_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-[10px] text-muted-foreground underline-offset-2 hover:underline"
                          >
                            Resource
                          </a>
                        )}
                        <DeleteLessonButton
                          lessonId={lesson.id}
                          batchId={id}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add lesson form */}
        <div className="rounded-xl bg-card ring-1 ring-foreground/10">
          <div className="flex items-center gap-2 border-b border-border px-5 py-3">
            <Plus className="size-4 text-muted-foreground" />
            <span className="text-sm font-semibold">Add lesson</span>
          </div>
          <div className="px-5 py-5">
            <AddLessonForm batchId={id} courseSlug={batch.course_slug} />
          </div>
        </div>
      </div>
    </div>
  );
}
