import Link from "next/link";

import { cn } from "@/lib/utils";

export function Logo({
  className,
  showText = true,
  href = "/",
}: {
  className?: string;
  showText?: boolean;
  href?: string;
}) {
  return (
    <Link
      href={href}
      aria-label="NiHao Academy — home"
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
    >
      <span className="relative grid size-9 shrink-0 place-items-center rounded-xl bg-linear-to-br from-primary to-[oklch(0.42_0.2_286)] text-lg leading-none font-semibold text-primary-foreground shadow-sm transition-transform duration-200 group-hover:-translate-y-0.5">
        你
        <span className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full bg-brand-gold ring-2 ring-background" />
      </span>
      {showText && (
        <span className="flex flex-col leading-none">
          <span className="font-heading text-[15px] font-semibold tracking-tight text-foreground">
            NiHao Academy
          </span>
          <span className="mt-0.5 text-[11px] font-medium text-muted-foreground">
            你好学院
          </span>
        </span>
      )}
    </Link>
  );
}
