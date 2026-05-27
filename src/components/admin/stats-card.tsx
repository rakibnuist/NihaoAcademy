import { cn } from "@/lib/utils";

export function StatsCard({
  label,
  value,
  sub,
  icon: Icon,
  accent = "blue",
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  accent?: "blue" | "red" | "gold" | "green";
}) {
  const tileClass = {
    blue:  "bg-primary/10 text-primary",
    red:   "bg-brand-red/10 text-brand-red",
    gold:  "bg-brand-gold/20 text-[oklch(0.45_0.11_70)]",
    green: "bg-emerald-500/10 text-emerald-600",
  }[accent];

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-card p-5 ring-1 ring-foreground/10">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span className={cn("grid size-9 place-items-center rounded-md", tileClass)}>
          <Icon className="size-4" />
        </span>
      </div>
      <div>
        <div className="font-heading text-3xl font-bold tracking-tight">{value}</div>
        {sub && <div className="mt-0.5 text-xs text-muted-foreground">{sub}</div>}
      </div>
    </div>
  );
}
