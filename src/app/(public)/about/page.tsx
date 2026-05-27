import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass, Heart, ShieldCheck, Target } from "lucide-react";

import { cn } from "@/lib/utils";
import { stats } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/public/container";
import { BoardingPass } from "@/components/public/boarding-pass";

export const metadata: Metadata = {
  title: "About",
  description:
    "NiHao Academy is Bangladesh's dedicated academy for Chinese language, HSK & DET preparation, and study-abroad admissions.",
};

const values = [
  {
    icon: Target,
    title: "Outcomes over hours",
    description:
      "We measure success by your results — a passed exam, a score, an admission — not just classes attended.",
  },
  {
    icon: Heart,
    title: "Small, caring batches",
    description:
      "Real attention and feedback every class. You're a student with a name and a goal, never a number.",
  },
  {
    icon: ShieldCheck,
    title: "Honest guidance",
    description:
      "Clear advice on courses, costs, scholarships and visas — even when it's not the answer you hoped for.",
  },
  {
    icon: Compass,
    title: "All the way there",
    description:
      "From your first 你好 to your departure gate, we stay with you for the whole journey abroad.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-secondary/30">
        <div
          aria-hidden
          className="bg-dots pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
        />
        <Container className="relative grid items-center gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div>
            <p className="font-mono text-xs font-semibold tracking-[0.2em] text-brand-red uppercase">
              About NiHao Academy
            </p>
            <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
              Bangladesh&apos;s bridge to a world-class education
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              We started NiHao Academy with one belief: a talented student in
              Dhaka should have the same shot at a great university abroad as
              anyone in the world. So we built the full path — CSCA admission
              prep, HSK, Professional Chinese and DET — delivered live online
              and on demand.
            </p>
          </div>
          <div className="relative">
            <BoardingPass className="mx-auto max-w-md lg:mr-0" />
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-heading text-3xl font-semibold tracking-tight">
              Our story
            </h2>
            <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
              <p>
                Every year, thousands of Bangladeshi students dream of studying
                in China and beyond — but the path is confusing, scattered
                across coaching centres, agents and paperwork. Too many give up
                not for lack of talent, but for lack of guidance.
              </p>
              <p>
                NiHao Academy brings it all together. Our CSCA tracks prepare
                students for Engineering, Medical and Business admissions at
                Chinese universities. Our HSK course builds real Mandarin from
                scratch. Professional Chinese serves traders and businesspeople.
                And our DET Crash Course unlocks English-taught programs
                worldwide.
              </p>
              <p>
                The result is a 95% HSK pass rate, dozens of scholarships
                secured, and students now studying on campuses across China.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="rounded-xl bg-card p-6 ring-1 ring-foreground/10"
                >
                  <span className="grid size-11 place-items-center rounded-md bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-4 font-heading text-base font-semibold">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="border-y border-border bg-primary py-16 text-primary-foreground">
        <Container className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-primary-foreground/70">
                {stat.label}
              </div>
            </div>
          ))}
        </Container>
      </section>

      <section className="py-20 text-center sm:py-24">
        <Container>
          <h2 className="mx-auto max-w-2xl font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Your journey can start today
          </h2>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/enroll"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 bg-brand-red px-6 text-brand-red-foreground hover:bg-brand-red/90"
              )}
            >
              Enroll now
              <ArrowRight />
            </Link>
            <Link
              href="/courses"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 px-6")}
            >
              Explore courses
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
