import Link from "next/link";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  FileText,
  PlaneLanding,
  PlaneTakeoff,
  PlayCircle,
  Quote,
  Radio,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { courses } from "@/lib/courses";
import { faqs, stats, testimonials } from "@/lib/site";
import type { BrandAccent } from "@/types";
import { buttonVariants } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Container } from "@/components/public/container";
import { CourseCard } from "@/components/public/course-card";
import { BoardingPass } from "@/components/public/boarding-pass";
import { Marquee } from "@/components/public/marquee";

const ctaPrimary = cn(
  buttonVariants({ size: "lg" }),
  "h-11 bg-brand-red px-6 text-sm text-brand-red-foreground hover:bg-brand-red/90"
);

const fallbackAccent: Record<BrandAccent, string> = {
  blue: "bg-primary/10 text-primary",
  red: "bg-brand-red/10 text-brand-red",
  gold: "bg-brand-gold/20 text-[oklch(0.5_0.12_72)]",
};

/* 4 featured courses for the homepage spotlight */
const featuredCourses = courses.filter((c) => c.featured);

const itinerary = [
  {
    code: "01",
    icon: FileText,
    label: "Departure",
    title: "Choose your route",
    description:
      "Pick the course that matches your destination — CSCA admission, HSK, Professional Chinese or DET.",
  },
  {
    code: "02",
    icon: Radio,
    label: "In flight",
    title: "Learn & get tested",
    description:
      "Join live Zoom sessions or watch recorded lessons at your own pace — mock exams keep you on course.",
  },
  {
    code: "03",
    icon: Award,
    label: "Passing gate",
    title: "Pass your exam",
    description:
      "Hit your HSK level, CSCA score or DET target. We track your progress every step of the way.",
  },
  {
    code: "04",
    icon: PlaneLanding,
    label: "Arrival",
    title: "Land abroad",
    description:
      "University offer, CSC scholarship, visa cleared — your flight from Dhaka to campus, complete.",
  },
];

const features = [
  {
    icon: Users,
    title: "Expert, caring instructors",
    description:
      "Native and certified teachers in small live batches — real feedback every session.",
  },
  {
    icon: Award,
    title: "Mock tests & smart feedback",
    description:
      "Weekly timed mocks with per-topic score reports so you know exactly what to revise.",
  },
  {
    icon: PlayCircle,
    title: "Live and recorded, your choice",
    description:
      "Join live Zoom classes on a fixed schedule or learn from the recorded library at your own pace.",
  },
  {
    icon: ShieldCheck,
    title: "All the way to departure",
    description:
      "From your first lesson to your university offer — we don't stop until you're boarding.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="bg-dots pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />
        <div aria-hidden className="pointer-events-none absolute -top-32 -right-24 size-[40rem] rounded-full bg-brand-gold/10 blur-3xl" />
        <Container className="relative grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 font-mono text-[11px] font-medium tracking-[0.18em] text-foreground/70 uppercase shadow-sm">
              <PlaneTakeoff className="size-3.5 text-brand-red" />
              Dhaka (DAC) <span className="text-brand-gold">→</span> 中国 · Boarding now
            </span>

            <h1 className="mt-6 font-heading text-4xl leading-[1.05] font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              From <span className="text-brand-red">你好</span> to a degree{" "}
              <span className="relative whitespace-nowrap">
                abroad
                <span
                  aria-hidden
                  className="absolute -bottom-1 left-0 h-1 w-full border-b-2 border-dashed border-brand-gold"
                />
              </span>
              .
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              NiHao Academy is Bangladesh&apos;s dedicated prep academy for CSCA
              university admissions, HSK &amp; DET certification, and Professional
              Chinese — with live Zoom classes and a self-paced recorded library.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/enroll" className={ctaPrimary}>
                Reserve your seat
                <ArrowRight />
              </Link>
              <Link
                href="/courses"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 px-6 text-sm")}
              >
                View all routes
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-4 gap-y-3">
              <div className="flex -space-x-2.5">
                {testimonials.map((t) => (
                  <Avatar key={t.name} className="size-9 ring-2 ring-background">
                    <AvatarFallback className={cn("font-medium", fallbackAccent[t.accent])}>
                      {t.initials}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-0.5 align-middle">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-brand-gold text-brand-gold" />
                  ))}
                </span>{" "}
                <span className="font-semibold text-foreground">2,400+</span>{" "}
                students boarded
              </div>
            </div>
          </div>

          <div className="relative">
            <div aria-hidden className="pointer-events-none absolute -inset-x-6 -top-10 -bottom-6 -z-10">
              <svg viewBox="0 0 400 300" className="size-full" fill="none">
                <path
                  d="M20 250 Q 200 40 380 120"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="6 8"
                  className="text-brand-gold/40"
                />
              </svg>
            </div>
            <BoardingPass className="mx-auto max-w-md lg:mr-0" />
          </div>
        </Container>
      </section>

      {/* ─── Departures ticker ─── */}
      <section className="bg-primary py-3 text-primary-foreground">
        <Container className="flex items-center gap-5">
          <span className="hidden shrink-0 font-mono text-[11px] font-semibold tracking-[0.2em] text-brand-gold uppercase sm:inline">
            Now boarding for
          </span>
          <Marquee className="flex-1" />
        </Container>
      </section>

      {/* ─── Featured routes ─── */}
      <section id="courses" className="py-20 sm:py-24">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <p className="font-mono text-xs font-semibold tracking-[0.2em] text-brand-red uppercase">
                Featured departures
              </p>
              <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                Choose your route
              </h2>
              <p className="mt-3 text-lg text-muted-foreground">
                Four of our most popular routes — or view the full departures
                board for all seven.
              </p>
            </div>
            <Link
              href="/courses"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "shrink-0")}
            >
              Full departures board
              <ArrowRight />
            </Link>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredCourses.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
        </Container>
      </section>

      {/* ─── Journey itinerary ─── */}
      <section className="border-y border-border bg-secondary/40 py-20 sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-xs font-semibold tracking-[0.2em] text-brand-red uppercase">
              Your itinerary
            </p>
            <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Four stops to your destination
            </h2>
          </div>

          <div className="relative mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            <div
              aria-hidden
              className="absolute top-7 right-[12%] left-[12%] hidden border-t-2 border-dashed border-border lg:block"
            />
            {itinerary.map((stop) => {
              const Icon = stop.icon;
              return (
                <div key={stop.code} className="relative text-center">
                  <div className="relative mx-auto grid size-14 place-items-center rounded-full border-2 border-dashed border-brand-gold/60 bg-background">
                    <div className="grid size-11 place-items-center rounded-full bg-primary text-primary-foreground">
                      <Icon className="size-5" />
                    </div>
                  </div>
                  <div className="mt-4 font-mono text-[10px] font-semibold tracking-[0.2em] text-brand-gold uppercase">
                    {stop.label}
                  </div>
                  <div className="font-mono text-xs tracking-[0.12em] text-brand-red">
                    STOP {stop.code}
                  </div>
                  <h3 className="mt-1.5 font-heading text-lg font-semibold">
                    {stop.title}
                  </h3>
                  <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                    {stop.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ─── Why fly with us ─── */}
      <section className="py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="font-mono text-xs font-semibold tracking-[0.2em] text-brand-red uppercase">
              Why fly with us
            </p>
            <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Built to get you there, not just teach you
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Every detail is designed around your destination — a passed exam,
              a great score, and a seat at the university of your dreams.
            </p>
            <Link
              href="/about"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "mt-7")}
            >
              More about us
              <ArrowRight />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="rounded-xl bg-card p-6 ring-1 ring-foreground/10">
                  <span className="grid size-11 place-items-center rounded-md bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-4 font-heading text-base font-semibold">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ─── Testimonials / Arrivals ─── */}
      <section className="border-y border-border bg-secondary/40 py-20 sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-xs font-semibold tracking-[0.2em] text-brand-red uppercase">
              Arrivals · Student stories
            </p>
            <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              They landed
            </h2>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="flex h-full flex-col rounded-xl bg-card p-6 ring-1 ring-foreground/10"
              >
                <Quote className="size-7 text-brand-red/30" />
                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-foreground">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-dashed border-border pt-4">
                  <Avatar className="size-10">
                    <AvatarFallback className={cn("font-medium", fallbackAccent[t.accent])}>
                      {t.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{t.name}</div>
                    <div className="truncate text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-14 grid grid-cols-2 gap-6 rounded-2xl bg-primary p-8 text-primary-foreground sm:p-10 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-primary-foreground/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-20 sm:py-24">
        <Container className="max-w-3xl">
          <div className="text-center">
            <p className="font-mono text-xs font-semibold tracking-[0.2em] text-brand-red uppercase">
              Help desk · FAQ
            </p>
            <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Questions, answered
            </h2>
          </div>

          <Accordion multiple={false} className="mt-10">
            {faqs.map((faq, i) => (
              <AccordionItem key={faq.question} value={String(i)}>
                <AccordionTrigger className="text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <p>{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Container>
      </section>

      {/* ─── Bottom CTA ─── */}
      <section className="pb-20 sm:pb-24">
        <Container>
          <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12 sm:py-20">
            <div aria-hidden className="bg-dots pointer-events-none absolute inset-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
            <div aria-hidden className="pointer-events-none absolute -top-20 -right-20 size-72 rounded-full bg-brand-gold/10 blur-3xl" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 font-mono text-[11px] tracking-[0.2em] text-brand-gold uppercase">
                <BadgeCheck className="size-3.5" />
                Boarding now for 2026
              </span>
              <h2 className="mx-auto mt-5 max-w-2xl font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                Ready for departure?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/80">
                Reserve your seat today and start the journey from 你好 to a
                world-class education abroad.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/enroll"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-11 bg-brand-red px-6 text-brand-red-foreground hover:bg-brand-red/90"
                  )}
                >
                  Get your boarding pass
                  <ArrowRight />
                </Link>
                <Link
                  href="/contact"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "lg" }),
                    "h-11 px-6 text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
                  )}
                >
                  Talk to an advisor
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
