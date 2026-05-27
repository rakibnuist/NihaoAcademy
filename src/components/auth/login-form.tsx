"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, KeyRound, Loader2, Mail, Phone } from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Tab = "phone" | "email" | "password";

function normalisePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("01") && digits.length === 11) return `+880${digits.slice(1)}`;
  if (digits.startsWith("880") && digits.length === 13) return `+${digits}`;
  return raw.startsWith("+") ? raw : `+${digits}`;
}

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const [tab, setTab] = React.useState<Tab>("phone");
  const [value, setValue] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [magicSent, setMagicSent] = React.useState(false);

  function handleTabChange(t: Tab) {
    setTab(t);
    setValue("");
    setPassword("");
    setError("");
    setMagicSent(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!value.trim()) {
      setError(tab === "phone" ? "Enter your phone number" : "Enter your email address");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    try {
      if (tab === "phone") {
        const phone = normalisePhone(value.trim());
        const { error: err } = await supabase.auth.signInWithOtp({
          phone,
          options: { shouldCreateUser: true },
        });
        if (err) throw err;
        toast.success("Code sent!", { description: `OTP sent to ${phone}` });
        const next = redirectTo ? `&next=${encodeURIComponent(redirectTo)}` : "";
        router.push(`/verify?phone=${encodeURIComponent(phone)}${next}`);

      } else if (tab === "email") {
        const email = value.trim().toLowerCase();
        const destination = redirectTo ?? "/student/dashboard";
        const { error: err } = await supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: true,
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin}/auth/callback?next=${encodeURIComponent(destination)}`,
          },
        });
        if (err) throw err;
        setMagicSent(true);
        toast.success("Magic link sent!", {
          description: `Check ${email} for your login link.`,
        });

      } else {
        // Password sign-in
        if (!password.trim()) {
          setError("Enter your password");
          setLoading(false);
          return;
        }
        const email = value.trim().toLowerCase();
        const { data, error: err } = await supabase.auth.signInWithPassword({
          email,
          password: password.trim(),
        });
        if (err) throw err;

        toast.success("Signed in!");
        const role = data.user?.app_metadata?.role;
        const destination = redirectTo ?? (role === "admin" ? "/admin/dashboard" : "/student/dashboard");
        router.push(destination);
        router.refresh();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
      toast.error("Login failed", { description: msg });
    } finally {
      setLoading(false);
    }
  }

  /* ── magic link sent state ─────────────────────────────────────────────── */
  if (magicSent) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-500/10">
          <Mail className="size-6 text-emerald-500" />
        </div>
        <div>
          <p className="font-semibold">Check your inbox</p>
          <p className="mt-1 text-sm text-muted-foreground">
            We sent a magic link to <strong>{value}</strong>. Click it to sign in.
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setMagicSent(false); setValue(""); }}
          className="text-sm text-primary underline-offset-2 hover:underline"
        >
          Use a different email
        </button>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "phone",    label: "Phone OTP",  icon: <Phone    className="size-3.5" /> },
    { id: "email",    label: "Magic link", icon: <Mail     className="size-3.5" /> },
    { id: "password", label: "Password",   icon: <KeyRound className="size-3.5" /> },
  ];

  return (
    <div className="space-y-5">
      {/* Tab switcher */}
      <div className="flex rounded-xl border border-border bg-secondary/40 p-1 gap-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => handleTabChange(t.id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-all",
              tab === t.id
                ? "bg-card shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Email / Phone field */}
        <div className="space-y-2">
          <Label htmlFor="auth-input">
            {tab === "phone" ? "Phone number" : "Email address"}
          </Label>
          <Input
            id="auth-input"
            type={tab === "phone" ? "tel" : "email"}
            className="h-11 text-base"
            placeholder={tab === "phone" ? "+880 1XXX-XXXXXX" : "you@example.com"}
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(""); }}
            aria-invalid={!!error}
            autoComplete={tab === "phone" ? "tel" : "email"}
            autoFocus
          />
        </div>

        {/* Password field — only on password tab */}
        {tab === "password" && (
          <div className="space-y-2">
            <Label htmlFor="auth-password">Password</Label>
            <Input
              id="auth-password"
              type="password"
              className="h-11 text-base"
              placeholder="••••••••••"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              autoComplete="current-password"
            />
          </div>
        )}

        {/* Error / hint */}
        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : (
          <p className="text-xs text-muted-foreground">
            {tab === "phone"    && "We'll send a 6-digit code via SMS."}
            {tab === "email"    && "We'll email you a one-click login link — no password needed."}
            {tab === "password" && "Sign in with your email and password."}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="h-11 w-full bg-brand-red text-brand-red-foreground hover:bg-brand-red/90"
        >
          {loading ? (
            <><Loader2 className="animate-spin" /> Signing in…</>
          ) : (
            <>
              {tab === "phone"    && "Send OTP code"}
              {tab === "email"    && "Send magic link"}
              {tab === "password" && "Sign in"}
              <ArrowRight />
            </>
          )}
        </Button>
      </form>

      {tab === "phone" && (
        <p className="text-center text-xs text-muted-foreground">
          No SMS yet?{" "}
          <button
            type="button"
            onClick={() => handleTabChange("email")}
            className="font-semibold text-primary hover:underline"
          >
            Use email instead →
          </button>
        </p>
      )}
    </div>
  );
}
