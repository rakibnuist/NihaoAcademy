import Link from "next/link";
import { ArrowRight, Clock, GraduationCap } from "lucide-react";

import { cn } from "@/lib/utils";
import type { BrandAccent, Course } from "@/types";
import { courseTypeLabel, formatBdt } from "@/lib/courses";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const tile: Record<BrandAccent, string> = {
  blue: "bg-primary/10 text-primary",
  red: "bg-brand-red/10 text-brand-red",
  gold: "bg-brand-gold/20 text-[oklch(0.55_0.12_74)]",
};

const accentText: Record<BrandAccent, string> = {
  blue: "text-primary",
  red: "text-brand-red",
  gold: "text-[oklch(0.55_0.12_74)]",
};

export function CourseCard({ course }: { course: Course }) {
  const Icon = course.icon;

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group block h-full rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Card className="relative flex h-full flex-col gap-0 py-0 transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-primary/5 group-hover:ring-primary/30">
        <CardHeader className="pt-5">
          <div className="flex items-start justify-between gap-3">
            <span
              className={cn(
                "grid size-11 place-items-center rounded-xl",
                tile[course.accent]
              )}
            >
              <Icon className="size-5" />
            </span>
            {course.popular && (
              <Badge className="border-transparent bg-brand-gold/20 text-[oklch(0.5_0.12_72)]">
                Most popular
              </Badge>
            )}
          </div>
          <p
            className={cn(
              "mt-4 text-xs font-semibold tracking-wider uppercase",
              accentText[course.accent]
            )}
          >
            {courseTypeLabel[course.type]}
          </p>
          <h3 className="font-heading text-lg leading-snug font-semibold tracking-tight">
            {course.shortName}
          </h3>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col gap-4 pt-3 pb-5">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {course.summary}
          </p>
          <ul className="mt-auto space-y-2 text-sm">
            <li className="flex items-center gap-2 text-muted-foreground">
              <GraduationCap className="size-4 shrink-0 text-foreground/40" />
              {course.level}
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <Clock className="size-4 shrink-0 text-foreground/40" />
              {course.duration}
            </li>
          </ul>
        </CardContent>

        <CardFooter className="justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-semibold text-foreground">
              {formatBdt(course.priceBdt)}
            </span>
            {course.priceNote && (
              <span className="text-xs text-muted-foreground">
                {course.priceNote}
              </span>
            )}
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
            Learn more
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
