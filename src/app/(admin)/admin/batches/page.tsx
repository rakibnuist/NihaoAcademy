import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Plus, Radio, Video } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { courses, courseCategoryLabel } from "@/lib/courses";
import type { Batch } from "@/types/database";

type BatchRow = Batch & {
  instructors: { full_name: string } | null;
  enrollments: { count: number }[];
};

export const metadata: Metadata = { title: "Batches · Admin" };

export default async function BatchesPage() {
  const supabase = await createClient(true);

  const { data: rawBatches, error } = await supabase
    .from("batches")
    .select(`
      id, name, course_slug, division, start_date,
      schedule, is_active, capacity, created_at,
      instructors(full_name),
      enrollments(count)
    `)
    .order("created_at", { ascending: false });

  const batches = rawBatches as BatchRow[] | null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-xs font-semibold tracking-[0.2em] text-brand-red uppercase">
            Flight schedule
          </p>
          <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight">
            Batches
          </h1>
        </div>
        <Link
          href="/admin/batches/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="size-4" />
          New batch
        </Link>
      </div>

      {/* List */}
      {error ? (
        <div className="rounded-xl bg-card p-8 text-center text-sm text-destructive ring-1 ring-foreground/10">
          Error: {error.message}
        </div>
      ) : !batches || batches.length === 0 ? (
        <div className="rounded-xl bg-card px-5 py-16 text-center ring-1 ring-foreground/10">
          <BookOpen className="mx-auto size-10 text-muted-foreground/30" />
          <p className="mt-4 text-sm font-medium">No batches yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Create a batch for each running cohort.
          </p>
          <Link
            href="/admin/batches/new"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="size-4" /> New batch
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {batches.map((b) => {
            const course = courses.find((c) => c.slug === b.course_slug);
            const enrollCount =
              (b.enrollments as { count: number }[] | null)?.[0]?.count ?? 0;
            const fill = Math.round((enrollCount / b.capacity) * 100);

            return (
              <Link
                key={b.id}
                href={`/admin/batches/${b.id}`}
                className="group block rounded-xl bg-card ring-1 ring-foreground/10 transition-all hover:ring-primary/30 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2 border-b border-border px-5 py-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                          b.is_active
                            ? "bg-emerald-500/10 text-emerald-600"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {b.is_active ? "Active" : "Inactive"}
                      </span>
                      <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                        {b.division === "live" ? (
                          <><Radio className="size-3 text-primary" /> Live</>
                        ) : (
                          <><Video className="size-3 text-[oklch(0.45_0.11_70)]" /> Recorded</>
                        )}
                      </span>
                    </div>
                    <h3 className="mt-1.5 truncate font-heading text-base font-semibold">
                      {b.name}
                    </h3>
                  </div>
                </div>

                <div className="space-y-3 px-5 py-4 text-sm">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Course</span>
                    <span className="font-medium">
                      {course
                        ? courseCategoryLabel[course.category]
                        : b.course_slug}
                    </span>
                  </div>
                  {b.schedule && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Schedule</span>
                      <span className="font-mono font-medium">{b.schedule}</span>
                    </div>
                  )}
                  {b.start_date && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Start date</span>
                      <span className="font-medium">
                        {new Date(b.start_date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  )}

                  {/* Capacity bar */}
                  <div>
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Seats filled</span>
                      <span className="font-semibold">
                        {enrollCount} / {b.capacity}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className={`h-full rounded-full transition-all ${
                          fill >= 90
                            ? "bg-brand-red"
                            : fill >= 60
                            ? "bg-brand-gold"
                            : "bg-primary"
                        }`}
                        style={{ width: `${Math.min(fill, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
