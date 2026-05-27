import { destinations } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Marquee({
  className,
  reverse = false,
}: {
  className?: string;
  reverse?: boolean;
}) {
  const items = [...destinations, ...destinations];

  return (
    <div
      aria-hidden
      className={cn(
        "group relative flex overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        className
      )}
    >
      <div
        className={cn(
          "flex w-max items-center group-hover:[animation-play-state:paused]",
          reverse ? "animate-marquee-rev" : "animate-marquee"
        )}
      >
        {items.map((dest, i) => (
          <div key={i} className="flex items-center">
            <span className="font-mono text-xs font-medium tracking-[0.2em] text-primary-foreground/80 uppercase">
              {dest}
            </span>
            <span className="mx-6 size-1.5 rounded-full bg-brand-gold" />
          </div>
        ))}
      </div>
    </div>
  );
}
