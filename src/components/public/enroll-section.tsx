import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, Sparkles, XCircle } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { EnrollChoices } from "@/components/public/enroll-choices";
import { TRIAL_NOTE_TAG } from "@/lib/enrollment";

interface EnrollSectionProps {
  courseSlug: string;
  divisions: ("live" | "recorded")[];
  /** Formatted price, e.g. "BDT 18,000" — shown on the enroll button. */
  priceLabel: string;
  /** Tailwind class for the primary CTA background, e.g. "bg-brand-red" */
  ctaClass?: string;
}

type EnrollmentStatus = "pending" | "active" | "completed" | "cancelled";

interface EnrollmentState {
  status: EnrollmentStatus;
  feeStatus: string | null;
  isTrial: boolean;
}

async function getEnrollmentState(
  courseSlug: string,
  userId: string
): Promise<EnrollmentState | null> {
  const supabase = await createClient();

  // Pull all live/finished enrollments, then match by batch course or notes slug.
  const { data: rows } = await supabase
    .from("enrollments")
    .select("status, fee_status, notes, batches(course_slug)")
    .eq("student_id", userId)
    .in("status", ["pending", "active", "completed"])
    .limit(30);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const match = (rows as any[])?.find(
    (r) =>
      r.batches?.course_slug === courseSlug ||
      (typeof r.notes === "string" && r.notes.includes(courseSlug))
  );

  if (!match) return null;

  return {
    status: match.status as EnrollmentStatus,
    feeStatus: match.fee_status ?? null,
    isTrial:
      match.status === "active" &&
      match.fee_status !== "paid" &&
      typeof match.notes === "string" &&
      match.notes.includes(TRIAL_NOTE_TAG),
  };
}

export async function EnrollSection({
  courseSlug,
  divisions,
  priceLabel,
  ctaClass = "bg-brand-red text-brand-red-foreground hover:bg-brand-red/90",
}: EnrollSectionProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ── Not logged in → gate behind login ──────────────────────────────────────
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

  const enrollment = await getEnrollmentState(courseSlug, user.id);

  // ── Free trial active → show upgrade path ──────────────────────────────────
  if (enrollment?.isTrial) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 rounded-lg bg-violet-500/10 px-4 py-3 text-sm font-medium text-violet-700 ring-1 ring-violet-400/30">
          <Sparkles className="size-4 shrink-0" />
          Free trial active — 2 classes unlocked
        </div>
        <Link
          href="/student/dashboard"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 w-full")}
        >
          Continue your free classes
          <ArrowRight />
        </Link>
        <EnrollChoices
          courseSlug={courseSlug}
          divisions={divisions}
          priceLabel={priceLabel}
          upgradeOnly
          ctaClass={ctaClass}
        />
      </div>
    );
  }

  // ── Paid + active → full access ────────────────────────────────────────────
  if (enrollment && enrollment.status === "active") {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-700 ring-1 ring-emerald-400/30">
          <CheckCircle2 className="size-4 shrink-0" />
          You&apos;re enrolled — full access
        </div>
        <Link
          href="/student/dashboard"
          className={cn(buttonVariants({ size: "lg" }), "h-11 w-full", ctaClass)}
        >
          Go to my dashboard
          <ArrowRight />
        </Link>
      </div>
    );
  }

  // ── Pending review ─────────────────────────────────────────────────────────
  if (enrollment && enrollment.status === "pending") {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 px-4 py-3 text-sm font-medium text-amber-700 ring-1 ring-amber-400/30">
        <Clock className="size-4 shrink-0" />
        Enrollment pending review
      </div>
    );
  }

  // ── Completed ──────────────────────────────────────────────────────────────
  if (enrollment && enrollment.status === "completed") {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-3 text-sm font-medium text-primary ring-1 ring-primary/30">
        <CheckCircle2 className="size-4 shrink-0" />
        Course completed
      </div>
    );
  }

  // ── No live enrollment → offer both paths ──────────────────────────────────
  return (
    <EnrollChoices
      courseSlug={courseSlug}
      divisions={divisions}
      priceLabel={priceLabel}
      ctaClass={ctaClass}
    />
  );
}
