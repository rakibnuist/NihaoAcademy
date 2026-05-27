import Link from "next/link";
import { Star, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InstructorProfile, BrandAccent } from "@/types";
import { courses } from "@/lib/courses";

const accentBg: Record<BrandAccent, string> = {
  blue: "bg-primary/10 text-primary",
  red:  "bg-brand-red/10 text-brand-red",
  gold: "bg-brand-gold/20 text-[oklch(0.50_0.12_72)]",
};

interface InstructorCardProps {
  instructor: InstructorProfile;
}

export function InstructorCard({ instructor: inst }: InstructorCardProps) {
  const courseNames = inst.courseSlugs
    .map((s) => courses.find((c) => c.slug === s)?.shortName)
    .filter(Boolean)
    .slice(0, 2);

  return (
    <Link
      href={`/instructors/${inst.slug}`}
      className="group flex flex-col rounded-2xl bg-card ring-1 ring-foreground/10 transition-shadow hover:shadow-md hover:ring-foreground/20"
    >
      {/* Avatar */}
      <div className="flex items-start gap-4 p-6">
        <div
          className={cn(
            "flex size-14 shrink-0 items-center justify-center rounded-xl font-heading text-xl font-bold transition-transform group-hover:-translate-y-0.5",
            accentBg[inst.accent]
          )}
        >
          {inst.initials}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-heading text-base font-semibold leading-snug">{inst.name}</h3>
            {inst.nameZh && (
              <span className="font-mono text-xs text-muted-foreground">({inst.nameZh})</span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">{inst.title}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 border-t border-border px-6 py-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Users className="size-3.5" />
          {inst.studentCount.toLocaleString()} students
        </span>
        <span className="flex items-center gap-1">
          <Star className="size-3.5 fill-brand-gold text-brand-gold" />
          {inst.rating.toFixed(1)}
        </span>
      </div>

      {/* Course tags */}
      {courseNames.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-6 pb-5">
          {courseNames.map((name) => (
            <span
              key={name}
              className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-foreground/70"
            >
              {name}
            </span>
          ))}
          {inst.courseSlugs.length > 2 && (
            <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-foreground/70">
              +{inst.courseSlugs.length - 2} more
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
