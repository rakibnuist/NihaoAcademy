import type { Metadata } from "next";
import { Radio, Video } from "lucide-react";

import { courses } from "@/lib/courses";
import { Container } from "@/components/public/container";
import { DepartureBoard } from "@/components/public/departure-board";

export const metadata: Metadata = {
  title: "Courses",
  description:
    "NiHao Academy's full departures board — CSCA admission prep, HSK, Professional Chinese and DET courses in Live and Recorded divisions.",
};

export default function CoursesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative border-b border-border bg-secondary/30">
        <div
          aria-hidden
          className="bg-dots pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
        />
        <Container className="relative py-14 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-xs font-semibold tracking-[0.2em] text-brand-red uppercase">
              All departures · NiHao Air
            </p>
            <h1 className="mx-auto mt-3 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
              Departures board
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Seven routes. Every destination from your first exam pass to a
              Chinese university offer letter. Pick your flight.
            </p>
          </div>

          {/* Division legend */}
          <div className="mx-auto mt-8 flex w-fit items-center gap-5 rounded-xl bg-card px-5 py-3 ring-1 ring-foreground/10 text-sm">
            <span className="inline-flex items-center gap-2">
              <Radio className="size-4 text-primary" />
              <span className="font-medium">Live</span>
              <span className="text-muted-foreground">— weekly Zoom sessions</span>
            </span>
            <span className="hidden h-4 w-px bg-border sm:block" />
            <span className="inline-flex items-center gap-2">
              <Video className="size-4 text-[oklch(0.45_0.11_70)]" />
              <span className="font-medium">Recorded</span>
              <span className="text-muted-foreground">— watch any time</span>
            </span>
          </div>
        </Container>
      </section>

      {/* Board */}
      <section className="py-12 sm:py-16">
        <Container>
          <DepartureBoard courses={courses} />
        </Container>
      </section>
    </>
  );
}
