import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, GraduationCap, Star, Users } from "lucide-react";

import { instructors, getInstructor } from "@/lib/instructors";
import { courses }                     from "@/lib/courses";
import { Container }                   from "@/components/public/container";
import { CourseCard }                  from "@/components/public/course-card";
import { cn }                          from "@/lib/utils";
import type { BrandAccent }            from "@/types";
import { buttonVariants }              from "@/components/ui/button";

const accentBg: Record<BrandAccent, string> = {
  blue: "bg-primary/10 text-primary",
  red:  "bg-brand-red/10 text-brand-red",
  gold: "bg-brand-gold/20 text-[oklch(0.50_0.12_72)]",
};

export function generateStaticParams() {
  return instructors.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const inst = getInstructor(slug);
  if (!inst) return { title: "Instructor not found" };
  return {
    title: `${inst.name} · NiHao Academy`,
    description: inst.bio.slice(0, 160),
  };
}

export default async function InstructorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const inst = getInstructor(slug);
  if (!inst) notFound();

  const taughtCourses = courses.filter((c) => inst.courseSlugs.includes(c.slug));

  return (
    <article>
      {/* Hero */}
      <section className="relative border-b border-border bg-secondary/30">
        <div
          aria-hidden
          className="bg-dots pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
        />
        <Container className="relative py-12 lg:py-16">
          <Link
            href="/instructors"
            className="inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.12em] text-muted-foreground uppercase transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            All instructors
          </Link>

          <div className="mt-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            {/* Avatar */}
            <div
              className={cn(
                "flex size-20 shrink-0 items-center justify-center rounded-2xl font-heading text-3xl font-bold",
                accentBg[inst.accent]
              )}
            >
              {inst.initials}
            </div>

            <div>
              <p className="font-mono text-xs font-semibold tracking-[0.18em] text-brand-red uppercase">
                Instructor
              </p>
              <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                {inst.name}
                {inst.nameZh && (
                  <span className="ml-3 font-mono text-lg text-muted-foreground">
                    {inst.nameZh}
                  </span>
                )}
              </h1>
              <p className="mt-1 text-muted-foreground">{inst.title}</p>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Users className="size-4" />
                  {inst.studentCount.toLocaleString()} students
                </span>
                <span className="flex items-center gap-1.5">
                  <Star className="size-4 fill-brand-gold text-brand-gold" />
                  {inst.rating.toFixed(1)} rating
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen className="size-4" />
                  {taughtCourses.length} course{taughtCourses.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Body */}
      <Container className="grid gap-10 py-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
        <div className="space-y-10">
          {/* Bio */}
          <div>
            <h2 className="font-heading text-xl font-semibold tracking-tight">About</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">{inst.bio}</p>
          </div>

          {/* Credentials */}
          <div>
            <h2 className="font-heading text-xl font-semibold tracking-tight">
              Credentials
            </h2>
            <ul className="mt-4 space-y-3">
              {inst.credentials.map((c) => (
                <li key={c} className="flex items-start gap-3">
                  <GraduationCap className="mt-0.5 size-4 shrink-0 text-brand-red" />
                  <span className="text-sm leading-relaxed">{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Subjects */}
          <div>
            <h2 className="font-heading text-xl font-semibold tracking-tight">
              Subjects
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {inst.subjects.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-secondary px-3 py-1.5 text-sm font-medium"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: courses */}
        <aside>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Courses by {inst.name.split(" ")[0]}
          </h2>
          <div className="mt-5 space-y-4">
            {taughtCourses.map((course) => (
              <CourseCard key={course.slug} course={course} compact />
            ))}
          </div>
        </aside>
      </Container>
    </article>
  );
}
