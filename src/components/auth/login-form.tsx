"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Mail, Phone } from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Tab = "phone" | "email";

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
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  function handleTabChange(t: Tab) {
    setTab(t);
    setValue("");
    setError("");
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
      } else {
        const email = value.trim().toLowerCase();
        const destination = redirectTo ?? "/student/dashboard";
        const { error: err } = await supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: true,
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(destination)}`,
          },
        });
        if (err) throw err;
        toast.success("Magic link sent!", {
          description: `Check ${email} for your login link.`,
        });
        // Show inline confirmation instead of redirecting
        setLoading(false);
        setError("");
        setValue("");
        // Show a persistent success note
        return;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
      toast.error("Login failed", { description: msg });
    } finally {
      setLoading(false);
    }
  }

  const placeholder = tab === "phone" ? "+880 1XXX-XXXXXX" : "you@example.com";
  const inputType   = tab === "phone" ? "tel" : "email";
  const btnLabel    = tab === "phone" ? "Send OTP code" : "Send magic link";
  const hint        = tab === "phone"
    ? "We'll send a 6-digit code via SMS."
    : "We'll email you a one-click login link — no password needed.";

  return (
    <div className="space-y-5">
      {/* Tab switcher */}
      <div className="flex rounded-xl border border-border bg-secondary/40 p-1">
        {(["phone", "email"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => handleTabChange(t)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-all",
              tab === t
                ? "bg-card shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t === "phone" ? <Phone className="size-3.5" /> : <Mail className="size-3.5" />}
            {t === "phone" ? "Phone OTP" : "Email link"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="auth-input">
            {tab === "phone" ? "Phone number" : "Email address"}
          </Label>
          <Input
            id="auth-input"
            type={inputType}
            className="h-11 text-base"
            placeholder={placeholder}
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(""); }}
            aria-invalid={!!error}
            autoComplete={tab === "phone" ? "tel" : "email"}
            autoFocus
          />
          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : (
            <p className="text-xs text-muted-foreground">{hint}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="h-11 w-full bg-brand-red text-brand-red-foreground hover:bg-brand-red/90"
        >
          {loading ? (
            <><Loader2 className="animate-spin" /> Sending…</>
          ) : (
            <>{btnLabel} <ArrowRight /></>
          )}
        </Button>
      </form>

      {tab === "phone" && (
        <p className="text-center text-xs text-muted-foreground">
          Phone OTP requires SMS configuration.{" "}
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
