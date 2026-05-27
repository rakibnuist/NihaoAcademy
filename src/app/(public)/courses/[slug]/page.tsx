import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  Clock,
  FlaskConical,
  GraduationCap,
  Plane,
  Radio,
  Sparkles,
  Video,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { BrandAccent } from "@/types";
import {
  carrierCode,
  courseCategoryLabel,
  courses,
  formatBdt,
  getCourse,
} from "@/lib/courses";
import { siteConfig } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/public/container";
import { LiveClassPanel } from "@/components/public/live-class-panel";
import { RecordedPanel } from "@/components/public/recorded-panel";

const accentBar: Record<BrandAccent, string> = {
  blue: "bg-primary",
  red: "bg-brand-red",
  gold: "bg-brand-gold",
};
const accentText: Record<BrandAccent, string> = {
  blue: "text-primary",
  red: "text-brand-red",
  gold: "text-[oklch(0.55_0.12_74)]",
};
const accentBg: Record<BrandAccent, string> = {
  blue: "bg-primary/10 text-primary",
  red: "bg-brand-red/10 text-brand-red",
  gold: "bg-brand-gold/20 text-[oklch(0.55_0.12_74)]",
};

export function generateStaticParams() {
  return courses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) return { title: "Course not found" };
  return {
    title: course.shortName,
    description: course.summary,
  };
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  const enrollHref = `/enroll?course=${course.slug}`;
  const hasLive = course.divisions.includes("live");
  const hasRecorded = course.divisions.includes("recorded");
  const liveOnly = hasLive && !hasRecorded;
  const recordedOnly = !hasLive && hasRecorded;
  const both = hasLive && hasRecorded;

  return (
    <article>
      {/* ─── Hero ─── */}
      <section className="relative border-b border-border bg-secondary/30">
        <div
          aria-hidden
          className="bg-dots pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
        />
        <Container className="relative py-10 lg:py-14">
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.12em] text-muted-foreground uppercase transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Departures board
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-12">
            <div>
              {/* Flight code */}
              <span className="inline-flex items-center gap-1.5 rounded-sm bg-card px-2 py-1 font-mono text-[11px] font-medium tracking-[0.12em] text-foreground/70 uppercase ring-1 ring-foreground/10">
                <Plane className="size-3" />
                {carrierCode}·{course.code} · {course.gate}
              </span>

              {/* Category */}
              <p className={cn("mt-5 font-mono text-xs font-semibold tracking-[0.18em] uppercase", accentText[course.accent])}>
                {courseCategoryLabel[course.category]}
              </p>
              <h1 className="mt-2 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
                {course.name}
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                {course.tagline}.
              </p>

              {/* Subjects */}
              {course.subjects && course.subjects.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <FlaskConical className="size-3.5 text-muted-foreground" />
                  {course.subjects.map((s) => (
                    <span
                      key={s}
                      className="rounded-md bg-secondary px-2.5 py-1 font-mono text-xs font-semibold tracking-wide text-foreground/80 uppercase"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {/* Route line */}
              <div className="mt-7 flex max-w-md items-center gap-3 text-sm font-semibold">
                <span className="shrink-0">{course.fromLabel}</span>
                <span className="flex flex-1 items-center">
                  <span className={cn("size-2 shrink-0 rounded-full", accentBar[course.accent])} />
                  <span className="h-0 flex-1 border-t-2 border-dashed border-border" />
                  <Plane className="size-4 shrink-0 -rotate-45 text-muted-foreground" />
                  <span className="h-0 flex-1 border-t-2 border-dashed border-border" />
                  <span className="size-2 shrink-0 rounded-full bg-brand-gold" />
                </span>
                <span className="shrink-0">{course.toLabel}</span>
              </div>

              {/* Meta chips */}
              <div className="mt-7 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-xs font-medium text-foreground/80 ring-1 ring-foreground/10">
                  <GraduationCap className="size-3.5 text-muted-foreground" />
                  {course.level}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-xs font-medium text-foreground/80 ring-1 ring-foreground/10">
                  <Clock className="size-3.5 text-muted-foreground" />
                  {course.duration}
                </span>
                {hasLive && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary ring-1 ring-primary/20">
                    <Radio className="size-3.5" />
                    Live classes
                  </span>
                )}
                {hasRecorded && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-gold/15 px-3 py-1.5 text-xs font-semibold text-[oklch(0.45_0.11_70)] ring-1 ring-brand-gold/30">
                    <Video className="size-3.5" />
                    {both ? "Recorded library included" : "Recorded · self-paced"}
                  </span>
                )}
              </div>
            </div>

            {/* Fare card */}
            <div className="lg:pt-2">
              <div className="overflow-hidden rounded-xl bg-card shadow-lg shadow-primary/5 ring-1 ring-foreground/10">
                <span className={cn("block h-1.5 w-full", accentBar[course.accent])} />
                <div className="p-6">
                  <div className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
                    Fare
                  </div>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="font-heading text-3xl font-semibold">
                      {formatBdt(course.priceBdt)}
                    </span>
                    {course.priceNote && (
                      <span className="text-sm text-muted-foreground">{course.priceNote}</span>
                    )}
                  </div>

                  <Link
                    href={enrollHref}
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "mt-5 h-11 w-full bg-brand-red text-brand-red-foreground hover:bg-brand-red/90"
                    )}
                  >
                    Reserve your seat
                    <ArrowRight />
                  </Link>

                  <dl className="mt-6 space-y-3 border-t border-dashed border-border pt-5 text-sm">
                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-muted-foreground">Duration</dt>
                      <dd className="text-right font-medium">{course.duration}</dd>
                    </div>
                    {hasLive && course.live && (
                      <div className="flex items-start justify-between gap-4">
                        <dt className="text-muted-foreground">Live schedule</dt>
                        <dd className="text-right font-medium">{course.live.scheduleLabel}</dd>
                      </div>
                    )}
                    {hasRecorded && (
                      <div className="flex items-start justify-between gap-4">
                        <dt className="text-muted-foreground">Recorded lessons</dt>
                        <dd className="text-right font-medium">{course.recorded.lessons} lessons</dd>
                      </div>
                    )}
                    {recordedOnly && (
                      <div className="flex items-start justify-between gap-4">
                        <dt className="text-muted-foreground">Access</dt>
                        <dd className="text-right font-medium">{course.recorded.accessLabel}</dd>
                      </div>
                    )}
                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-muted-foreground">Division</dt>
                      <dd className="text-right">
                        <span className="font-medium">
                          {liveOnly
                            ? "Live only"
                            : recordedOnly
                            ? "Recorded only"
                            : "Live + Recorded"}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── Body ─── */}
      <Container className="grid gap-12 py-14 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
        <div className="space-y-12">
          {/* About */}
          <div>
            <h2 className="font-heading text-2xl font-semibold tracking-tight">
              About this route
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              {course.description}
            </p>
          </div>

          {/* Includes */}
          <div>
            <h2 className="font-heading text-2xl font-semibold tracking-tight">
              What&apos;s included
            </h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {course.highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-lg bg-card p-4 ring-1 ring-foreground/10"
                >
                  <span className={cn("mt-0.5 grid size-5 shrink-0 place-items-center rounded-full", accentBar[course.accent])}>
                    <Check className="size-3 text-white" />
                  </span>
                  <span className="text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Flight plan */}
          <div>
            <h2 className="font-heading text-2xl font-semibold tracking-tight">
              Flight plan
            </h2>
            <ol className="mt-6 space-y-0">
              {course.modules.map((mod, i) => (
                <li key={mod.title} className="relative flex gap-4 pb-6 last:pb-0">
                  {i < course.modules.length - 1 && (
                    <span
                      aria-hidden
                      className="absolute top-9 bottom-0 left-[17px] border-l-2 border-dashed border-border"
                    />
                  )}
                  <span className="relative z-10 grid size-9 shrink-0 place-items-center rounded-full bg-primary font-mono text-xs font-semibold text-primary-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="pt-1">
                    <h3 className="font-heading text-base font-semibold">{mod.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {mod.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Outcomes */}
          <div className="rounded-xl bg-secondary/50 p-6 ring-1 ring-foreground/10">
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-brand-gold" />
              <h2 className="font-heading text-xl font-semibold tracking-tight">
                Where you&apos;ll land
              </h2>
            </div>
            <ul className="mt-4 space-y-3">
              {course.outcomes.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <BadgeCheck className={cn("mt-0.5 size-5 shrink-0", accentText[course.accent])} />
                  <span className="text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Division detail badges — visual summary */}
          <div className="grid gap-4 sm:grid-cols-2">
            {hasLive && course.live && (
              <div className={cn("rounded-xl p-5 ring-1", accentBg[course.accent], "ring-foreground/10 bg-card")}>
                <div className="flex items-center gap-2">
                  <span className="grid size-8 place-items-center rounded-md bg-primary/10">
                    <Radio className="size-4 text-primary" />
                  </span>
                  <span className="font-heading text-sm font-semibold">Live Division</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {course.live.scheduleLabel} · {course.live.durationMinutes} min per session via Zoom
                </p>
              </div>
            )}
            {hasRecorded && (
              <div className="rounded-xl bg-card p-5 ring-1 ring-foreground/10">
                <div className="flex items-center gap-2">
                  <span className="grid size-8 place-items-center rounded-md bg-brand-gold/20">
                    <Video className="size-4 text-[oklch(0.45_0.11_70)]" />
                  </span>
                  <span className="font-heading text-sm font-semibold">Recorded Division</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {course.recorded.lessons} lessons · {course.recorded.accessLabel} · watch any time
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ─── Sidebar ─── */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {/* Live panel */}
          {hasLive && course.live && (
            <LiveClassPanel
              live={course.live}
              code={`${carrierCode}·${course.code}`}
            />
          )}

          {/* Recorded panel */}
          {hasRecorded && (
            <RecordedPanel
              recorded={course.recorded}
              code={`${carrierCode}·${course.code}`}
            />
          )}

          {/* Advisor card */}
          <div className="rounded-xl bg-card p-6 ring-1 ring-foreground/10">
            <h3 className="font-heading text-base font-semibold">
              Not sure if it&apos;s the right route?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Talk to an advisor — we&apos;ll help you pick the path that fits
              your goal and budget.
            </p>
            <a
              href={siteConfig.contact.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "mt-4 w-full")}
            >
              Chat on WhatsApp
            </a>
          </div>
        </aside>
      </Container>

      {/* ─── Bottom CTA ─── */}
      <section className="border-t border-border bg-secondary/40 py-14">
        <Container className="flex flex-col items-center gap-5 text-center">
          <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            Ready to board the {course.shortName} route?
          </h2>
          <Link
            href={enrollHref}
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-11 bg-brand-red px-6 text-brand-red-foreground hover:bg-brand-red/90"
            )}
          >
            Reserve your seat
            <ArrowRight />
          </Link>
        </Container>
      </section>
    </article>
  );
}
