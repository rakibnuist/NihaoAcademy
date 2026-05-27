import Link from "next/link";
import {
  BookOpen,
  CalendarClock,
  CheckCircle2,
  Clock,
  Radio,
  Video,
  XCircle,
} from "lucide-react";

import { getCourse } from "@/lib/courses";
import type { Enrollment } from "@/types/database";

type BatchInfo = {
  id: string;
  name: string;
  course_slug: string;
  division: "live" | "recorded";
  schedule: string | null;
  start_date: string | null;
};

interface EnrolledCourseCardProps {
  enrollment: Pick<Enrollment, "id" | "status" | "fee_status" | "enrolled_at">;
  batch: BatchInfo;
}

const STATUS_ICON = {
  active:    <CheckCircle2 className="size-3.5 text-emerald-500" />,
  pending:   <Clock        className="size-3.5 text-amber-500" />,
  completed: <CheckCircle2 className="size-3.5 text-primary" />,
  cancelled: <XCircle      className="size-3.5 text-muted-foreground" />,
};

const STATUS_LABEL: Record<Enrollment["status"], string> = {
  active:    "Active",
  pending:   "Pending",
  completed: "Completed",
  cancelled: "Cancelled",
};

const FEE_STYLES: Record<Enrollment["fee_status"], string> = {
  unpaid:  "bg-brand-red/10 text-brand-red",
  partial: "bg-brand-gold/20 text-[oklch(0.45_0.11_70)]",
  paid:    "bg-emerald-500/10 text-emerald-600",
};

export function EnrolledCourseCard({ enrollment, batch }: EnrolledCourseCardProps) {
  const course = getCourse(batch.course_slug);

  const accent      = course?.accent ?? "blue";
  const courseName  = course?.name ?? batch.name;
  const isLive      = batch.division === "live";

  const accentBar: Record<string, string> = {
    blue:  "bg-blue-500",
    red:   "bg-brand-red",
    gold:  "bg-brand-gold",
    green: "bg-emerald-500",
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
      {/* Accent stripe */}
      <div className={`absolute inset-x-0 top-0 h-0.5 ${accentBar[accent] ?? accentBar.blue}`} />

      <div className="px-5 py-4">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              {course ? `${course.code} · ${course.category.toUpperCase()}` : "COURSE"}
            </p>
            <h3 className="mt-0.5 font-heading text-base font-semibold leading-snug">
              {courseName}
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">{batch.name}</p>
          </div>

          <span
            className={`mt-1 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${FEE_STYLES[enrollment.fee_status]}`}
          >
            {enrollment.fee_status}
          </span>
        </div>

        {/* Details */}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {/* Division */}
          <span className="flex items-center gap-1">
            {isLive
              ? <Radio  className="size-3.5 text-emerald-500" />
              : <Video  className="size-3.5 text-primary" />}
            {isLive ? "Live class" : "Recorded"}
          </span>

          {/* Schedule */}
          {isLive && batch.schedule && (
            <span className="flex items-center gap-1">
              <CalendarClock className="size-3.5" />
              {batch.schedule}
            </span>
          )}

          {/* Enrolled date */}
          <span className="flex items-center gap-1">
            <BookOpen className="size-3.5" />
            Enrolled{" "}
            {new Date(enrollment.enrolled_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
            })}
          </span>
        </div>

        {/* Bottom: status + link */}
        <div className="mt-4 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-medium">
            {STATUS_ICON[enrollment.status]}
            {STATUS_LABEL[enrollment.status]}
          </span>

          {course && enrollment.status !== "cancelled" && (
            <Link
              href={`/courses/${course.slug}`}
              className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-secondary/80"
            >
              View course →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
