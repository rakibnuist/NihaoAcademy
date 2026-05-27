"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

/** Single 6-digit OTP input with individual boxes */
function OtpInput({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="relative flex justify-center gap-2">
      {/* Invisible real input for accessibility / keyboard */}
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={6}
        value={value}
        onChange={(e) => {
          const digits = e.target.value.replace(/\D/g, "").slice(0, 6);
          onChange(digits);
        }}
        disabled={disabled}
        autoComplete="one-time-code"
        autoFocus
        className="absolute inset-0 h-full w-full cursor-default opacity-0"
        aria-label="6-digit verification code"
      />

      {/* Visual boxes */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          onClick={() => inputRef.current?.focus()}
          className={`flex h-14 w-11 cursor-text items-center justify-center rounded-lg border text-xl font-semibold tabular-nums transition-colors ${
            i === value.length && !disabled
              ? "border-ring bg-card ring-3 ring-ring/30"
              : value[i]
              ? "border-foreground/30 bg-card"
              : "border-border bg-secondary/50"
          } ${disabled ? "opacity-50" : ""}`}
        >
          {value[i] ?? ""}
        </div>
      ))}
    </div>
  );
}

export function OtpVerifyForm({ phone, next }: { phone: string; next?: string }) {
  const router = useRouter();
  const [otp, setOtp] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [resendCooldown, setResendCooldown] = React.useState(0);

  // Countdown timer for resend
  React.useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = setInterval(() => {
      setResendCooldown((n) => Math.max(0, n - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [resendCooldown]);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (otp.length < 6) {
      setError("Enter the full 6-digit code.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: "sms",
      });

      if (verifyError) throw verifyError;

      // Check user role and redirect accordingly
      const role = data.user?.app_metadata?.role as string | undefined;

      toast.success("Verified!", {
        description: "Welcome aboard. Redirecting you now…",
      });

      const destination = next ?? (role === "admin" ? "/admin/dashboard" : "/student/dashboard");
      router.replace(destination);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Verification failed";
      setError(message);
      toast.error("Invalid code", { description: message });
      setOtp("");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (resendCooldown > 0) return;

    try {
      const supabase = createClient();
      const { error: resendError } = await supabase.auth.signInWithOtp({
        phone,
        options: { shouldCreateUser: true },
      });
      if (resendError) throw resendError;

      setResendCooldown(60);
      toast.success("New code sent!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not resend";
      toast.error("Resend failed", { description: message });
    }
  }

  // Auto-submit when 6 digits are entered
  React.useEffect(() => {
    if (otp.length === 6 && !loading) {
      const form = document.getElementById("otp-form") as HTMLFormElement;
      form?.requestSubmit();
    }
  }, [otp, loading]);

  return (
    <form id="otp-form" onSubmit={handleVerify} noValidate className="space-y-6">
      <OtpInput value={otp} onChange={setOtp} disabled={loading} />

      {error && (
        <p className="text-center text-sm text-destructive">{error}</p>
      )}

      <Button
        type="submit"
        disabled={loading || otp.length < 6}
        className="h-11 w-full bg-brand-red text-brand-red-foreground hover:bg-brand-red/90"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" />
            Verifying…
          </>
        ) : (
          <>
            Verify & board
            <ArrowRight />
          </>
        )}
      </Button>

      <div className="text-center">
        <button
          type="button"
          onClick={handleResend}
          disabled={resendCooldown > 0}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw className="size-3.5" />
          {resendCooldown > 0
            ? `Resend in ${resendCooldown}s`
            : "Resend code"}
        </button>
      </div>
    </form>
  );
}
