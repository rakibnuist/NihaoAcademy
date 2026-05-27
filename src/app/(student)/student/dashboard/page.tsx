import type { Metadata } from "next";
import { BookOpen, PlaneTakeoff } from "lucide-react";
import Link from "next/link";

import { createClient }              from "@/lib/supabase/server";
import { getUser, getProfile }       from "@/lib/supabase/server";
import { getCourse }                 from "@/lib/courses";
import { EnrolledCourseCard }        from "@/components/student/enrolled-course-card";
import { NextClassPanel }            from "@/components/student/next-class-panel";
import { AnnouncementsList }         from "@/components/student/announcements-list";
import type { Enrollment, Announcement } from "@/types/database";

export const metadata: Metadata = { title: "My Dashboard · NiHao Academy" };

/* ── row shapes ───────────────────────────────────────────────────────────── */
type BatchRow = {
  id: string;
  name: string;
  course_slug: string;
  division: "live" | "recorded";
  schedule: string | null;
  start_date: string | null;
};

type EnrollmentRow = Pick<Enrollment, "id" | "status" | "fee_status" | "enrolled_at"> & {
  batches: BatchRow | null;
};

type AnnouncementRow = Pick<Announcement, "id" | "title" | "body" | "created_at">;

export default async function StudentDashboardPage() {
  const [user, profile] = await Promise.all([getUser(), getProfile()]);
  const firstName = (profile?.full_name ?? user?.phone ?? "Student").split(" ")[0];

  const supabase = await createClient();

  /* ── enrollments with batch info ──────────────────────────────────────── */
  const { data: rawEnrollments } = await supabase
    .from("enrollments")
    .select(
      "id, status, fee_status, enrolled_at, batches(id, name, course_slug, division, schedule, start_date)"
    )
    .eq("student_id", user!.id)
    .in("status", ["active", "pending"])
    .order("enrolled_at", { ascending: false });

  const enrollments = (rawEnrollments ?? []) as EnrollmentRow[];

  /* ── batch IDs for announcement filter ───────────────────────────────── */
  const batchIds = enrollments
    .map((e) => e.batches?.id)
    .filter(Boolean) as string[];

  /* ── announcements: global (batch_id null) + student's batches ─────── */
  const { data: rawAnnouncements } = batchIds.length
    ? await supabase
        .from("announcements")
        .select("id, title, body, created_at")
        .or(`batch_id.is.null,batch_id.in.(${batchIds.join(",")})`)
        .order("created_at", { ascending: false })
        .limit(10)
    : await supabase
        .from("announcements")
        .select("id, title, body, created_at")
        .is("batch_id", null)
        .order("created_at", { ascending: false })
        .limit(10);

  const announcements = (rawAnnouncements ?? []) as AnnouncementRow[];

  /* ── find soonest live batch ──────────────────────────────────────────── */
  const liveEnrollment = enrollments.find(
    (e) => e.batches?.division === "live" && e.status === "active"
  );
  const liveBatch   = liveEnrollment?.batches ?? null;
  const liveCourse  = liveBatch ? getCourse(liveBatch.course_slug) : null;

  const hasEnrollments = enrollments.length > 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ── Welcome banner ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-8 text-primary-foreground sm:px-8">
        {/* Decorative flight path */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 opacity-10">
          <svg viewBox="0 0 200 200" fill="none" className="h-full w-full">
            <path
              d="M200 0 C120 40, 80 80, 0 200"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="4 6"
            />
            <path
              d="M200 40 C130 70, 90 110, 20 200"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="4 6"
            />
          </svg>
        </div>

        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 font-mono text-[11px] tracking-[0.2em] text-brand-gold uppercase">
          <PlaneTakeoff className="size-3.5" />
          In flight
        </span>

        <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Welcome back, {firstName}
        </h1>

        <p className="mt-2 text-primary-foreground/70">
          {hasEnrollments
            ? `You have ${enrollments.length} active ${enrollments.length === 1 ? "course" : "courses"}. Keep flying.`
            : "Your journey is about to begin. Browse courses and enrol to get started."}
        </p>

        {!hasEnrollments && (
          <Link
            href="/courses"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20"
          >
            <BookOpen className="size-4" />
            Browse courses
          </Link>
        )}
      </div>

      {/* ── Main grid ──────────────────────────────────────────────────── */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Left: My courses (2/3 width on large) */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold">My courses</h2>
            {hasEnrollments && (
              <Link
                href="/courses"
                className="text-xs font-semibold text-brand-red hover:underline"
              >
                Browse more
              </Link>
            )}
          </div>

          {hasEnrollments ? (
            <div className="space-y-4">
              {enrollments.map((e) =>
                e.batches ? (
                  <EnrolledCourseCard
                    key={e.id}
                    enrollment={e}
                    batch={e.batches}
                  />
                ) : null
              )}
            </div>
          ) : (
            <div className="rounded-xl bg-card px-6 py-12 text-center ring-1 ring-foreground/10">
              <BookOpen className="mx-auto size-10 text-muted-foreground/40" />
              <p className="mt-3 text-sm font-medium">No courses yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Once you enrol, your courses will appear here.
              </p>
              <Link
                href="/courses"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Browse courses
              </Link>
            </div>
          )}
        </div>

        {/* Right sidebar: Next class + Announcements */}
        <div className="flex flex-col gap-6">
          {/* Next live class */}
          {liveBatch && liveCourse?.live ? (
            <NextClassPanel
              batchName={liveBatch.name}
              courseName={liveCourse.name}
              live={liveCourse.live}
            />
          ) : (
            <div className="rounded-xl bg-card ring-1 ring-foreground/10">
              <div className="flex items-center gap-2 border-b border-border px-5 py-3">
                <span className="font-mono text-[10px] font-semibold tracking-[0.14em] uppercase text-muted-foreground">
                  Next live class
                </span>
              </div>
              <div className="px-5 py-6 text-center">
                <p className="text-sm text-muted-foreground">
                  No live classes scheduled yet.
                </p>
              </div>
            </div>
          )}

          {/* Announcements */}
          <AnnouncementsList announcements={announcements} />
        </div>
      </div>
    </div>
  );
}
