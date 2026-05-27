import Link from "next/link";
import { ArrowRight, Plane, Radio, Star, Users, Video } from "lucide-react";

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

export function CourseCard({ course, compact = false }: { course: Course; compact?: boolean }) {
  const Icon = course.icon;
  const hasLive = course.divisions.includes("live");
  const hasRecorded = course.divisions.includes("recorded");

  if (compact) {
    return (
      <Link
        href={`/courses/${course.slug}`}
        className="group flex items-center gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10 transition-all hover:ring-primary/30"
      >
        <span className={cn("grid size-10 shrink-0 place-items-center rounded-lg", accentTile[course.accent])}>
          <Icon className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-heading text-sm font-semibold leading-snug">{course.shortName}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{formatBdt(course.priceBdt)}</p>
        </div>
        <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </Link>
    );
  }

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group block h-full rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <article className="relative flex h-full flex-col overflow-hidden rounded-xl bg-card shadow-sm ring-1 ring-foreground/10 transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-primary/10 group-hover:ring-primary/30">
        <span className={cn("h-1.5 w-full", accentBar[course.accent])} />

        <div className="flex flex-1 flex-col p-5">
          {/* Flight code row */}
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-sm bg-secondary px-2 py-1 font-mono text-[11px] font-medium tracking-[0.12em] text-foreground/70 uppercase">
              <Plane className="size-3" />
              {carrierCode}·{course.code} · {course.gate}
            </span>
            <span className={cn("grid size-9 place-items-center rounded-md", accentTile[course.accent])}>
              <Icon className="size-4" />
            </span>
          </div>

          {/* Category + badges row */}
          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            <p className={cn("font-mono text-[11px] font-medium tracking-[0.16em] uppercase", accentText[course.accent])}>
              {courseCategoryLabel[course.category]}
            </p>
            {course.popular && (
              <span className="rounded-full bg-brand-gold/20 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[oklch(0.45_0.11_70)] uppercase">
                Popular
              </span>
            )}
          </div>

          <h3 className="mt-1 font-heading text-xl leading-tight font-semibold tracking-tight">
            {course.shortName}
          </h3>

          {/* Subjects chips */}
          {course.subjects && course.subjects.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1">
              {course.subjects.map((s) => (
                <span
                  key={s}
                  className="rounded-md bg-secondary px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wide text-foreground/70 uppercase"
                >
                  {s}
                </span>
              ))}
            </div>
          )}

          {/* Route line */}
          <div className="mt-4 flex items-center gap-2 text-[13px] font-medium">
            <span className="shrink-0 text-foreground">{course.fromLabel}</span>
            <span className="flex flex-1 items-center">
              <span className={cn("size-1.5 shrink-0 rounded-full", accentBar[course.accent])} />
              <span className="h-0 flex-1 border-t border-dashed border-border" />
              <Plane className="size-3.5 shrink-0 -rotate-45 text-muted-foreground" />
              <span className="h-0 flex-1 border-t border-dashed border-border" />
              <span className="size-1.5 shrink-0 rounded-full bg-brand-gold" />
            </span>
            <span className="shrink-0 text-foreground">{course.toLabel}</span>
          </div>

          <p className="mt-4 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
            {course.summary}
          </p>
        </div>

        {/* Perforation */}
        <div className="relative">
          <div className="border-t-2 border-dashed border-border" />
          <span className="absolute top-1/2 -left-2.5 size-5 -translate-y-1/2 rounded-full bg-background" />
          <span className="absolute top-1/2 -right-2.5 size-5 -translate-y-1/2 rounded-full bg-background" />
        </div>

        {/* Stub */}
        <div className="flex items-center justify-between bg-secondary/50 px-5 py-4">
          <div className="space-y-1.5">
            <div className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
              Fare
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-semibold text-foreground">
                {formatBdt(course.priceBdt)}
              </span>
              {course.priceNote && (
                <span className="text-xs text-muted-foreground">{course.priceNote}</span>
              )}
            </div>
            {/* Rating + students */}
            <div className="flex items-center gap-2">
              {course.rating && (
                <span className="flex items-center gap-0.5 text-xs font-medium text-foreground">
                  <Star className="size-3 fill-brand-gold text-brand-gold" />
                  {course.rating.toFixed(1)}
                </span>
              )}
              {course.enrolledCount && (
                <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                  <Users className="size-3" />
                  {course.enrolledCount.toLocaleString()}
                </span>
              )}
            </div>
            {/* Division badges */}
            <div className="flex gap-1">
              {hasLive && (
                <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-wider text-primary uppercase">
                  <Radio className="size-2.5" />
                  Live
                </span>
              )}
              {hasRecorded && (
                <span className="inline-flex items-center gap-1 rounded bg-brand-gold/20 px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-wider text-[oklch(0.45_0.11_70)] uppercase">
                  <Video className="size-2.5" />
                  Rec
                </span>
              )}
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-all group-hover:gap-2">
            Board now
            <ArrowRight className="size-4" />
          </span>
        </div>
      </article>
    </Link>
  );
}
