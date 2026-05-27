import { Clock, Download, Infinity, PlayCircle } from "lucide-react";

import type { RecordedInfo } from "@/types";
import { cn } from "@/lib/utils";

export function RecordedPanel({
  recorded,
  code,
}: {
  recorded: RecordedInfo;
  code: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-secondary/60 px-5 py-3">
        <span className="inline-flex items-center gap-2 font-mono text-xs font-medium tracking-[0.2em] uppercase text-foreground/70">
          <PlayCircle className="size-3.5 text-brand-gold" />
          Recorded Library
        </span>
        <span className="font-mono text-xs text-muted-foreground">{code}</span>
      </div>

      <div className="p-5 space-y-4">
        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3">
          <div className={cn(
            "flex flex-col items-center justify-center gap-1 rounded-lg bg-secondary/50 px-3 py-4 text-center"
          )}>
            <PlayCircle className="size-5 text-brand-gold" />
            <span className="font-heading text-2xl font-bold">{recorded.lessons}</span>
            <span className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
              Lessons
            </span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1 rounded-lg bg-secondary/50 px-3 py-4 text-center">
            {recorded.accessLabel.toLowerCase().includes("lifetime") ? (
              <Infinity className="size-5 text-primary" />
            ) : (
              <Clock className="size-5 text-primary" />
            )}
            <span className="font-heading text-sm font-bold leading-tight">
              {recorded.accessLabel}
            </span>
            <span className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
              Access
            </span>
          </div>
        </div>

        {/* Perks */}
        <ul className="space-y-2 text-sm">
          {[
            "Watch at your own pace, any time",
            "Re-watch every lesson as often as you need",
            "Works on mobile, tablet and desktop",
            "HD video with closed captions",
          ].map((perk) => (
            <li key={perk} className="flex items-center gap-2 text-muted-foreground">
              <span className="grid size-4 shrink-0 place-items-center rounded-full bg-brand-gold/20">
                <Download className="size-2.5 text-[oklch(0.45_0.11_70)]" />
              </span>
              {perk}
            </li>
          ))}
        </ul>

        <p className="pt-1 font-mono text-[11px] leading-relaxed tracking-wide text-muted-foreground border-t border-dashed border-border">
          Start anytime — your library is unlocked immediately after enrollment.
        </p>
      </div>
    </div>
  );
}
