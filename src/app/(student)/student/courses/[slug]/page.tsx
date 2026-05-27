import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
  Lock,
  Radio,
  Video,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/server";
import { getCourse } from "@/lib/courses";
import type { Lesson, LessonProgress } from "@/types/database";

export const metadata: Metadata = { title: "My Course · NiHao Academy" };

/* Drip logic: week N unlocks N*7 days after enrollment */
function isUnlocked(enrolledAt: string, weekNumber: number): boolean {
  const enrollDate = new Date(enrolledAt);
  const unlockDate = new Date(enrollDate);
  unlockDate.setDate(unlockDate.getDate() + (weekNumber - 1) * 7);
  return new Date() >= unlockDate;
}

const TYPE_ICON = {
  video:    <Video    className="size-4 shrink-0" />,
  live:     <Radio    className="size-4 shrink-0" />,
  quiz:     <FileText className="size-4 shrink-0" />,
  resource: <BookOpen className="size-4 shrink-0" />,
};

export default async function StudentCoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await getUser();
  if (!user) redirect(`/login?next=/student/courses/${slug}`);

  const course = getCourse(slug);
  if (!course) notFound();

  const supabase = await createClient();

  /* Find an active enrollment for this course (may be batch-linked or direct) */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rawEnrollment } = await (supabase.from("enrollments") as any)
    .select(
      "id, enrolled_at, batch_id, batches(id, name, course_slug, division, start_date, schedule)"
    )
    .eq("student_id", user.id)
    .eq("status", "active")
    .or(
      `batch_id.in.(select id from batches where course_slug.eq.${slug}),notes.ilike.%${slug}%`
    )
    .order("enrolled_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  /* Fallback: join via batch */
  let enrollment = rawEnrollment;
  if (!enrollment) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase.from("enrollments") as any)
      .select(
        "id, enrolled_at, batch_id, batches!inner(id, name, course_slug, division, start_date, schedule)"
      )
      .eq("student_id", user.id)
      .eq("status", "active")
      .eq("batches.course_slug", slug)
      .order("enrolled_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    enrollment = data;
  }

  if (!enrollment) {
    redirect(`/courses/${slug}`);
  }

  /* Fetch lessons for this batch (or course-level if no batch) */
  const batchId = enrollment.batch_id;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lessonQuery = (supabase.from("lessons") as any)
    .select(
      "id, title, type, week_number, sort_order, duration_minutes, is_free_preview, video_url, resource_url"
    )
    .eq("course_slug", slug)
    .order("week_number", { ascending: true })
    .order("sort_order", { ascending: true });

  const { data: rawLessons } = batchId
    ? await lessonQuery.eq("batch_id", batchId)
    : await lessonQuery.is("batch_id", null);

  const lessons = (rawLessons ?? []) as Lesson[];

  /* Fetch progress for these lessons */
  const lessonIds = lessons.map((l) => l.id);
  let progressMap: Record<string, LessonProgress> = {};
  if (lessonIds.length) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: rawProgress } = await (supabase.from("lesson_progress") as any)
      .select("lesson_id, watch_percent, completed, completed_at")
      .eq("student_id", user.id)
      .in("lesson_id", lessonIds);
    progressMap = Object.fromEntries(
      ((rawProgress ?? []) as LessonProgress[]).map((p) => [p.lesson_id, p])
    );
  }

  /* Group lessons by week */
  const byWeek = lessons.reduce<Record<number, Lesson[]>>((acc, lesson) => {
    const w = lesson.week_number;
    if (!acc[w]) acc[w] = [];
    acc[w].push(lesson);
    return acc;
  }, {});

  const weeks = Object.keys(byWeek)
    .map(Number)
    .sort((a, b) => a - b);

  const completedCount = lessons.filter(
    (l) => progressMap[l.id]?.completed
  ).length;
  const progressPct = lessons.length
    ? Math.round((completedCount / lessons.length) * 100)
    : 0;

  const batch = enrollment.batches as {
    id: string;
    name: string;
    course_slug: string;
    division: "live" | "recorded";
    start_date: string | null;
    schedule: string | null;
  } | null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-8">
      {/* Course header */}
      <div className="space-y-1">
        <p className="font-mono text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          {course.code} · {course.category.toUpperCase()}
        </p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          {course.name}
        </h1>
        {batch && (
          <p className="text-sm text-muted-foreground">{batch.name}</p>
        )}
      </div>

      {/* Progress bar */}
      {lessons.length > 0 && (
        <div className="rounded-xl bg-card px-5 py-4 ring-1 ring-foreground/10 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold">Your progress</span>
            <span className="font-mono text-xs text-muted-foreground">
              {completedCount} / {lessons.length} lessons
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">{progressPct}% complete</p>
        </div>
      )}

      {/* Lesson weeks */}
      {weeks.length === 0 ? (
        <div className="rounded-xl bg-card px-5 py-16 text-center ring-1 ring-foreground/10">
          <BookOpen className="mx-auto size-8 text-muted-foreground/30" />
          <p className="mt-3 text-sm font-medium">No lessons yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Your instructor will publish lessons soon.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {weeks.map((week) => {
            const unlocked = isUnlocked(enrollment.enrolled_at, week);
            return (
              <div key={week} className="space-y-2">
                <div className="flex items-center gap-2">
                  <h2 className="font-mono text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                    Week {week}
                  </h2>
                  {!unlocked && (
                    <span className="flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                      <Lock className="size-2.5" /> Unlocks{" "}
                      {new Date(
                        new Date(enrollment.enrolled_at).getTime() +
                          (week - 1) * 7 * 86400000
                      ).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  )}
                </div>

                <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 divide-y divide-border">
                  {byWeek[week].map((lesson) => {
                    const progress = progressMap[lesson.id];
                    const completed = progress?.completed ?? false;
                    const watchPct = progress?.watch_percent ?? 0;
                    const accessible = unlocked || lesson.is_free_preview;

                    return (
                      <div key={lesson.id} className="relative">
                        {/* Watch progress bar */}
                        {watchPct > 0 && !completed && (
                          <div
                            className="absolute bottom-0 left-0 h-0.5 bg-primary/40"
                            style={{ width: `${watchPct}%` }}
                          />
                        )}

                        {accessible ? (
                          <Link
                            href={`/student/courses/${slug}/lessons/${lesson.id}`}
                            className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-secondary/50"
                          >
                            <LessonRow
                              lesson={lesson}
                              completed={completed}
                              watchPct={watchPct}
                            />
                          </Link>
                        ) : (
                          <div className="flex cursor-not-allowed items-center gap-3 px-5 py-4 opacity-50">
                            <LessonRow
                              lesson={lesson}
                              completed={completed}
                              watchPct={watchPct}
                              locked
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function LessonRow({
  lesson,
  completed,
  watchPct,
  locked,
}: {
  lesson: Lesson;
  completed: boolean;
  watchPct: number;
  locked?: boolean;
}) {
  return (
    <>
      {/* Type icon */}
      <span
        className={`shrink-0 ${
          completed ? "text-emerald-500" : "text-muted-foreground"
        }`}
      >
        {completed ? (
          <CheckCircle2 className="size-4" />
        ) : locked ? (
          <Lock className="size-4" />
        ) : (
          TYPE_ICON[lesson.type]
        )}
      </span>

      {/* Title */}
      <div className="min-w-0 flex-1">
        <span className={`block truncate text-sm font-medium ${completed ? "text-muted-foreground line-through" : ""}`}>
          {lesson.title}
        </span>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <span className="capitalize">{lesson.type === "live" ? "Live class" : lesson.type}</span>
          {lesson.duration_minutes && (
            <>
              <span>·</span>
              <span className="flex items-center gap-0.5">
                <Clock className="size-2.5" />
                {lesson.duration_minutes} min
              </span>
            </>
          )}
          {lesson.is_free_preview && (
            <>
              <span>·</span>
              <span className="text-primary font-semibold">Free preview</span>
            </>
          )}
          {!completed && watchPct > 0 && (
            <>
              <span>·</span>
              <span>{watchPct}% watched</span>
            </>
          )}
        </div>
      </div>
    </>
  );
}
