"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, Menu, PlaneTakeoff, User, X } from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";

const NAV_LINKS = [
  { href: "/student/dashboard", label: "My journey" },
  { href: "/mock-tests",        label: "Mock Tests" },
  { href: "/courses",           label: "All courses" },
  { href: "/student/profile",   label: "Profile" },
];

interface StudentHeaderProps {
  name: string;
}

export function StudentHeader({ name }: StudentHeaderProps) {
  const router   = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("Signed out");
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/student/dashboard"
          className="flex items-center gap-2 font-heading text-sm font-semibold"
        >
          <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <PlaneTakeoff className="size-3.5" />
          </span>
          <span className="hidden sm:block">NiHao Academy</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                pathname === l.href
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right: name + sign-out */}
        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 text-sm text-muted-foreground sm:flex">
            <User className="size-3.5" />
            {name.split(" ")[0]}
          </span>

          <button
            onClick={signOut}
            className="hidden items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-destructive md:flex"
            aria-label="Sign out"
          >
            <LogOut className="size-3.5" />
            Sign out
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-border bg-card px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === l.href
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <button
              onClick={signOut}
              className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-destructive"
            >
              <LogOut className="size-3.5" />
              Sign out
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
