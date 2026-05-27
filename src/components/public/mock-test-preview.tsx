"use client";

import * as React from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, Flag, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_QUESTION = {
  number: 12,
  total: 48,
  topic: "Calculus · Integration",
  text: "Evaluate the definite integral ∫₀² (3x² − 2x + 1) dx",
  options: [
    { label: "A", text: "6" },
    { label: "B", text: "8" },
    { label: "C", text: "10" },
    { label: "D", text: "12" },
  ],
  selected: "B",
};

const GRID = Array.from({ length: 48 }, (_, i) => ({
  n: i + 1,
  state:
    i < 11 ? "done"
    : i === 11 ? "active"
    : i === 15 || i === 22 ? "flagged"
    : "empty",
}));

export function MockTestPreview() {
  const [selected, setSelected] = React.useState<string>("B");
  const [seconds, setSeconds] = React.useState(2783); // 46:23

  React.useEffect(() => {
    const id = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const isLow = seconds < 300;

  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-2xl shadow-primary/10 ring-1 ring-foreground/10 lg:mr-0">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 border-b border-border bg-primary px-4 py-3 text-primary-foreground">
        <div className="flex items-center gap-2">
          <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-[11px] font-semibold tracking-wider uppercase">
            Math
          </span>
          <span className="font-mono text-xs text-primary-foreground/70">
            Q {DEMO_QUESTION.number}/{DEMO_QUESTION.total}
          </span>
        </div>

        {/* Timer */}
        <div className={cn(
          "flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-sm font-bold",
          isLow ? "bg-brand-red/20 text-brand-red" : "bg-white/10"
        )}>
          <Timer className="size-3.5" />
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_auto]">
        {/* Question area */}
        <div className="p-5">
          <p className="font-mono text-[10px] font-semibold tracking-[0.16em] text-brand-red uppercase">
            {DEMO_QUESTION.topic}
          </p>
          <p className="mt-2 text-sm font-medium leading-relaxed text-foreground">
            {DEMO_QUESTION.text}
          </p>

          <ul className="mt-4 space-y-2">
            {DEMO_QUESTION.options.map((opt) => (
              <li key={opt.label}>
                <button
                  onClick={() => setSelected(opt.label)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border px-4 py-2.5 text-sm transition-all",
                    selected === opt.label
                      ? "border-primary bg-primary/10 font-semibold text-primary"
                      : "border-border bg-secondary/30 text-foreground hover:border-primary/40"
                  )}
                >
                  <span className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
                    selected === opt.label
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border"
                  )}>
                    {opt.label}
                  </span>
                  {opt.text}
                  {selected === opt.label && (
                    <CheckCircle2 className="ml-auto size-4 text-primary" />
                  )}
                </button>
              </li>
            ))}
          </ul>

          {/* Nav row */}
          <div className="mt-4 flex items-center justify-between">
            <button className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary">
              <ChevronLeft className="size-3.5" />
              Prev
            </button>
            <button className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary">
              <Flag className="size-3.5" />
              Flag
            </button>
            <button className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90">
              Next
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Question grid sidebar */}
        <div className="hidden border-l border-border bg-secondary/20 px-4 py-5 lg:block">
          <p className="mb-3 font-mono text-[9px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
            Questions
          </p>
          <div className="grid grid-cols-6 gap-1">
            {GRID.map((q) => (
              <div
                key={q.n}
                className={cn(
                  "flex size-7 items-center justify-center rounded text-[10px] font-bold transition-colors",
                  q.state === "active"  ? "bg-primary text-primary-foreground ring-2 ring-primary/40"
                  : q.state === "done"    ? "bg-emerald-500/20 text-emerald-700"
                  : q.state === "flagged" ? "bg-brand-gold/30 text-[oklch(0.45_0.11_70)]"
                  : "bg-secondary text-muted-foreground"
                )}
              >
                {q.n}
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-1.5">
            {[
              { color: "bg-emerald-500/20", label: "Answered (11)" },
              { color: "bg-primary",        label: "Current" },
              { color: "bg-brand-gold/30",  label: "Flagged (2)" },
              { color: "bg-secondary",      label: "Unanswered" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <span className={cn("size-3 rounded", l.color)} />
                {l.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
