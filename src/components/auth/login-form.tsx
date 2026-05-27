"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronDown, KeyRound, Loader2, Mail, MessageSquare, Phone } from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

/* ── Country codes ─────────────────────────────────────────────────────────── */
const COUNTRY_CODES = [
  { code: "+880", flag: "🇧🇩", name: "Bangladesh" },
  { code: "+91",  flag: "🇮🇳", name: "India" },
  { code: "+92",  flag: "🇵🇰", name: "Pakistan" },
  { code: "+1",   flag: "🇺🇸", name: "USA / Canada" },
  { code: "+44",  flag: "🇬🇧", name: "UK" },
  { code: "+971", flag: "🇦🇪", name: "UAE" },
  { code: "+966", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "+60",  flag: "🇲🇾", name: "Malaysia" },
  { code: "+65",  flag: "🇸🇬", name: "Singapore" },
  { code: "+86",  flag: "🇨🇳", name: "China" },
  { code: "+81",  flag: "🇯🇵", name: "Japan" },
  { code: "+49",  flag: "🇩🇪", name: "Germany" },
  { code: "+33",  flag: "🇫🇷", name: "France" },
  { code: "+61",  flag: "🇦🇺", name: "Australia" },
];

/* ── Helpers ───────────────────────────────────────────────────────────────── */
function isEmail(v: string) {
  return v.includes("@");
}

function looksLikePhone(v: string) {
  return /^[\d\s\-()]+$/.test(v) && v.replace(/\D/g, "").length >= 4;
}

function buildE164(countryCode: string, number: string) {
  const digits = number.replace(/\D/g, "");
  // Remove leading zero if present (common in BD: 01xxx → +88001xxx → wrong)
  const stripped = digits.startsWith("0") ? digits.slice(1) : digits;
  return `${countryCode}${stripped}`;
}

type Tab = "otp" | "password";

/* ── Component ─────────────────────────────────────────────────────────────── */
export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const [tab, setTab]               = React.useState<Tab>("otp");
  const [input, setInput]           = React.useState("");
  const [countryCode, setCountryCode] = React.useState("+880");
  const [ccOpen, setCcOpen]         = React.useState(false);
  const [password, setPassword]     = React.useState("");
  const [error, setError]           = React.useState("");
  const [loading, setLoading]       = React.useState(false);
  const [otpSent, setOtpSent]       = React.useState(false);
  const ccRef                       = React.useRef<HTMLDivElement>(null);

  // Close country-code dropdown on outside click
  React.useEffect(() => {
    function handler(e: MouseEvent) {
      if (ccRef.current && !ccRef.current.contains(e.target as Node)) setCcOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const inputIsEmail = isEmail(input);
  const inputIsPhone = !inputIsEmail && looksLikePhone(input);
  const inputType    = inputIsEmail ? "email" : inputIsPhone ? "phone" : "unknown";

  function handleTabChange(t: Tab) {
    setTab(t); setInput(""); setPassword(""); setError(""); setOtpSent(false);
  }

  function hint() {
    if (tab === "password") {
      if (!input) return "Enter your email address or phone number.";
      if (inputIsEmail) return "Sign in with your email and password.";
      if (inputIsPhone) return "Sign in with your phone number and password.";
      return "Enter a valid email or phone number.";
    }
    if (!input) return "Enter your email or phone number to receive a sign-in code.";
    if (inputIsEmail) return "We'll send a one-click magic link to your email.";
    if (inputIsPhone) return "We'll send a 6-digit OTP to your phone via SMS.";
    return "Enter a valid email or phone number.";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const trimmed = input.trim();
    if (!trimmed) { setError("Enter your email or phone number."); return; }

    const isEmailInput  = isEmail(trimmed);
    const isPhoneInput  = !isEmailInput;

    setLoading(true);
    const supabase = createClient();

    try {
      if (tab === "otp") {
        if (isEmailInput) {
          const destination = redirectTo ?? "/student/dashboard";
          const { error: err } = await supabase.auth.signInWithOtp({
            email: trimmed.toLowerCase(),
            options: {
              shouldCreateUser: true,
              emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin}/auth/callback?next=${encodeURIComponent(destination)}`,
            },
          });
          if (err) throw err;
          setOtpSent(true);
          toast.success("Magic link sent!", { description: `Check ${trimmed} for your link.` });
        } else {
          // Phone OTP via SMS
          const phone = buildE164(countryCode, trimmed);
          const { error: err } = await supabase.auth.signInWithOtp({
            phone,
            options: { shouldCreateUser: true },
          });
          if (err) throw err;
          toast.success("OTP sent!", { description: `6-digit code sent to ${phone}` });
          const next = redirectTo ? `&next=${encodeURIComponent(redirectTo)}` : "";
          router.push(`/verify?phone=${encodeURIComponent(phone)}${next}`);
        }
      } else {
        // Password sign-in
        if (!password.trim()) { setError("Enter your password."); setLoading(false); return; }

        let signInResult;
        if (isEmailInput) {
          signInResult = await supabase.auth.signInWithPassword({
            email: trimmed.toLowerCase(),
            password: password.trim(),
          });
        } else {
          const phone = buildE164(countryCode, trimmed);
          signInResult = await supabase.auth.signInWithPassword({
            phone,
            password: password.trim(),
          });
        }

        const { data, error: err } = signInResult;
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
    } finally {
      setLoading(false);
    }
  }

  /* ── OTP sent confirmation screen ─────────────────────────────────────── */
  if (otpSent) {
    return (
      <div className="space-y-5 text-center py-2">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500/10">
          <Mail className="size-7 text-emerald-500" />
        </div>
        <div>
          <p className="font-semibold text-lg">Check your inbox</p>
          <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
            We sent a magic sign-in link to<br />
            <strong className="text-foreground">{input}</strong>
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Link expires in 24 hours. Check spam if not received.
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setOtpSent(false); setInput(""); }}
          className="text-sm font-medium text-primary underline-offset-2 hover:underline"
        >
          ← Try a different address
        </button>
      </div>
    );
  }

  const selectedCountry = COUNTRY_CODES.find(c => c.code === countryCode) ?? COUNTRY_CODES[0];

  return (
    <div className="space-y-5">

      {/* ── Tab switcher ─────────────────────────────────────────────────── */}
      <div className="flex rounded-xl border border-border bg-secondary/40 p-1 gap-1">
        {([
          { id: "otp" as Tab,      label: "Send OTP",  icon: <MessageSquare className="size-3.5" /> },
          { id: "password" as Tab, label: "Password",  icon: <KeyRound      className="size-3.5" /> },
        ]).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => handleTabChange(t.id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-medium transition-all",
              tab === t.id
                ? "bg-card shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">

        {/* ── Smart input ───────────────────────────────────────────────── */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold" htmlFor="auth-input">
            Email or phone number
          </label>

          <div className="flex gap-2">
            {/* Country code — shown when input is phone (or empty, as default) */}
            {!inputIsEmail && (
              <div className="relative shrink-0" ref={ccRef}>
                <button
                  type="button"
                  onClick={() => setCcOpen((o) => !o)}
                  className="flex h-11 items-center gap-1.5 rounded-xl border border-border bg-background px-3 text-sm font-medium hover:bg-secondary transition-colors whitespace-nowrap"
                >
                  <span>{selectedCountry.flag}</span>
                  <span className="font-mono">{countryCode}</span>
                  <ChevronDown className={cn("size-3.5 text-muted-foreground transition-transform", ccOpen && "rotate-180")} />
                </button>

                {ccOpen && (
                  <div className="absolute top-full left-0 z-50 mt-1.5 w-56 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
                    <div className="max-h-60 overflow-y-auto py-1">
                      {COUNTRY_CODES.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => { setCountryCode(c.code); setCcOpen(false); }}
                          className={cn(
                            "flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-secondary",
                            countryCode === c.code && "bg-primary/5 text-primary font-semibold"
                          )}
                        >
                          <span className="text-base">{c.flag}</span>
                          <span className="flex-1 text-left">{c.name}</span>
                          <span className="font-mono text-xs text-muted-foreground">{c.code}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Main input */}
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
                {inputIsEmail
                  ? <Mail  className="size-4 text-muted-foreground" />
                  : <Phone className="size-4 text-muted-foreground" />}
              </div>
              <input
                id="auth-input"
                type={inputIsEmail ? "email" : "tel"}
                inputMode={inputIsEmail ? "email" : "numeric"}
                className={cn(
                  "h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors",
                  error && "border-destructive focus:ring-destructive/30"
                )}
                placeholder={inputIsEmail ? "you@example.com" : "01XXX XXX XXX"}
                value={input}
                onChange={(e) => { setInput(e.target.value); setError(""); }}
                autoComplete={inputIsEmail ? "email" : "tel"}
                autoFocus
              />
              {/* Detection badge */}
              {input.length > 3 && (
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <span className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                    inputIsEmail ? "bg-primary/10 text-primary"
                    : inputIsPhone ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-secondary text-muted-foreground"
                  )}>
                    {inputIsEmail ? "Email" : inputIsPhone ? "Phone" : "?"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Password field ────────────────────────────────────────────── */}
        {tab === "password" && (
          <div className="space-y-2">
            <label className="block text-sm font-semibold" htmlFor="auth-password">
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              className={cn(
                "h-11 w-full rounded-xl border border-border bg-background px-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors",
                error && "border-destructive"
              )}
              placeholder="••••••••"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              autoComplete="current-password"
            />
          </div>
        )}

        {/* Error / hint */}
        {error ? (
          <p className="flex items-start gap-1.5 text-sm text-destructive">
            <span className="mt-0.5 shrink-0">⚠</span> {error}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">{hint()}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-red px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-red/90 disabled:opacity-60"
        >
          {loading ? (
            <><Loader2 className="size-4 animate-spin" /> Please wait…</>
          ) : (
            <>
              {tab === "otp"
                ? inputIsEmail ? "Send magic link" : "Send OTP code"
                : "Sign in"}
              <ArrowRight className="size-4" />
            </>
          )}
        </button>
      </form>

      {/* Forgot password hint */}
      {tab === "password" && (
        <p className="text-center text-xs text-muted-foreground">
          Don&apos;t have a password?{" "}
          <button
            type="button"
            onClick={() => handleTabChange("otp")}
            className="font-semibold text-primary hover:underline underline-offset-2"
          >
            Use OTP instead →
          </button>
        </p>
      )}
    </div>
  );
}
