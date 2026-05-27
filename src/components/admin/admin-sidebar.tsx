"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  PlaneTakeoff,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/public/logo";

const navItems = [
  { href: "/admin/dashboard",   label: "Dashboard",    icon: LayoutDashboard },
  { href: "/admin/students",    label: "Students",     icon: Users },
  { href: "/admin/batches",     label: "Batches",      icon: BookOpen },
  { href: "/admin/enrollments", label: "Enrollments",  icon: GraduationCap },
  { href: "/admin/mock-tests",  label: "Mock Tests",   icon: ClipboardList },
];

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
      )}
    >
      <Icon className="size-4 shrink-0" />
      {label}
    </Link>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2 border-b border-sidebar-border px-4 py-4">
        <Logo />
        <span className="rounded-sm bg-brand-red/10 px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wider text-brand-red uppercase">
          Admin
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-3">
        <div className="mb-2 px-3 font-mono text-[10px] font-semibold tracking-[0.18em] text-sidebar-foreground/40 uppercase">
          Control tower
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            {...item}
            active={pathname === item.href || pathname.startsWith(item.href + "/")}
            onClick={() => setMobileOpen(false)}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          <LogOut className="size-4 shrink-0" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 border-r border-sidebar-border bg-sidebar lg:flex lg:flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <Logo />
          <span className="rounded-sm bg-brand-red/10 px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wider text-brand-red uppercase">
            Admin
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-md p-2 text-foreground/60 hover:bg-secondary"
          aria-label="Open navigation"
        >
          <Menu className="size-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-sidebar shadow-xl lg:hidden">
            <div className="flex items-center justify-between border-b border-sidebar-border px-4 py-4">
              <div className="flex items-center gap-2">
                <PlaneTakeoff className="size-4 text-brand-red" />
                <span className="font-heading text-sm font-semibold">
                  Control Tower
                </span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-md p-1 text-foreground/60 hover:bg-secondary"
                aria-label="Close navigation"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="h-[calc(100%-57px)]">{sidebarContent}</div>
          </aside>
        </>
      )}

      {/* Spacer for mobile top bar */}
      <div className="h-14 shrink-0 lg:hidden" />
    </>
  );
}
