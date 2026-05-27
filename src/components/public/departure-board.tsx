import Link from "next/link";
import { ArrowRight, Plane, Radio, Video } from "lucide-react";

import { cn } from "@/lib/utils";
import type { BrandAccent, Course } from "@/types";
import { carrierCode, courseCategoryLabel, formatBdt } from "@/lib/courses";

const accentText: Record<BrandAccent, string> = {
  blue: "text-primary",
  red: "text-brand-red",
  gold: "text-[oklch(0.55_0.12_74)]",
};
const accentBar: Record<BrandAccent, string> = {
  blue: "bg-primary",
  red: "bg-brand-red",
  gold: "bg-brand-gold",
};
const accentTile: Record<BrandAccent, string> = {
  blue: "bg-primary/10 text-primary",
  red: "bg-brand-red/10 text-brand-red",
  gold: "bg-brand-gold/20 text-[oklch(0.55_0.12_74)]",
};

function StatusPill({ course }: { course: Course }) {
  const hasLive = course.divisions.includes("live");
  const hasRecorded = course.divisions.includes("recorded");

  if (hasLive && hasRecorded) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 font-mono text-[10px] font-bold tracking-wider text-primary uppercase">
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
          <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
        </span>
        Boarding
      </span>
    );
  }
  if (hasLive) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-brand-red/10 px-2.5 py-1 font-mono text-[10px] font-bold tracking-wider text-brand-red uppercase">
        <Radio className="size-3" />
        Live only
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-brand-gold/15 px-2.5 py-1 font-mono text-[10px] font-bold tracking-wider text-[oklch(0.45_0.11_70)] uppercase">
      <Video className="size-3" />
      Anytime
    </span>
  );
}

export function DepartureBoard({ courses }: { courses: Course[] }) {
  return (
    <div className="overflow-hidden rounded-2xl ring-1 ring-foreground/10">
      {/* Header row */}
      <div className="hidden grid-cols-[2.5rem_1fr_auto] items-center gap-4 border-b border-border bg-primary px-5 py-3 font-mono text-[10px] font-semibold tracking-[0.18em] text-primary-foreground/60 uppercase sm:grid lg:grid-cols-[2.5rem_1fr_8rem_7rem_7rem_auto]">
        <span>#</span>
        <span>Flight / Route</span>
        <span className="hidden lg:block">Subjects</span>
        <span className="hidden lg:block">Duration</span>
        <span className="hidden lg:block">Fare</span>
        <span>Status</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-border bg-card">
        {courses.map((course, i) => {
          const Icon = course.icon;
          const hasLive = course.divisions.includes("live");
          const hasRecorded = course.divisions.includes("recorded");

          return (
            <Link
              key={course.slug}
              href={`/courses/${course.slug}`}
              className="group block outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/50"
            >
              <div className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 px-5 py-4 transition-colors hover:bg-secondary/60 sm:py-5 lg:grid-cols-[2.5rem_1fr_8rem_7rem_7rem_auto]">
                {/* Index */}
                <span className="font-mono text-[11px] font-semibold text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Main info */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Flight code */}
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-sm bg-secondary px-1.5 py-0.5 font-mono text-[10px] font-medium tracking-[0.12em] text-foreground/60 uppercase">
                      <Plane className="size-2.5" />
                      {carrierCode}·{course.code}
                    </span>
                    {/* Icon tile */}
                    <span className={cn("grid size-6 shrink-0 place-items-center rounded", accentTile[course.accent])}>
                      <Icon className="size-3.5" />
                    </span>
                    {/* Popular badge */}
                    {course.popular && (
                      <span className="rounded-full bg-brand-gold/20 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-[oklch(0.45_0.11_70)] uppercase">
                        Popular
                      </span>
                    )}
                  </div>

                  <h3 className="mt-1 font-heading text-base font-semibold leading-snug">
                    {course.name}
                  </h3>

                  {/* Route */}
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className={cn("font-medium", accentText[course.accent])}>{course.fromLabel}</span>
                    <span className="flex items-center gap-1">
                      <span className={cn("size-1 rounded-full", accentBar[course.accent])} />
                      <span className="h-px w-6 border-t border-dashed border-border" />
                      <Plane className="size-2.5 -rotate-45 text-muted-foreground/50" />
                      <span className="h-px w-6 border-t border-dashed border-border" />
                      <span className="size-1 rounded-full bg-brand-gold" />
                    </span>
                    <span>{course.toLabel}</span>
                  </div>

                  {/* Mobile-only details */}
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground lg:hidden">
                    {course.subjects && course.subjects.length > 0 && (
                      <span>{course.subjects.join(" · ")}</span>
                    )}
                    <span>{course.duration}</span>
                    <span className="font-semibold text-foreground">{formatBdt(course.priceBdt)}</span>
                    <span className="flex gap-1">
                      {hasLive && <Radio className="size-3 text-primary" />}
                      {hasRecorded && <Video className="size-3 text-[oklch(0.45_0.11_70)]" />}
                    </span>
                  </div>
                </div>

                {/* Subjects — desktop */}
                <div className="hidden min-w-0 lg:block">
                  {course.subjects && course.subjects.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {course.subjects.map((s) => (
                        <span
                          key={s}
                          className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[9px] font-semibold tracking-wider text-foreground/70 uppercase"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </div>

                {/* Duration — desktop */}
                <div className="hidden min-w-0 text-xs text-muted-foreground lg:block">
                  {course.duration}
                </div>

                {/* Fare — desktop */}
                <div className="hidden min-w-0 lg:block">
                  <span className="text-sm font-semibold">{formatBdt(course.priceBdt)}</span>
                  {course.priceNote && (
                    <p className="text-[10px] text-muted-foreground">{course.priceNote}</p>
                  )}
                </div>

                {/* Status + CTA */}
                <div className="flex shrink-0 items-center gap-3">
                  <StatusPill course={course} />
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
