import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { OtpVerifyForm } from "@/components/auth/otp-verify-form";

export const metadata: Metadata = {
  title: "Verify code",
  description: "Enter the one-time code sent to your phone.",
};

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ phone?: string; next?: string }>;
}) {
  const { phone, next } = await searchParams;

  // If someone lands here without a phone in the query string, send them back.
  if (!phone) redirect("/login");

  const maskedPhone =
    phone.length > 4
      ? phone.slice(0, -4).replace(/\d/g, "•") + phone.slice(-4)
      : phone;

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 font-mono text-[11px] font-medium tracking-[0.18em] text-foreground/60 uppercase shadow-sm">
          <ShieldCheck className="size-3.5 text-brand-red" />
          Security check
        </span>
        <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight">
          Enter your code
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We sent a 6-digit code to{" "}
          <span className="font-semibold text-foreground">{maskedPhone}</span>.
          It expires in 5 minutes.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl bg-card shadow-lg shadow-primary/5 ring-1 ring-foreground/10">
        <div className="h-1.5 w-full bg-brand-red" />
        <div className="p-6 sm:p-8">
          <OtpVerifyForm phone={phone} next={next} />
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Wrong number?{" "}
        <a
          href="/login"
          className="font-semibold text-brand-red hover:underline"
        >
          Go back
        </a>
      </p>
    </div>
  );
}
