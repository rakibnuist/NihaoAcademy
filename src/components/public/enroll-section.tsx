import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, XCircle } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { EnrollButton } from "@/components/public/enroll-button";

interface EnrollSectionProps {
  courseSlug: string;
  divisions: ("live" | "recorded")[];
  /** Tailwind class for the primary CTA background, e.g. "bg-brand-red" */
  ctaClass?: string;
}

type EnrollmentStatus = "pending" | "active" | "completed" | "cancelled";

async function getEnrollmentState(
  courseSlug: string,
  userId: string
): Promise<{ status: EnrollmentStatus; division: string | null } | null> {
  const supabase = await createClient();

  // Strategy 1: enrollment linked to a batch that belongs to this course
  const { data: batchEnrollments } = await supabase
    .from("enrollments")
    .select("status, batches!inner(course_slug, division)")
    .eq("student_id", userId)
    .in("status", ["pending", "active", "completed"])
    .limit(20);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const batchMatch = (batchEnrollments as any[])?.find(
    (row) => row.batches?.course_slug === courseSlug
  );

  if (batchMatch) {
    return {
      status: batchMatch.status as EnrollmentStatus,
      division: batchMatch.batches?.division ?? null,
    };
  }

  // Strategy 2: batch-less enrollment whose notes contain the course slug
  // (requestEnrollment writes: "Self-enrollment request · <slug> · <division>")
  const { data: noBatchEnrollments } = await supabase
    .from("enrollments")
    .select("status, notes")
    .eq("student_id", userId)
    .is("batch_id", null)
    .in("status", ["pending", "active", "completed"])
    .limit(20);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const noteMatch = (noBatchEnrollments as any[])?.find(
    (row) => typeof row.notes === "string" && row.notes.includes(courseSlug)
  );

  if (noteMatch) {
    // Parse division from the notes string
    const divisionMatch = (noteMatch.notes as string).match(/·\s+(live|recorded)$/);
    return {
      status: noteMatch.status as EnrollmentStatus,
      division: divisionMatch?.[1] ?? null,
    };
  }

  return null;
}

const statusConfig: Record<
  EnrollmentStatus,
  { label: string; icon: React.ReactNode; classes: string }
> = {
  pending: {
    label: "Enrollment pending review",
    icon: <Clock className="size-4 shrink-0" />,
    classes: "bg-amber-500/10 text-amber-700 ring-amber-400/30",
  },
  active: {
    label: "You're enrolled — access your dashboard",
    icon: <CheckCircle2 className="size-4 shrink-0" />,
    classes: "bg-emerald-500/10 text-emerald-700 ring-emerald-400/30",
  },
  completed: {
    label: "Course completed",
    icon: <CheckCircle2 className="size-4 shrink-0" />,
    classes: "bg-primary/10 text-primary ring-primary/30",
  },
  cancelled: {
    label: "Enrollment cancelled",
    icon: <XCircle className="size-4 shrink-0" />,
    classes: "bg-destructive/10 text-destructive ring-destructive/30",
  },
};

export async function EnrollSection({
  courseSlug,
  divisions,
  ctaClass = "bg-brand-red text-brand-red-foreground hover:bg-brand-red/90",
}: EnrollSectionProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ── Not logged in ──────────────────────────────────────────────────────────
  if (!user) {
    return (
      <Link
        href={`/login?next=/courses/${courseSlug}`}
        className={cn(buttonVariants({ size: "lg" }), "h-11 w-full", ctaClass)}
      >
        Log in to enroll
        <ArrowRight />
      </Link>
    );
  }

  // ── Logged in — check existing enrollment ─────────────────────────────────
  const enrollment = await getEnrollmentState(courseSlug, user.id);

  if (enrollment && enrollment.status !== "cancelled") {
    const cfg = statusConfig[enrollment.status];
    return (
      <div className="space-y-3">
        <div
          className={cn(
            "flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium ring-1",
            cfg.classes
          )}
        >
          {cfg.icon}
          {cfg.label}
        </div>
        {enrollment.status === "active" && (
          <Link
            href="/student/dashboard"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-11 w-full",
              ctaClass
            )}
          >
            Go to my dashboard
            <ArrowRight />
          </Link>
        )}
      </div>
    );
  }

  // ── Logged in, no active enrollment — show enroll button ──────────────────
  return (
    <EnrollButton
      courseSlug={courseSlug}
      divisions={divisions}
      ctaClass={ctaClass}
    />
  );
}
