"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  phone: z
    .string()
    .trim()
    .min(6, "Enter a valid phone number")
    .regex(/^\+?[0-9\s\-()]+$/, "Enter a valid phone number"),
});

/** Normalise phone for Supabase: must start with + and country code */
function normalisePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  // Bangladesh numbers: 01XXXXXXXXX → +8801XXXXXXXXX
  if (digits.startsWith("01") && digits.length === 11) {
    return `+880${digits.slice(1)}`;
  }
  // Already has country code
  if (digits.startsWith("880") && digits.length === 13) {
    return `+${digits}`;
  }
  // Return with + if not already there
  return raw.startsWith("+") ? raw : `+${digits}`;
}

export function PhoneLoginForm() {
  const router = useRouter();
  const [phone, setPhone] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const result = schema.safeParse({ phone });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    const normalisedPhone = normalisePhone(phone.trim());
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: supabaseError } = await supabase.auth.signInWithOtp({
        phone: normalisedPhone,
        options: {
          // Create the user automatically if they don't exist yet
          shouldCreateUser: true,
        },
      });

      if (supabaseError) {
        throw supabaseError;
      }

      toast.success("Code sent!", {
        description: `A 6-digit code has been sent to ${normalisedPhone}.`,
      });

      router.push(
        `/verify?phone=${encodeURIComponent(normalisedPhone)}`
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      toast.error("Could not send code", { description: message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="phone">Phone number</Label>
        <Input
          id="phone"
          type="tel"
          className="h-11 text-base"
          placeholder="+880 1XXX-XXXXXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          aria-invalid={!!error}
          autoComplete="tel"
          autoFocus
        />
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Enter in international format, e.g. +880 1700-000000
        </p>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="h-11 w-full bg-brand-red text-brand-red-foreground hover:bg-brand-red/90"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" />
            Sending code…
          </>
        ) : (
          <>
            Send my code
            <ArrowRight />
          </>
        )}
      </Button>
    </form>
  );
}
