import type { Metadata } from "next";
import { User } from "lucide-react";

import { getUser, getProfile } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Profile · NiHao Academy" };

export default async function StudentProfilePage() {
  const [user, profile] = await Promise.all([getUser(), getProfile()]);

  const name  = profile?.full_name ?? "—";
  const phone = profile?.phone     ?? user?.phone ?? "—";
  const email = profile?.email     ?? "—";
  const since = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <p className="font-mono text-xs font-semibold tracking-[0.2em] text-brand-red uppercase">
          Passenger details
        </p>
        <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight">
          My profile
        </h1>
      </div>

      <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
        {/* Avatar header */}
        <div className="flex items-center gap-4 border-b border-border px-6 py-5">
          <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="size-7" />
          </div>
          <div>
            <p className="font-heading text-lg font-semibold">{name}</p>
            <p className="text-sm text-muted-foreground">{phone}</p>
          </div>
        </div>

        {/* Details */}
        <dl className="divide-y divide-border">
          {[
            { label: "Full name",   value: name  },
            { label: "Phone",       value: phone },
            { label: "Email",       value: email },
            { label: "Member since", value: since },
            { label: "Status",      value: profile?.status ?? "—" },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between px-6 py-4">
              <dt className="text-sm text-muted-foreground">{label}</dt>
              <dd className="text-sm font-medium capitalize">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="border-t border-border px-6 py-4">
          <p className="text-xs text-muted-foreground">
            To update your details, contact us at{" "}
            <a
              href="mailto:support@nihao.academy"
              className="text-brand-red hover:underline"
            >
              support@nihao.academy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
