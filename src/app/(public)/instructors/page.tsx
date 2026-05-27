import type { Metadata } from "next";
import { Users } from "lucide-react";

import { instructors } from "@/lib/instructors";
import { Container }   from "@/components/public/container";
import { InstructorCard } from "@/components/public/instructor-card";

export const metadata: Metadata = {
  title: "Our Instructors · NiHao Academy",
  description: "Meet the expert instructors behind NiHao Academy's CSCA, HSK, and DET courses.",
};

export default function InstructorsPage() {
  const totalStudents = instructors.reduce((sum, i) => sum + i.studentCount, 0);

  return (
    <div>
      {/* Header */}
      <section className="relative border-b border-border bg-secondary/30">
        <div
          aria-hidden
          className="bg-dots pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
        />
        <Container className="relative py-14 text-center lg:py-20">
          <p className="font-mono text-xs font-semibold tracking-[0.2em] text-brand-red uppercase">
            Crew manifest
          </p>
          <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
            Your instructors
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Every instructor at NiHao Academy has lived what they teach —
            native speakers, PhD-level subject experts and certified exam trainers
            who have collectively guided{" "}
            <strong className="text-foreground">{totalStudents.toLocaleString()}+</strong>{" "}
            Bangladeshi students.
          </p>

          {/* Aggregate stats */}
          <div className="mx-auto mt-10 grid max-w-lg grid-cols-3 gap-6 rounded-2xl bg-card p-6 ring-1 ring-foreground/10">
            <div>
              <div className="font-heading text-2xl font-bold">{instructors.length}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">Expert instructors</div>
            </div>
            <div>
              <div className="font-heading text-2xl font-bold">{totalStudents.toLocaleString()}+</div>
              <div className="mt-0.5 text-xs text-muted-foreground">Students taught</div>
            </div>
            <div>
              <div className="font-heading text-2xl font-bold">4.8</div>
              <div className="mt-0.5 text-xs text-muted-foreground">Avg. rating</div>
            </div>
          </div>
        </Container>
      </section>

      {/* Grid */}
      <Container className="py-14 lg:py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {instructors.map((inst) => (
            <InstructorCard key={inst.slug} instructor={inst} />
          ))}
        </div>
      </Container>
    </div>
  );
}
