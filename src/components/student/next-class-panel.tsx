"use client";

import * as React from "react";
import { ExternalLink, Radio, Timer } from "lucide-react";

import { getNextLiveSession } from "@/lib/courses";
import type { LiveClass } from "@/types";

interface NextClassPanelProps {
  batchName: string;
  courseName: string;
  live: LiveClass;
}

function useCountdown(target: Date | null) {
  const [diff, setDiff] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!target) return;

    function tick() {
      const ms = target!.getTime() - Date.now();
      setDiff(ms);
    }

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return diff;
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return "Starting now";
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;

  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
}

export function NextClassPanel({ batchName, courseName, live }: NextClassPanelProps) {
  const session = React.useMemo(() => getNextLiveSession(live), [live]);
  const diff    = useCountdown(session?.start ?? null);

  if (!session) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-xl bg-card px-5 py-8 text-center ring-1 ring-foreground/10">
        <Radio className="size-8 text-muted-foreground/40" />
        <p className="mt-3 text-sm font-medium">No upcoming class</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Next session will appear here when scheduled.
        </p>
      </div>
    );
  }

  const isOnAir = session.isLive || (diff !== null && diff <= 0);
  const localTime = session.start.toLocaleTimeString("en-BD", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const localDate = session.start.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

  return (
    <div className="flex h-full flex-col rounded-xl bg-card ring-1 ring-foreground/10">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border px-5 py-3">
        {isOnAir ? (
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
        ) : (
          <Radio className="size-3.5 text-muted-foreground" />
        )}
        <span className="font-mono text-[10px] font-semibold tracking-[0.14em] uppercase">
          {isOnAir ? "Live now" : "Next live class"}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-4 px-5 py-4">
        <div>
          <p className="font-heading text-base font-semibold leading-snug">{courseName}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{batchName}</p>
        </div>

        <div className="space-y-1.5">
          <p className="text-sm font-semibold">{localDate}</p>
          <p className="text-sm text-muted-foreground">{localTime}</p>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Timer className="size-3.5" />
            {live.durationMinutes} min session
          </p>
        </div>

        {/* Countdown */}
        {diff !== null && !isOnAir && (
          <div className="rounded-lg bg-secondary px-4 py-3 text-center">
            <p className="font-mono text-2xl font-bold tracking-tight text-foreground">
              {formatCountdown(diff)}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">until class starts</p>
          </div>
        )}

        {isOnAir && (
          <div className="rounded-lg bg-emerald-500/10 px-4 py-3 text-center">
            <p className="text-sm font-semibold text-emerald-600">Class is live!</p>
          </div>
        )}
      </div>

      {/* Join button */}
      {live.zoomUrl && (
        <div className="border-t border-border px-5 py-3">
          <a
            href={live.zoomUrl}
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <ExternalLink className="size-3.5" />
            {isOnAir ? "Join class now" : "Open Zoom link"}
          </a>
        </div>
      )}
    </div>
  );
}
