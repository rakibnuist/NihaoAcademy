import type { LucideIcon } from "lucide-react";

export type CourseCategory = "csca" | "hsk" | "professional" | "det";

export type Division = "live" | "recorded";

export type BrandAccent = "blue" | "red" | "gold";

export interface CourseModule {
  title: string;
  description: string;
}

/** A weekly recurring live-class slot (local time). */
export interface LiveSlot {
  /** 0 = Sunday … 6 = Saturday */
  day: number;
  hour: number;
  minute: number;
}

export interface LiveClass {
  scheduleLabel: string;
  zoomUrl: string;
  durationMinutes: number;
  slots: LiveSlot[];
}

export interface RecordedInfo {
  lessons: number;
  accessLabel: string;
}

/** Marketing-facing course shown on the public site. */
export interface Course {
  slug: string;
  category: CourseCategory;
  /** Short "route code" used in the boarding-pass UI, e.g. "ENG". */
  code: string;
  name: string;
  shortName: string;
  tagline: string;
  summary: string;
  description: string;
  icon: LucideIcon;
  accent: BrandAccent;
  /** Subjects for the CSCA admission tracks, e.g. ["Math", "Physics"]. */
  subjects?: string[];
  /** Which divisions this course is offered in. */
  divisions: Division[];
  /** Journey start, e.g. "Maths + Physics". */
  fromLabel: string;
  /** Journey destination, e.g. "Engineering, CN". */
  toLabel: string;
  /** Boarding-pass "gate" flavour text, e.g. "G1". */
  gate: string;
  level: string;
  duration: string;
  priceBdt: number;
  priceNote?: string;
  popular?: boolean;
  featured?: boolean;
  highlights: string[];
  outcomes: string[];
  modules: CourseModule[];
  /** Present when the course is offered as a live division. */
  live?: LiveClass;
  /** Present when the course is offered as a recorded division. */
  recorded: RecordedInfo;
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
