import { Award, Globe, Languages, Plane } from "lucide-react";

import type { Course, CourseType } from "@/types";

export const courseTypeLabel: Record<CourseType, string> = {
  csca: "Chinese Language",
  hsk: "HSK Exam Prep",
  det: "English / DET",
  foundation: "Study Abroad",
};

export const courses: Course[] = [
  {
    slug: "csca",
    type: "csca",
    name: "CSCA — Spoken Chinese for Beginners",
    shortName: "Spoken Chinese (CSCA)",
    tagline: "Speak real Chinese from week one",
    summary:
      "A friendly, structured start to Mandarin — pinyin, tones, characters and everyday conversation for absolute beginners.",
    description:
      "The Chinese Speaking & Communication Accelerator (CSCA) is our flagship entry course. You'll go from your very first 你好 to holding everyday conversations, with a balance of speaking, listening, reading and writing. Small live batches mean you get real speaking practice and feedback every single class.",
    icon: Languages,
    accent: "red",
    level: "Absolute beginner → conversational",
    duration: "4 months · 2 classes / week",
    format: "Live online + in-person (Dhaka)",
    priceBdt: 12000,
    highlights: [
      "Master pinyin, tones and 300+ core characters",
      "Daily-life conversation drills in small groups",
      "Native-level pronunciation coaching",
      "Recorded lessons in your student library",
    ],
    outcomes: [
      "Introduce yourself and handle everyday situations in Chinese",
      "Read and write essential Chinese characters",
      "A confident foundation for the HSK track",
    ],
    modules: [
      {
        title: "Pinyin & tones",
        description: "The sound system of Mandarin, built from scratch.",
      },
      {
        title: "Everyday conversation",
        description: "Greetings, shopping, directions, food and family.",
      },
      {
        title: "Characters & reading",
        description: "Stroke order, radicals and your first 300 characters.",
      },
      {
        title: "Putting it together",
        description: "Role-plays and a final spoken assessment.",
      },
    ],
  },
  {
    slug: "hsk",
    type: "hsk",
    name: "HSK Preparation (HSK 1–6)",
    shortName: "HSK Preparation",
    tagline: "Pass HSK with a proven system",
    summary:
      "Level-by-level HSK preparation with a full question bank, timed mock tests and per-topic feedback to target your weak areas.",
    description:
      "Our HSK track takes you level by level — from HSK 1 all the way to HSK 6 — with the exact vocabulary, grammar and exam strategy each level demands. Weekly timed mock tests mirror the real exam, and detailed score reports show precisely what to revise next. This is the same system behind our 95% pass rate.",
    icon: Award,
    accent: "blue",
    level: "HSK 1 through HSK 6",
    duration: "3–6 months per level",
    format: "Live online + in-person (Dhaka)",
    priceBdt: 15000,
    priceNote: "per level",
    popular: true,
    highlights: [
      "Complete vocabulary & grammar for each HSK level",
      "Weekly timed mock tests in real exam format",
      "Per-topic and per-difficulty score reports",
      "Listening, reading and writing strategy",
    ],
    outcomes: [
      "Walk into the HSK exam knowing exactly what to expect",
      "A clear, data-driven view of your weak areas",
      "The level you need for CSC scholarships & admissions",
    ],
    modules: [
      {
        title: "Vocabulary & grammar",
        description: "Every word and pattern required for your target level.",
      },
      {
        title: "Listening lab",
        description: "Graded audio practice that builds real exam stamina.",
      },
      {
        title: "Timed mock tests",
        description: "Weekly full-length mocks under exam conditions.",
      },
      {
        title: "Score analysis",
        description: "Topic-by-topic feedback and a focused revision plan.",
      },
    ],
  },
  {
    slug: "det",
    type: "det",
    name: "Duolingo English Test (DET) Prep",
    shortName: "DET Preparation",
    tagline: "Hit the DET score your university wants",
    summary:
      "Focused, fast preparation for the Duolingo English Test — question-type drills, full practice tests and writing & speaking feedback.",
    description:
      "The Duolingo English Test is now accepted by thousands of universities, and it's faster and cheaper than IELTS. Our DET prep is laser-focused on the test's unique question types, with realistic practice tests and personal feedback on your writing and speaking samples so you reach your target score quickly.",
    icon: Globe,
    accent: "gold",
    level: "Targeting 105–135+",
    duration: "6 weeks · flexible pace",
    format: "Live online + self-paced practice",
    priceBdt: 9000,
    highlights: [
      "Drills for every DET question type",
      "Full-length practice tests with scoring",
      "Personal feedback on writing & speaking",
      "Test-day strategy and time management",
    ],
    outcomes: [
      "Confidence with the DET's adaptive format",
      "A polished writing and speaking sample technique",
      "The score your target universities require",
    ],
    modules: [
      {
        title: "Test format & strategy",
        description: "How the adaptive DET works and how to beat the clock.",
      },
      {
        title: "Reading & listening drills",
        description: "Rapid pattern recognition for every question type.",
      },
      {
        title: "Writing workshop",
        description: "Structures and feedback for the written responses.",
      },
      {
        title: "Speaking & full mocks",
        description: "Recorded speaking practice plus full scored tests.",
      },
    ],
  },
  {
    slug: "foundation",
    type: "foundation",
    name: "University Foundation & Study-Abroad Program",
    shortName: "Foundation Program",
    tagline: "Your full path to studying in China",
    summary:
      "End-to-end support to study abroad — university selection, applications, documents, scholarships and a guided visa checklist.",
    description:
      "The Foundation Program is your complete, guided route from Bangladesh to a university seat abroad — with a special focus on China. We help you choose the right universities, prepare a strong application, organise every document, apply for scholarships like the CSC, and work through the visa process step by step with one-on-one support.",
    icon: Plane,
    accent: "blue",
    level: "Undergraduate & postgraduate applicants",
    duration: "Full admission cycle",
    format: "1-on-1 advising + workshops",
    priceBdt: 25000,
    priceNote: "+ university fees",
    highlights: [
      "Personalised university & program shortlisting",
      "Application and statement-of-purpose support",
      "Scholarship guidance (CSC and university awards)",
      "Document organisation and a guided visa checklist",
    ],
    outcomes: [
      "A strong, complete application to the right universities",
      "Maximised scholarship and funding chances",
      "A clear, stress-free visa and departure plan",
    ],
    modules: [
      {
        title: "Discovery & shortlist",
        description: "Match your goals and budget to the right universities.",
      },
      {
        title: "Application & documents",
        description: "SOP, transcripts, references and certified paperwork.",
      },
      {
        title: "Scholarships",
        description: "CSC and university scholarship applications.",
      },
      {
        title: "Visa & departure",
        description: "Step-by-step visa checklist and pre-departure briefing.",
      },
    ],
  },
];

export function getCourse(slug: string): Course | undefined {
  return courses.find((course) => course.slug === slug);
}

export function formatBdt(amount: number): string {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);
}
