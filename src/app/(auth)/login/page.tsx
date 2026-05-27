import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { Plane } from "lucide-react";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your NiHao Academy student account.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  return (
    <div className="w-full max-w-sm">
      {/* Boarding-pass top accent */}
      <div className="mb-8 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 font-mono text-[11px] font-medium tracking-[0.18em] text-foreground/60 uppercase shadow-sm">
          <Plane className="size-3.5 text-brand-red" />
          Passenger login
        </span>
        <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in with your phone or email.
        </p>
      </div>

      {error === "auth_callback_failed" && (
        <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          The login link expired or was already used. Please request a new one.
        </div>
      )}

      <div className="overflow-hidden rounded-2xl bg-card shadow-lg shadow-primary/5 ring-1 ring-foreground/10">
        {/* Accent bar */}
        <div className="h-1.5 w-full bg-brand-red" />
        <div className="p-6 sm:p-8">
          <LoginForm redirectTo={next} />
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Don&apos;t have an account?{" "}
        <a href="/enroll" className="font-semibold text-brand-red hover:underline">
          Reserve a seat
        </a>
      </p>
    </div>
  );
}
