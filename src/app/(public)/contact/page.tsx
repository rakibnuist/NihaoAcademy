import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { siteConfig } from "@/lib/site";
import { Container } from "@/components/public/container";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with NiHao Academy — call, WhatsApp or email us, or visit our Dhaka campus.",
};

export default function ContactPage() {
  const methods = [
    {
      icon: Phone,
      label: "Call us",
      value: siteConfig.contact.phone,
      href: siteConfig.contact.phoneHref,
      cta: "Call now",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: siteConfig.contact.whatsapp,
      href: siteConfig.contact.whatsappHref,
      cta: "Chat on WhatsApp",
      external: true,
    },
    {
      icon: Mail,
      label: "Email",
      value: siteConfig.contact.email,
      href: siteConfig.contact.emailHref,
      cta: "Send an email",
    },
  ];

  return (
    <>
      <section className="relative border-b border-border bg-secondary/30">
        <div
          aria-hidden
          className="bg-dots pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
        />
        <Container className="relative py-14 text-center sm:py-20">
          <p className="font-mono text-xs font-semibold tracking-[0.2em] text-brand-red uppercase">
            Help desk
          </p>
          <h1 className="mx-auto mt-3 max-w-2xl font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
            Talk to an advisor
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Questions about a course, scholarships or the visa process? We&apos;re
            happy to help — reach us any way you like.
          </p>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="grid gap-8 lg:grid-cols-3">
          <div className="grid gap-5 sm:grid-cols-3 lg:col-span-2 lg:grid-cols-1">
            {methods.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.label}
                  className="flex flex-col rounded-xl bg-card p-6 ring-1 ring-foreground/10 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <div className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
                        {m.label}
                      </div>
                      <div className="mt-0.5 font-medium">{m.value}</div>
                    </div>
                  </div>
                  <a
                    href={m.href}
                    target={m.external ? "_blank" : undefined}
                    rel={m.external ? "noopener noreferrer" : undefined}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-red hover:underline lg:mt-0"
                  >
                    {m.cta}
                  </a>
                </div>
              );
            })}
          </div>

          <aside className="space-y-6">
            <div className="rounded-xl bg-card p-6 ring-1 ring-foreground/10">
              <div className="flex items-center gap-2">
                <MapPin className="size-5 text-brand-red" />
                <h2 className="font-heading text-base font-semibold">
                  Our office
                </h2>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {siteConfig.contact.address}
              </p>
            </div>

            <div className="rounded-xl bg-card p-6 ring-1 ring-foreground/10">
              <div className="flex items-center gap-2">
                <Clock className="size-5 text-brand-red" />
                <h2 className="font-heading text-base font-semibold">
                  Office hours
                </h2>
              </div>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Sat – Thu</dt>
                  <dd className="font-medium">10:00 AM – 8:00 PM</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Friday</dt>
                  <dd className="font-medium">Closed</dd>
                </div>
              </dl>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
