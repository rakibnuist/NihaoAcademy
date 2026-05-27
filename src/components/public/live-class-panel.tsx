"use client";

import * as React from "react";
import { Radio, Video } from "lucide-react";

import type { LiveClass } from "@/types";
import { getNextLiveSession } from "@/lib/courses";
import { cn } from "@/lib/utils";

function pad(n: number) {
  return String(Math.max(0, Math.floor(n))).padStart(2, "0");
}

function TimeBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="grid min-w-12 place-items-center rounded-md bg-white/10 px-2 py-2 font-mono text-2xl font-semibold tabular-nums">
        {value}
      </div>
      <span className="mt-1.5 font-mono text-[10px] tracking-[0.15em] text-primary-foreground/60 uppercase">
        {label}
      </span>
    </div>
  );
}

export function LiveClassPanel({
  live,
  code,
}: {
  live: LiveClass;
  code: string;
}) {
  const [now, setNow] = React.useState<Date | null>(null);

  React.useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const session = now ? getNextLiveSession(live, now) : null;
  const isLive = session?.isLive ?? false;

  let remain = { d: 0, h: 0, m: 0, s: 0 };
  if (now && session && !isLive) {
    let diff = Math.max(0, session.start.getTime() - now.getTime());
    const d = Math.floor(diff / 86_400_000);
    diff -= d * 86_400_000;
    const h = Math.floor(diff / 3_600_000);
    diff -= h * 3_600_000;
    const m = Math.floor(diff / 60_000);
    diff -= m * 60_000;
    const s = Math.floor(diff / 1000);
    remain = { d, h, m, s };
  }

  const dateFmt =
    session &&
    new Intl.DateTimeFormat("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    }).format(session.start);

  return (
    <div className="overflow-hidden rounded-xl bg-primary text-primary-foreground shadow-xl shadow-primary/20 ring-1 ring-foreground/10">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <span className="inline-flex items-center gap-2 font-mono text-xs font-medium tracking-[0.2em] uppercase">
          <span className="relative flex size-2">
            <span
              className={cn(
                "absolute inline-flex size-full rounded-full opacity-75",
                isLive ? "animate-ping bg-brand-red" : "bg-brand-gold"
              )}
            />
            <span
              className={cn(
                "relative inline-flex size-2 rounded-full",
                isLive ? "bg-brand-red" : "bg-brand-gold"
              )}
            />
          </span>
          Live Class
        </span>
        <span className="font-mono text-xs text-primary-foreground/50">
          {code}
        </span>
      </div>

      <div className="p-5">
        {isLive ? (
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-red px-3 py-1 text-xs font-bold tracking-wider text-brand-red-foreground uppercase">
              <Radio className="size-3.5" />
              Live now
            </span>
            <p className="mt-3 text-sm text-primary-foreground/80">
              Class is in session — hop in and join your batch.
            </p>
          </div>
        ) : now && session ? (
          <div>
            <div className="font-mono text-[11px] tracking-[0.2em] text-primary-foreground/60 uppercase">
              Next live class
            </div>
            <div className="mt-1 font-heading text-lg font-semibold">
              {dateFmt}
            </div>
            <div className="mt-4 flex items-start gap-1.5">
              <TimeBox value={pad(remain.d)} label="Days" />
              <span className="pt-2 font-mono text-2xl text-primary-foreground/40">
                :
              </span>
              <TimeBox value={pad(remain.h)} label="Hrs" />
              <span className="pt-2 font-mono text-2xl text-primary-foreground/40">
                :
              </span>
              <TimeBox value={pad(remain.m)} label="Min" />
              <span className="pt-2 font-mono text-2xl text-primary-foreground/40">
                :
              </span>
              <TimeBox value={pad(remain.s)} label="Sec" />
            </div>
          </div>
        ) : (
          <div className="text-sm text-primary-foreground/60">
            Loading schedule…
          </div>
        )}

        <a
          href={live.zoomUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold transition-colors outline-none focus-visible:ring-3 focus-visible:ring-white/40",
            isLive
              ? "bg-brand-red text-brand-red-foreground hover:bg-brand-red/90"
              : "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          )}
        >
          <Video className="size-4" />
          {isLive ? "Join the live class now" : "Join on Zoom"}
        </a>

        <p className="mt-3 font-mono text-[11px] leading-relaxed tracking-wide text-primary-foreground/50">
          Recurring: {live.scheduleLabel}. The Zoom room opens ~10 minutes
          before class starts.
        </p>
      </div>
    </div>
  );
}
