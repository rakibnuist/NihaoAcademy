import { Plane } from "lucide-react";

import { cn } from "@/lib/utils";

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}

export function BoardingPass({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      {/* Approval seal stamp */}
      <div className="absolute -top-5 -right-3 z-20 grid size-22 rotate-12 place-items-center rounded-full border-[2.5px] border-brand-red/70 bg-background/40 backdrop-blur-[1px]">
        <div className="text-center leading-none text-brand-red">
          <div className="font-heading text-xl font-bold">你好</div>
          <div className="mt-1 font-mono text-[7px] tracking-[0.25em] uppercase">
            Approved
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl bg-card shadow-2xl shadow-primary/15 ring-1 ring-foreground/10">
        {/* Header */}
        <div className="flex items-center justify-between bg-primary px-5 py-3 text-primary-foreground">
          <span className="font-heading text-base font-semibold">
            NiHao Academy
          </span>
          <span className="font-mono text-[10px] tracking-[0.2em] text-primary-foreground/70 uppercase">
            Admission Pass
          </span>
        </div>

        {/* Route */}
        <div className="px-5 py-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
                From
              </div>
              <div className="font-heading text-3xl leading-none font-semibold sm:text-4xl">
                DAC
              </div>
              <div className="mt-1 text-xs text-muted-foreground">Dhaka</div>
            </div>

            <div className="flex flex-1 items-center px-2 pb-2">
              <span className="size-2 shrink-0 rounded-full bg-brand-red" />
              <span className="h-0 flex-1 border-t-2 border-dashed border-border" />
              <Plane className="size-5 shrink-0 -rotate-45 text-primary" />
              <span className="h-0 flex-1 border-t-2 border-dashed border-border" />
              <span className="size-2 shrink-0 rounded-full bg-brand-gold" />
            </div>

            <div className="text-right">
              <div className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
                To
              </div>
              <div className="font-heading text-3xl leading-none font-semibold sm:text-4xl">
                PEK
              </div>
              <div className="mt-1 text-xs text-muted-foreground">Beijing</div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 border-t border-dashed border-border pt-4">
            <Detail label="Passenger" value="Future You" />
            <Detail label="Class" value="Scholarship" />
            <Detail label="Boarding" value="2026" />
          </div>
        </div>

        {/* Perforated stub */}
        <div className="relative flex items-center justify-between border-t-2 border-dashed border-border bg-secondary/60 px-5 py-4">
          <span className="absolute top-1/2 -left-3 size-5 -translate-y-1/2 rounded-full bg-background" />
          <span className="absolute top-1/2 -right-3 size-5 -translate-y-1/2 rounded-full bg-background" />
          <div className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
            NA · 汉语 · HSK · DET
          </div>
          <div className="barcode h-7 w-24 opacity-80" />
        </div>
      </div>
    </div>
  );
}
