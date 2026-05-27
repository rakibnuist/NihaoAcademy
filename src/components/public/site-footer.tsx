import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { siteConfig } from "@/lib/site";
import { courses } from "@/lib/courses";
import { Container } from "@/components/public/container";
import { Logo } from "@/components/public/logo";

const company = [
  { label: "About us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Enroll now", href: "/enroll" },
  { label: "Student login", href: "/login" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-secondary/40">
      <Container className="py-12 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {siteConfig.description} Learn from expert instructors, online and
              in person in Dhaka.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Courses</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {courses.map((course) => (
                <li key={course.slug}>
                  <Link
                    href={`/courses/${course.slug}`}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {course.shortName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Company</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {company.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Get in touch</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>
                <a
                  href={siteConfig.contact.phoneHref}
                  className="flex items-center gap-2.5 transition-colors hover:text-foreground"
                >
                  <Phone className="size-4 shrink-0 text-primary" />
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.contact.whatsappHref}
                  className="flex items-center gap-2.5 transition-colors hover:text-foreground"
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle className="size-4 shrink-0 text-primary" />
                  WhatsApp us
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.contact.emailHref}
                  className="flex items-center gap-2.5 transition-colors hover:text-foreground"
                >
                  <Mail className="size-4 shrink-0 text-primary" />
                  {siteConfig.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{siteConfig.contact.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p>Made with care in Dhaka, Bangladesh.</p>
        </div>
      </Container>
    </footer>
  );
}
