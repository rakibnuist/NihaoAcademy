import type { Metadata } from "next";
import { BadgeCheck, CalendarClock, MessageCircle, PhoneCall } from "lucide-react";

import { siteConfig } from "@/lib/site";
import { Container } from "@/components/public/container";
import { EnrollForm } from "@/components/public/enroll-form";

export const metadata: Metadata = {
  title: "Enroll",
  description:
    "Reserve your seat at NiHao Academy. Tell us a little about you and we'll confirm your enrollment within 24 hours.",
};

const steps = [
  {
    icon: PhoneCall,
    title: "We call to confirm",
    description: "Within 24 hours we'll confirm your batch and answer questions.",
  },
  {
    icon: CalendarClock,
    title: "You join your batch",
    description: "Pay securely with bKash, Nagad or card and get your schedule.",
  },
  {
    icon: BadgeCheck,
    title: "Your journey begins",
    description: "Unlock your dashboard, live classes and recorded lessons.",
  },
];

export default async function EnrollPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string }>;
}) {
  const { course } = await searchParams;

  return (
    <section className="relative">
      <div
        aria-hidden
        className="bg-dots pointer-events-none absolute inset-0 h-80 opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent)]"
      />
      <Container className="relative py-14 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs font-semibold tracking-[0.2em] text-brand-red uppercase">
            Boarding pass · Reservation
          </p>
          <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
            Reserve your seat
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Tell us a little about you. It takes a minute, and there&apos;s no
            payment now — we&apos;ll call to confirm.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-2xl bg-card p-6 shadow-lg shadow-primary/5 ring-1 ring-foreground/10 sm:p-8">
            <EnrollForm defaultCourse={course} />
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl bg-primary p-6 text-primary-foreground ring-1 ring-foreground/10">
              <h2 className="font-heading text-lg font-semibold">
                What happens next
              </h2>
              <ol className="mt-5 space-y-5">
                {steps.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <li key={step.title} className="flex gap-4">
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-primary-foreground">
                        <Icon className="size-4" />
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] text-brand-gold">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <h3 className="text-sm font-semibold">{step.title}</h3>
                        </div>
                        <p className="mt-1 text-sm text-primary-foreground/70">
                          {step.description}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className="rounded-2xl bg-card p-6 ring-1 ring-foreground/10">
              <h3 className="font-heading text-base font-semibold">
                Prefer to talk first?
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Message us on WhatsApp at{" "}
                <span className="font-medium text-foreground">
                  {siteConfig.contact.whatsapp}
                </span>{" "}
                and an advisor will help you choose.
              </p>
              <a
                href={siteConfig.contact.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-red hover:underline"
              >
                <MessageCircle className="size-4" />
                Chat on WhatsApp
              </a>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
