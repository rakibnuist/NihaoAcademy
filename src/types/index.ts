import type { LucideIcon } from "lucide-react";

export type CourseType = "csca" | "hsk" | "det" | "foundation";

export type BrandAccent = "blue" | "red" | "gold";

export interface CourseModule {
  title: string;
  description: string;
}

/** Marketing-facing course/program shown on the public site. */
export interface Course {
  slug: string;
  type: CourseType;
  name: string;
  shortName: string;
  tagline: string;
  summary: string;
  description: string;
  icon: LucideIcon;
  accent: BrandAccent;
  level: string;
  duration: string;
  format: string;
  priceBdt: number;
  priceNote?: string;
  popular?: boolean;
  highlights: string[];
  outcomes: string[];
  modules: CourseModule[];
}

export interface NavItem {
  label: string;
  href: string;
}

export interface Testimonial {
  name: string;
  role: string;
  initials: string;
  quote: string;
  accent: BrandAccent;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Stat {
  value: string;
  label: string;
}
