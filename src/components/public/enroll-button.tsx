"use client";

import * as React from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { requestEnrollment } from "@/app/actions/student-enrollment";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface EnrollButtonProps {
  courseSlug: string;
  divisions: ("live" | "recorded")[];
  ctaClass?: string;
}

export function EnrollButton({
  courseSlug,
  divisions,
  ctaClass = "bg-brand-red text-brand-red-foreground hover:bg-brand-red/90",
}: EnrollButtonProps) {
  const both = divisions.includes("live") && divisions.includes("recorded");
  const defaultDivision = divisions.includes("live") ? "live" : "recorded";
  const [division, setDivision] = React.useState<"live" | "recorded">(defaultDivision);
  const [loading, setLoading] = React.useState(false);
  const [done, setDone] = React.useState(false);

  async function handleEnroll() {
    setLoading(true);
    try {
      const result = await requestEnrollment(courseSlug, division);
      if (result.success) {
        setDone(true);
        toast.success("Enrollment requested!", {
          description: result.message,
        });
      } else {
        toast.error("Could not enroll", { description: result.message });
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-lg bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-700 ring-1 ring-emerald-400/30">
        ✓ Enrollment request received! Our team will confirm within 24 hours.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Division picker — only shown when course has both */}
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

      <Button
        onClick={handleEnroll}
        disabled={loading}
        className={cn("h-11 w-full", ctaClass)}
        size="lg"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" />
            Requesting…
          </>
        ) : (
          <>
            Enroll now
            <ArrowRight />
          </>
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Free to request · Admin confirms within 24 h
      </p>
    </div>
  );
}
