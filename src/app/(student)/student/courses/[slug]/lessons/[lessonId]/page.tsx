import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, ExternalLink } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/server";
import { getCourse } from "@/lib/courses";
import { MarkCompleteButton } from "./mark-complete-button";
import type { Lesson } from "@/types/database";

export const metadata: Metadata = { title: "Lesson · NiHao Academy" };

/* Drip unlock check */
function isUnlocked(enrolledAt: string, weekNumber: number): boolean {
  const enrollDate = new Date(enrolledAt);
  const unlockDate = new Date(enrollDate);
  unlockDate.setDate(unlockDate.getDate() + (weekNumber - 1) * 7);
  return new Date() >= unlockDate;
}

export default async function LessonViewerPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>;
}) {
  const { slug, lessonId } = await params;
  const user = await getUser();
  if (!user) redirect(`/login?next=/student/courses/${slug}/lessons/${lessonId}`);

  const course = getCourse(slug);
  if (!course) notFound();

  const supabase = await createClient();

  /* Fetch lesson */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: lesson } = await (supabase.from("lessons") as any)
    .select("*")
    .eq("id", lessonId)
    .eq("course_slug", slug)
    .single();

  if (!lesson) notFound();

  const l = lesson as Lesson;

  /* Check access: free-preview lessons are open to anyone with an active
     enrollment (incl. trial). Everything else needs a PAID enrollment whose
     drip window has opened. */
  if (!l.is_free_preview) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: enrollment } = await (supabase.from("enrollments") as any)
      .select("id, enrolled_at, batch_id, fee_status")
      .eq("student_id", user.id)
      .eq("status", "active")
      .order("enrolled_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!enrollment) redirect(`/courses/${slug}`);

    // Trial (unpaid) users can't open paid lessons — send them back to upgrade.
    if (enrollment.fee_status !== "paid") {
      redirect(`/student/courses/${slug}`);
    }

    if (!isUnlocked(enrollment.enrolled_at, l.week_number)) {
      redirect(`/student/courses/${slug}`);
    }
  }

  /* Fetch existing progress */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: progress } = await (supabase.from("lesson_progress") as any)
    .select("watch_percent, completed, completed_at")
    .eq("student_id", user.id)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  const completed = progress?.completed ?? false;

  /* Adjacent lessons for prev/next nav */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: allLessons } = await (supabase.from("lessons") as any)
    .select("id, title, week_number, sort_order")
    .eq("course_slug", slug)
    .eq("batch_id", l.batch_id ?? null)
    .order("week_number", { ascending: true })
    .order("sort_order", { ascending: true });

  const lessons = (allLessons ?? []) as { id: string; title: string; week_number: number; sort_order: number }[];
  const currentIdx = lessons.findIndex((x) => x.id === lessonId);
  const prevLesson = currentIdx > 0 ? lessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < lessons.length - 1 ? lessons[currentIdx + 1] : null;

  /* Build Bunny.net embed URL if video */
  const videoUrl = l.video_url;
  const isBunny = videoUrl?.includes("mediadelivery.net") || videoUrl?.includes("bunnycdn");

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      {/* Back nav */}
      <Link
        href={`/student/courses/${slug}`}
        className="inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.12em] text-muted-foreground uppercase transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> All lessons
      </Link>

      {/* Lesson header */}
      <div className="space-y-1">
        <p className="font-mono text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          {course.code} · Week {l.week_number}
        </p>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {l.title}
        </h1>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="capitalize">
            {l.type === "live" ? "Live class" : l.type}
          </span>
          {l.duration_minutes && (
            <span>{l.duration_minutes} min</span>
          )}
          {completed && (
            <span className="text-emerald-600 font-semibold">✓ Completed</span>
          )}
        </div>
      </div>

      {/* Video player */}
      {videoUrl && (
        <div className="overflow-hidden rounded-xl bg-black ring-1 ring-foreground/10">
          {isBunny ? (
            <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
              <iframe
                src={videoUrl}
                className="absolute inset-0 h-full w-full"
                allowFullScreen
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
              />
            </div>
          ) : (
            <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
              <video
                src={videoUrl}
                controls
                className="absolute inset-0 h-full w-full"
              />
            </div>
          )}
        </div>
      )}

      {/* Resource link */}
      {l.resource_url && (
        <a
          href={l.resource_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary"
        >
          <BookOpen className="size-4" />
          Open resource
          <ExternalLink className="size-3.5 text-muted-foreground" />
        </a>
      )}

      {/* No media placeholder */}
      {!videoUrl && !l.resource_url && (
        <div className="rounded-xl bg-card px-5 py-12 text-center ring-1 ring-foreground/10">
          <BookOpen className="mx-auto size-8 text-muted-foreground/30" />
          <p className="mt-3 text-sm text-muted-foreground">
            Content will be available soon.
          </p>
        </div>
      )}

      {/* Mark complete + navigation */}
      <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
        <div className="flex items-center gap-3">
          {prevLesson && (
            <Link
              href={`/student/courses/${slug}/lessons/${prevLesson.id}`}
              className="rounded-lg border border-border px-3 py-2 text-sm font-semibold transition-colors hover:bg-secondary"
            >
              ← Prev
            </Link>
          )}
          {nextLesson && (
            <Link
              href={`/student/courses/${slug}/lessons/${nextLesson.id}`}
              className="rounded-lg border border-border px-3 py-2 text-sm font-semibold transition-colors hover:bg-secondary"
            >
              Next →
            </Link>
          )}
        </div>

        <MarkCompleteButton
          lessonId={lessonId}
          courseSlug={slug}
          completed={completed}
        />
      </div>
    </div>
  );
}
