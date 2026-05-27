"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Menu } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { mainNav } from "@/lib/site";
import { createClient } from "@/lib/supabase/client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Container } from "@/components/public/container";
import { Logo } from "@/components/public/logo";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

interface SiteHeaderProps {
  /** Whether a user session exists (resolved server-side in the layout). */
  signedIn?: boolean;
  /** Where the "Dashboard" button points (admin vs student). */
  dashboardHref?: string;
}

export function SiteHeader({
  signedIn = false,
  dashboardHref = "/student/dashboard",
}: SiteHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("Signed out");
    router.push("/");
    router.refresh();
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        scrolled
          ? "border-b border-border bg-background/80 backdrop-blur-md"
          : "border-b border-transparent bg-background/0"
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive(pathname, item.href)
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {signedIn ? (
            <>
              <Link
                href={dashboardHref}
                className={cn(buttonVariants({ size: "lg" }))}
              >
                <LayoutDashboard className="size-4" />
                Dashboard
              </Link>
              <button
                onClick={signOut}
                className={cn(buttonVariants({ variant: "ghost", size: "lg" }))}
              >
                <LogOut className="size-4" />
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(buttonVariants({ variant: "ghost", size: "lg" }))}
              >
                Log in
              </Link>
              <Link
                href="/enroll"
                className={cn(buttonVariants({ size: "lg" }))}
              >
                Enroll now
              </Link>
            </>
          )}
        </div>

        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon-lg" aria-label="Open menu" />
              }
            >
              <Menu />
            </SheetTrigger>
            <SheetContent side="right" className="w-[88vw] max-w-sm gap-0">
              <SheetHeader className="border-b border-border">
                <SheetTitle className="text-left">
                  <Logo />
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col gap-1 p-4">
                {mainNav.map((item) => (
                  <SheetClose
                    key={item.href}
                    nativeButton={false}
                    render={
                      <Link
                        href={item.href}
                        className={cn(
                          "rounded-lg px-3 py-2.5 text-base font-medium transition-colors",
                          isActive(pathname, item.href)
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      />
                    }
                  >
                    {item.label}
                  </SheetClose>
                ))}
              </nav>

              <div className="mt-auto flex flex-col gap-2 border-t border-border p-4">
                {signedIn ? (
                  <>
                    <SheetClose
                      nativeButton={false}
                      render={
                        <Link
                          href={dashboardHref}
                          className={cn(buttonVariants({ size: "lg" }))}
                        />
                      }
                    >
                      <LayoutDashboard className="size-4" />
                      Dashboard
                    </SheetClose>
                    <SheetClose
                      nativeButton={false}
                      render={
                        <button
                          onClick={signOut}
                          className={cn(
                            buttonVariants({ variant: "outline", size: "lg" })
                          )}
                        />
                      }
                    >
                      <LogOut className="size-4" />
                      Sign out
                    </SheetClose>
                  </>
                ) : (
                  <>
                    <SheetClose
                      nativeButton={false}
                      render={
                        <Link
                          href="/login"
                          className={cn(
                            buttonVariants({ variant: "outline", size: "lg" })
                          )}
                        />
                      }
                    >
                      Log in
                    </SheetClose>
                    <SheetClose
                      nativeButton={false}
                      render={
                        <Link
                          href="/enroll"
                          className={cn(buttonVariants({ size: "lg" }))}
                        />
                      }
                    >
                      Enroll now
                    </SheetClose>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}
