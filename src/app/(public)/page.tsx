import Link from "next/link";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpen,
  BrainCircuit,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  FileText,
  GraduationCap,
  Quote,
  Radio,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";

import { cn }             from "@/lib/utils";
import { courses }        from "@/lib/courses";
import { instructors }    from "@/lib/instructors";
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
import { Container }        from "@/components/public/container";
import { CourseCard }       from "@/components/public/course-card";
import { InstructorCard }   from "@/components/public/instructor-card";
import { MockTestPreview }  from "@/components/public/mock-test-preview";
import { Marquee }          from "@/components/public/marquee";

const ctaPrimary = cn(
  buttonVariants({ size: "lg" }),
  "h-11 bg-brand-red px-6 text-sm text-brand-red-foreground hover:bg-brand-red/90"
);

const fallbackAccent: Record<BrandAccent, string> = {
  blue: "bg-primary/10 text-primary",
  red:  "bg-brand-red/10 text-brand-red",
  gold: "bg-brand-gold/20 text-[oklch(0.5_0.12_72)]",
};

const featuredCourses = courses.filter((c) => c.featured);

/* ── CSCA subject tracks ── */
const tracks = [
  {
    name: "Engineering Track",
    subjects: ["Math", "Physics"],
    chinese: "STEM Chinese",
    courses: ["engineering-csca", "all-star-csca"],
    color: "text-primary bg-primary/10",
    dot: "bg-primary",
  },
  {
    name: "Medical Track",
    subjects: ["Math", "Chemistry"],
    chinese: "STEM Chinese",
    courses: ["medical-csca", "all-star-csca"],
    color: "text-brand-red bg-brand-red/10",
    dot: "bg-brand-red",
  },
  {
    name: "Business Track",
    subjects: ["Math"],
    chinese: "Humanities Chinese",
    courses: ["business-csca"],
    color: "text-[oklch(0.45_0.11_70)] bg-brand-gold/20",
    dot: "bg-brand-gold",
  },
  {
    name: "All Star Track",
    subjects: ["Math", "Physics", "Chemistry"],
    chinese: "STEM Chinese",
    courses: ["all-star-csca"],
    color: "text-primary bg-primary/10",
    dot: "bg-primary",
    popular: true,
  },
];

/* ── Exam dates ── */
const examDates = [
  { month: "January",  status: "passed" },
  { month: "March",    status: "passed" },
  { month: "May",      status: "upcoming" },
  { month: "June",     status: "next" },
  { month: "December", status: "later" },
];

/* ── AI feature list ── */
const aiFeatures = [
  { icon: FileText,    title: "CSCA-format MCQ",       desc: "48 questions per subject — exactly as in the real exam. Math, Physics, Chemistry, Professional Chinese." },
  { icon: CalendarClock, title: "Real-time timer",     desc: "Countdown clock with per-question time tracking. Finish 10 minutes early? Know exactly where you lost time." },
  { icon: BrainCircuit, title: "AI topic analysis",   desc: "After each test, AI reviews every wrong answer and groups them by topic — so you revise smarter, not harder." },
  { icon: TrendingUp,  title: "Progress tracking",    desc: "Score history across all mock tests. See your improvement curve and benchmark against your target university's cutoff." },
];

export default function HomePage() {
  return (
    <>
      {/* ═══════════════════════════════════ HERO ══════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[oklch(0.97_0.005_264)]">
        <div aria-hidden className="bg-dots pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />
        <div aria-hidden className="pointer-events-none absolute -top-32 -right-24 size-[40rem] rounded-full bg-brand-gold/8 blur-3xl" />

        <Container className="relative grid items-center gap-10 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:py-24">
          <div>
            {/* Badge */}
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-red/30 bg-brand-red/5 px-3 py-1.5 font-mono text-[11px] font-semibold tracking-[0.16em] text-brand-red uppercase">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-red opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-brand-red" />
              </span>
              Bangladesh&apos;s #1 CSCA Preparation Platform
            </span>

            <h1 className="mt-5 font-heading text-4xl leading-[1.05] font-semibold tracking-tight sm:text-5xl lg:text-[3.5rem]">
              Pass your{" "}
              <span className="relative">
                <span className="text-brand-red">CSCA</span>
                <span
                  aria-hidden
                  className="absolute -bottom-1 left-0 h-0.5 w-full bg-brand-red/30"
                />
              </span>
              .<br />
              Study in <span className="text-primary">China</span>.
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              AI mock tests, expert coaching and complete subject preparation for the{" "}
              <strong className="font-semibold text-foreground">China Scholastic Competency Assessment</strong>{" "}
              — the new mandatory exam for Bangladeshi students applying to Chinese universities.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/mock-tests" className={ctaPrimary}>
                <BrainCircuit className="size-4" />
                Try a free mock test
              </Link>
              <Link
                href="/courses"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 px-6 text-sm")}
              >
                View CSCA courses
                <ArrowRight />
              </Link>
            </div>

            {/* Trust row */}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Users className="size-4 text-primary" />
                <strong className="text-foreground">2,500+</strong> students
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="size-4 fill-brand-gold text-brand-gold" />
                <strong className="text-foreground">4.9</strong> avg. rating
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="size-4 text-emerald-500" />
                <strong className="text-foreground">95%</strong> score improvement
              </span>
            </div>
          </div>

          {/* Mock test preview */}
          <div className="relative">
            <div aria-hidden className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl bg-linear-to-br from-primary/5 to-brand-gold/5" />
            <MockTestPreview />
            <div className="mt-3 flex items-center justify-center gap-1.5 font-mono text-[11px] text-muted-foreground">
              <BrainCircuit className="size-3.5 text-brand-red" />
              Live preview of the AI Mock Test — try selecting an answer
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════ NOW BOARDING TICKER ═══════════════════════════ */}
      <section className="bg-primary py-3 text-primary-foreground">
        <Container className="flex items-center gap-5">
          <span className="hidden shrink-0 font-mono text-[11px] font-semibold tracking-[0.2em] text-brand-gold uppercase sm:inline">
            CSCA 2026 prep open for
          </span>
          <Marquee className="flex-1" />
        </Container>
      </section>

      {/* ═══════════════════════════ WHAT IS CSCA ═══════════════════════════════ */}
      <section className="border-y border-border bg-secondary/30 py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-xs font-semibold tracking-[0.2em] text-brand-red uppercase">
              New for 2026
            </p>
            <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              What is the CSCA?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              The <strong className="text-foreground">China Scholastic Competency Assessment</strong> is China&apos;s
              new mandatory standardised exam for all international undergraduate applicants.
              Starting 2026, every Bangladeshi student applying to a Chinese university must pass it.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: FileText,    label: "48 MCQ per subject", sub: "Math · Physics · Chemistry\n(80 for Professional Chinese)" },
              { icon: CalendarClock, label: "5 exam dates/year", sub: "January · March · May\nJune · December" },
              { icon: GraduationCap, label: "All top unis require it", sub: "Mandatory for CSC scholarship and 200+ Chinese universities" },
              { icon: ShieldCheck, label: "No pass/fail cutoff", sub: "Each university sets its own minimum. Top programs need 75+." },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="rounded-xl bg-card p-6 text-center ring-1 ring-foreground/10">
                <div className="mx-auto grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-4 font-heading text-base font-semibold">{label}</h3>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{sub}</p>
              </div>
            ))}
          </div>

          {/* Exam dates strip */}
          <div className="mt-10 overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
            <div className="border-b border-border px-5 py-3">
              <p className="font-mono text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                2026 CSCA Exam Calendar
              </p>
            </div>
            <div className="flex flex-wrap">
              {examDates.map((d, i) => (
                <div
                  key={d.month}
                  className={cn(
                    "flex flex-1 flex-col items-center justify-center gap-1.5 px-4 py-4 text-center",
                    i < examDates.length - 1 && "border-r border-border"
                  )}
                >
                  <span className={cn(
                    "size-2.5 rounded-full",
                    d.status === "passed"   ? "bg-muted-foreground/30"
                    : d.status === "upcoming" ? "bg-brand-gold"
                    : d.status === "next"     ? "bg-brand-red animate-pulse"
                    : "bg-secondary"
                  )} />
                  <span className="font-heading text-sm font-semibold">{d.month}</span>
                  <span className={cn(
                    "font-mono text-[9px] font-semibold tracking-wider uppercase",
                    d.status === "next" ? "text-brand-red" : "text-muted-foreground"
                  )}>
                    {d.status === "passed"   ? "Passed"
                     : d.status === "upcoming" ? "Register"
                     : d.status === "next"     ? "Register Now"
                     : "Coming"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════ CSCA TRACKS ════════════════════════════════ */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-xs font-semibold tracking-[0.2em] text-brand-red uppercase">
              Pick your track
            </p>
            <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Which subjects do you need?
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              CSCA subjects depend on the program you&apos;re applying to.
              Math is compulsory for everyone.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tracks.map((t) => (
              <Link
                key={t.name}
                href={`/courses?track=${t.courses[0]}`}
                className="group rounded-xl bg-card p-5 ring-1 ring-foreground/10 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:ring-foreground/20"
              >
                <div className="flex items-center gap-2">
                  <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide", t.color)}>
                    {t.name.split(" ")[0]}
                  </span>
                  {t.popular && (
                    <span className="rounded-full bg-brand-red/10 px-2 py-0.5 text-[10px] font-bold text-brand-red uppercase">
                      Popular
                    </span>
                  )}
                </div>
                <h3 className="mt-3 font-heading text-base font-semibold">{t.name}</h3>
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="size-3.5 text-emerald-500" />
                    Math (compulsory)
                  </div>
                  {t.subjects.filter(s => s !== "Math").map(s => (
                    <div key={s} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="size-3.5 text-emerald-500" />
                      {s}
                    </div>
                  ))}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="size-3.5 text-primary" />
                    {t.chinese}
                  </div>
                </div>
                <span className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  View courses <ChevronRight className="size-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════ AI MOCK TEST ════════════════════════════════ */}
      <section className="border-y border-border bg-primary py-16 text-primary-foreground sm:py-20">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 font-mono text-[11px] font-semibold tracking-[0.16em] text-brand-gold uppercase">
                <BrainCircuit className="size-3.5" />
                AI-powered feature
              </span>
              <h2 className="mt-5 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                The AI Mock Test that knows your weak spots
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-primary-foreground/80">
                Take a full CSCA-format mock test — 48 MCQs, real timer — then let our AI
                break down every wrong answer by topic and tell you exactly what to revise.
                No more guessing what to study next.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {aiFeatures.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                    <Icon className="size-5 text-brand-gold" />
                    <h3 className="mt-2 font-heading text-sm font-semibold">{title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-primary-foreground/70">{desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/mock-tests"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-11 bg-brand-red px-6 text-brand-red-foreground hover:bg-brand-red/90"
                  )}
                >
                  Start free mock test
                  <ArrowRight />
                </Link>
                <Link
                  href="/login"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "lg" }),
                    "h-11 px-6 text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
                  )}
                >
                  Sign in to track scores
                </Link>
              </div>
            </div>

            {/* AI result preview */}
            <div className="rounded-2xl bg-white/5 ring-1 ring-white/15 overflow-hidden">
              <div className="border-b border-white/10 px-5 py-3 flex items-center gap-2">
                <BrainCircuit className="size-4 text-brand-gold" />
                <span className="font-mono text-xs font-semibold tracking-wider uppercase text-brand-gold">
                  AI Result Review
                </span>
                <span className="ml-auto rounded-full bg-emerald-500/20 px-2.5 py-0.5 font-mono text-xs font-bold text-emerald-400">
                  Score: 71/100
                </span>
              </div>
              <div className="p-5 space-y-4">
                <p className="text-sm text-primary-foreground/80 leading-relaxed">
                  You answered <strong className="text-white">34/48</strong> correctly in 54 minutes.
                  Based on your answers, here&apos;s your topic breakdown:
                </p>

                {[
                  { topic: "Algebra",     pct: 92, correct: 11, total: 12, color: "bg-emerald-500" },
                  { topic: "Statistics",  pct: 80, correct: 8,  total: 10, color: "bg-emerald-500" },
                  { topic: "Calculus",    pct: 55, correct: 6,  total: 11, color: "bg-brand-gold" },
                  { topic: "Mechanics",   pct: 40, correct: 6,  total: 15, color: "bg-brand-red" },
                ].map((t) => (
                  <div key={t.topic}>
                    <div className="flex items-center justify-between mb-1.5 text-xs">
                      <span className="font-medium text-primary-foreground/90">{t.topic}</span>
                      <span className="text-primary-foreground/60">{t.correct}/{t.total} correct</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all", t.color)}
                        style={{ width: `${t.pct}%` }}
                      />
                    </div>
                    <div className="mt-0.5 text-right font-mono text-[10px] text-primary-foreground/50">
                      {t.pct}%
                    </div>
                  </div>
                ))}

                <div className="rounded-lg bg-brand-red/20 border border-brand-red/30 px-4 py-3">
                  <p className="text-xs font-semibold text-brand-red mb-1">⚠ Focus area: Mechanics</p>
                  <p className="text-xs text-primary-foreground/70 leading-relaxed">
                    40% score in Mechanics. Recommended: rewatch Lesson 4 &quot;Newton&apos;s Laws&quot;
                    and Lesson 6 &quot;Work &amp; Energy&quot;. Then retake Physics Mock #2.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════ FEATURED COURSES ════════════════════════════ */}
      <section id="courses" className="py-16 sm:py-20">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <p className="font-mono text-xs font-semibold tracking-[0.2em] text-brand-red uppercase">
                CSCA Courses
              </p>
              <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                Complete prep for every track
              </h2>
              <p className="mt-3 text-lg text-muted-foreground">
                Expert-led courses covering every CSCA subject — live Zoom batches
                and recorded libraries for each track.
              </p>
            </div>
            <Link
              href="/courses"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "shrink-0")}
            >
              All courses
              <ArrowRight />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredCourses.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════ HOW IT WORKS ════════════════════════════════ */}
      <section className="border-y border-border bg-secondary/40 py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-xs font-semibold tracking-[0.2em] text-brand-red uppercase">
              Your journey
            </p>
            <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              From zero to CSCA-ready in 4 steps
            </h2>
          </div>
          <div className="relative mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            <div aria-hidden className="absolute top-7 right-[12%] left-[12%] hidden border-t-2 border-dashed border-border lg:block" />
            {[
              { n: "01", icon: BookOpen,    title: "Choose your track",    desc: "Engineering, Medical, Business or All Star — pick based on the program you're applying to." },
              { n: "02", icon: Radio,       title: "Join live + recorded", desc: "Attend Zoom classes on schedule, or learn from 50+ recorded lessons at your own pace." },
              { n: "03", icon: BrainCircuit,title: "Take AI mock tests",   desc: "Practice with CSCA-format MCQs. Get topic-wise AI analysis after every test." },
              { n: "04", icon: Sparkles,    title: "Score and apply",      desc: "Hit your target score, submit your application and start your Chinese university journey." },
            ].map(({ n, icon: Icon, title, desc }) => (
              <div key={n} className="relative text-center">
                <div className="relative mx-auto grid size-14 place-items-center rounded-full border-2 border-dashed border-brand-gold/60 bg-background">
                  <div className="grid size-11 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Icon className="size-5" />
                  </div>
                </div>
                <div className="mt-3 font-mono text-xs font-bold tracking-[0.2em] text-brand-gold uppercase">Step {n}</div>
                <h3 className="mt-1.5 font-heading text-lg font-semibold">{title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════ INSTRUCTORS ════════════════════════════════ */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <p className="font-mono text-xs font-semibold tracking-[0.2em] text-brand-red uppercase">
                Expert instructors
              </p>
              <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                Taught by people who know CSCA
              </h2>
              <p className="mt-3 text-lg text-muted-foreground">
                PhD-level subject experts and certified Chinese language instructors —
                every one of them has coached Bangladeshi students through China university admissions.
              </p>
            </div>
            <Link href="/instructors" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "shrink-0")}>
              All instructors <ArrowRight />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {instructors.map((inst) => (
              <InstructorCard key={inst.slug} instructor={inst} />
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════ TESTIMONIALS + STATS ════════════════════════ */}
      <section className="border-y border-border bg-secondary/40 py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-xs font-semibold tracking-[0.2em] text-brand-red uppercase">
              Student success
            </p>
            <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              They passed. Now it&apos;s your turn.
            </h2>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.name} className="flex h-full flex-col rounded-xl bg-card p-6 ring-1 ring-foreground/10">
                <Quote className="size-6 text-brand-red/30" />
                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-dashed border-border pt-4">
                  <Avatar className="size-10">
                    <AvatarFallback className={cn("font-medium text-xs", fallbackAccent[t.accent])}>
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

          <div className="mt-12 grid grid-cols-2 gap-6 rounded-2xl bg-primary p-8 text-primary-foreground sm:p-10 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{stat.value}</div>
                <div className="mt-1 text-sm text-primary-foreground/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════ FAQ ════════════════════════════════════════ */}
      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <div className="text-center">
            <p className="font-mono text-xs font-semibold tracking-[0.2em] text-brand-red uppercase">FAQ</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">Common questions</h2>
          </div>
          <Accordion multiple={false} className="mt-10">
            {faqs.map((faq, i) => (
              <AccordionItem key={faq.question} value={String(i)}>
                <AccordionTrigger className="text-base">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground"><p>{faq.answer}</p></AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Container>
      </section>

      {/* ═══════════════════════════ BOTTOM CTA ════════════════════════════════ */}
      <section className="pb-20 sm:pb-24">
        <Container>
          <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12 sm:py-20">
            <div aria-hidden className="bg-dots pointer-events-none absolute inset-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
            <div aria-hidden className="pointer-events-none absolute -top-20 -right-20 size-72 rounded-full bg-brand-gold/10 blur-3xl" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 font-mono text-[11px] tracking-[0.2em] text-brand-gold uppercase">
                <BadgeCheck className="size-3.5" />
                CSCA 2026 — Open enrollment
              </span>
              <h2 className="mx-auto mt-5 max-w-2xl font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                Start preparing today.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/80">
                The next CSCA exam date is June 2026. Students who start now have 8 weeks
                to build their score — join 2,500+ who already have.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/mock-tests" className={cn(buttonVariants({ size: "lg" }), "h-11 bg-brand-red px-6 text-brand-red-foreground hover:bg-brand-red/90")}>
                  <BrainCircuit className="size-4" />
                  Free CSCA mock test
                </Link>
                <Link href="/enroll" className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "h-11 px-6 text-primary-foreground hover:bg-white/10 hover:text-primary-foreground")}>
                  Enroll in a course
                  <ArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
