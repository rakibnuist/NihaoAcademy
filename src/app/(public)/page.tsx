import Link from "next/link";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  GraduationCap,
  PlayCircle,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { courses } from "@/lib/courses";
import { faqs, stats, testimonials } from "@/lib/site";
import type { BrandAccent } from "@/types";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Container } from "@/components/public/container";
import { CourseCard } from "@/components/public/course-card";

const features = [
  {
    icon: Users,
    title: "Expert, caring instructors",
    description:
      "Learn from native and HSK-certified teachers in small live batches, with real feedback every class.",
  },
  {
    icon: Award,
    title: "Mock tests & smart feedback",
    description:
      "Weekly timed mock tests and per-topic score reports show you exactly what to revise next.",
  },
  {
    icon: PlayCircle,
    title: "Online + in-person, recorded",
    description:
      "Join live online or at our Dhaka campus — every lesson is recorded in your student library.",
  },
  {
    icon: ShieldCheck,
    title: "Full study-abroad support",
    description:
      "From scholarships to your visa checklist, we guide you all the way to your university seat.",
  },
];

const steps = [
  {
    icon: GraduationCap,
    title: "Choose your course",
    description:
      "Pick the track that fits your goal — Chinese, HSK, DET, or our Foundation study-abroad program.",
  },
  {
    icon: CheckCircle2,
    title: "Enroll & join your batch",
    description:
      "Enroll in minutes and pay securely with bKash, Nagad, or card. We add you to the right batch.",
  },
  {
    icon: Sparkles,
    title: "Learn, test & achieve",
    description:
      "Attend live classes, take mock tests, track your progress, and reach your target — step by step.",
  },
];

const fallbackAccent: Record<BrandAccent, string> = {
  blue: "bg-primary/10 text-primary",
  red: "bg-brand-red/10 text-brand-red",
  gold: "bg-brand-gold/20 text-[oklch(0.5_0.12_72)]",
};

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-b from-secondary/60 to-background">
        <div
          aria-hidden
          className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 size-[42rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
        />
        <Container className="relative py-20 text-center sm:py-28">
          <Badge
            variant="outline"
            className="h-7 gap-2 border-border bg-background/70 px-3 backdrop-blur"
          >
            <span className="size-1.5 rounded-full bg-brand-gold" />
            你好 · Now enrolling for 2026
          </Badge>

          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Your path from{" "}
            <span className="bg-linear-to-r from-primary to-[oklch(0.55_0.18_300)] bg-clip-text text-transparent">
              你好
            </span>{" "}
            to a world-class degree
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Bangladesh&apos;s dedicated academy for Chinese language, HSK &amp;
            DET preparation, and study-abroad admissions — taught by experts,
            online and in Dhaka.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/enroll"
              className={cn(buttonVariants({ size: "lg" }), "h-11 px-6 text-sm")}
            >
              Enroll now
              <ArrowRight />
            </Link>
            <Link
              href="/courses"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 px-6 text-sm"
              )}
            >
              Explore courses
            </Link>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <div className="flex -space-x-2.5">
              {testimonials.map((t) => (
                <Avatar key={t.name} className="size-9 ring-2 ring-background">
                  <AvatarFallback
                    className={cn("font-medium", fallbackAccent[t.accent])}
                  >
                    {t.initials}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1 text-foreground">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-4 fill-brand-gold text-brand-gold"
                  />
                ))}
              </span>
              <span className="ml-1">
                Loved by <span className="font-semibold text-foreground">2,400+</span>{" "}
                students
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-background">
        <Container className="grid grid-cols-2 gap-px overflow-hidden lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="px-2 py-8 text-center">
              <div className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </Container>
      </section>

      {/* Courses */}
      <section id="courses" className="py-20 sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold tracking-wider text-primary uppercase">
              Our courses
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              A track for every goal
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Whether you&apos;re starting Chinese from scratch or applying to
              universities abroad, there&apos;s a clear path for you.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {courses.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
        </Container>
      </section>

      {/* Why NiHao */}
      <section className="border-y border-border bg-secondary/40 py-20 sm:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <p className="text-sm font-semibold tracking-wider text-primary uppercase">
                Why NiHao Academy
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Built to get you results, not just lessons
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Everything we do is designed around one thing: helping you reach
                your target — a passed exam, a great score, or a seat at the
                university of your dreams.
              </p>
              <Link
                href="/about"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "mt-7"
                )}
              >
                More about us
                <ArrowRight />
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card key={feature.title} className="h-full">
                    <CardContent className="flex flex-col gap-3">
                      <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="size-5" />
                      </span>
                      <h3 className="font-heading text-base font-semibold">
                        {feature.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="py-20 sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold tracking-wider text-primary uppercase">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Get started in three simple steps
            </h2>
          </div>

          <div className="relative mt-14 grid gap-8 sm:grid-cols-3">
            <div
              aria-hidden
              className="absolute top-6 right-[16%] left-[16%] hidden h-px bg-linear-to-r from-transparent via-border to-transparent sm:block"
            />
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="relative text-center">
                  <div className="mx-auto grid size-12 place-items-center rounded-2xl border border-border bg-background text-primary shadow-sm">
                    <Icon className="size-5" />
                  </div>
                  <div className="mx-auto mt-4 flex items-center justify-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground">
                      Step {i + 1}
                    </span>
                  </div>
                  <h3 className="mt-1 font-heading text-lg font-semibold">
                    {step.title}
                  </h3>
                  <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="border-t border-border bg-secondary/40 py-20 sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold tracking-wider text-primary uppercase">
              Student stories
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Real students, real results
            </h2>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name} className="h-full">
                <CardContent className="flex h-full flex-col gap-5">
                  <Quote className="size-7 text-primary/30" />
                  <p className="flex-1 text-[15px] leading-relaxed text-foreground">
                    “{t.quote}”
                  </p>
                  <div className="flex items-center gap-3 border-t border-border pt-4">
                    <Avatar className="size-10">
                      <AvatarFallback
                        className={cn("font-medium", fallbackAccent[t.accent])}
                      >
                        {t.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">
                        {t.name}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        {t.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-24">
        <Container className="max-w-3xl">
          <div className="text-center">
            <p className="text-sm font-semibold tracking-wider text-primary uppercase">
              FAQ
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
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

      {/* CTA */}
      <section className="pb-20 sm:pb-24">
        <Container>
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary to-[oklch(0.36_0.18_285)] px-6 py-14 text-center sm:px-12 sm:py-20">
            <div
              aria-hidden
              className="bg-grid pointer-events-none absolute inset-0 opacity-[0.15] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
            />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                Ready to start your journey?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/80">
                Join thousands of students learning Chinese and studying abroad
                with NiHao Academy.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/enroll"
                  className={cn(
                    buttonVariants({ variant: "secondary", size: "lg" }),
                    "h-11 bg-background px-6 text-foreground hover:bg-background/90"
                  )}
                >
                  Enroll now
                  <ArrowRight />
                </Link>
                <Link
                  href="/contact"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "lg" }),
                    "h-11 px-6 text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
                  )}
                >
                  Talk to us
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
