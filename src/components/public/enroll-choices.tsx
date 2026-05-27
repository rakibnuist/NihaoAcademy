"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { requestPaidEnrollment, startFreeTrial } from "@/app/actions/student-enrollment";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface EnrollChoicesProps {
  courseSlug: string;
  divisions: ("live" | "recorded")[];
  priceLabel: string;
  /** When true this is a trial → paid upgrade (hide the free-trial button). */
  upgradeOnly?: boolean;
  ctaClass?: string;
}

export function EnrollChoices({
  courseSlug,
  divisions,
  priceLabel,
  upgradeOnly = false,
  ctaClass = "bg-brand-red text-brand-red-foreground hover:bg-brand-red/90",
}: EnrollChoicesProps) {
  const router = useRouter();
  const both = divisions.includes("live") && divisions.includes("recorded");
  const defaultDivision = divisions.includes("live") ? "live" : "recorded";
  const [division, setDivision] = React.useState<"live" | "recorded">(defaultDivision);
  const [pending, setPending] = React.useState<null | "paid" | "trial">(null);
  const [done, setDone] = React.useState<null | string>(null);

  async function run(kind: "paid" | "trial") {
    setPending(kind);
    try {
      const result =
        kind === "trial"
          ? await startFreeTrial(courseSlug, division)
          : await requestPaidEnrollment(courseSlug, division);

      if (result.success) {
        if (result.redirectUrl) {
          window.location.href = result.redirectUrl; // real checkout (future)
          return;
        }
        setDone(result.message);
        toast.success(kind === "trial" ? "Free trial started!" : "Enrollment requested!", {
          description: result.message,
        });
        router.refresh();
      } else {
        toast.error("Could not continue", { description: result.message });
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setPending(null);
    }
  }

  if (done) {
    return (
      <div className="rounded-lg bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-700 ring-1 ring-emerald-400/30">
        ✓ {done}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Division picker — only when the course offers both */}
      {both && (
        <div className="grid grid-cols-2 gap-2">
          {(["live", "recorded"] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDivision(d)}
              className={cn(
                "rounded-lg border px-4 py-2.5 text-sm font-semibold capitalize transition-colors",
                division === d
                  ? "border-brand-red bg-brand-red/10 text-brand-red"
                  : "border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground"
              )}
            >
              {d === "live" ? "🔴 Live classes" : "🎬 Recorded"}
            </button>
          ))}
        </div>
      )}

      {/* Primary: pay / enroll */}
      <Button
        onClick={() => run("paid")}
        disabled={pending !== null}
        className={cn("h-11 w-full", ctaClass)}
        size="lg"
      >
        {pending === "paid" ? (
          <><Loader2 className="animate-spin" /> Processing…</>
        ) : (
          <>{upgradeOnly ? `Unlock full course · ${priceLabel}` : `Enroll now · ${priceLabel}`}<ArrowRight /></>
        )}
      </Button>

      {/* Secondary: free trial */}
      {!upgradeOnly && (
        <Button
          onClick={() => run("trial")}
          disabled={pending !== null}
          variant="outline"
          className="h-11 w-full"
          size="lg"
        >
          {pending === "trial" ? (
            <><Loader2 className="animate-spin" /> Starting…</>
          ) : (
            <><Sparkles className="size-4" /> Try 2 classes free</>
          )}
        </Button>
      )}

      <p className="text-center text-xs text-muted-foreground">
        {upgradeOnly
          ? "Our team confirms your payment within 24 h."
          : "No payment for the free trial · Cancel anytime"}
      </p>
    </div>
  );
}
