import {
  Briefcase,
  Captions,
  Cog,
  Handshake,
  Languages,
  Sparkles,
  Stethoscope,
} from "lucide-react";

import type { Course, CourseCategory, CurriculumWeek, LiveClass } from "@/types";

export const carrierCode = "NA"; // "NiHao Air" — boarding-pass flavour

export const courseCategoryLabel: Record<CourseCategory, string> = {
  csca: "CSCA Admission Prep",
  hsk: "HSK Exam Prep",
  professional: "Professional Chinese",
  det: "English / DET",
};

export const courses: Course[] = [
  /* ─────────────────────────────────────────────────────── 1. Engineering CSCA */
  {
    slug: "engineering-csca",
    category: "csca",
    code: "ENG",
    featured: true,
    name: "Engineering CSCA",
    shortName: "Engineering CSCA",
    tagline: "Crack China's engineering entrance with Maths & Physics",
    summary:
      "A rigorous, bilingual CSCA prep track covering the Mathematics and Physics syllabus required for undergraduate engineering admission at Chinese universities.",
    description:
      "China's university entrance screening (CSCA) for Engineering asks for strong Mathematics and Physics. This course mirrors the exact exam syllabus — every topic, every question type — in both English and Mandarin so you're comfortable on exam day. Taught in small live batches with a recorded library for review, it's the shortest, most direct path to an engineering offer letter.",
    icon: Cog,
    accent: "blue",
    subjects: ["Math", "Physics"],
    divisions: ["live", "recorded"],
    fromLabel: "Maths + Physics",
    toLabel: "Engineering, CN",
    gate: "G1",
    level: "Secondary / A-Level equivalent",
    duration: "5 months · 3 sessions / week",
    priceBdt: 15000,
    highlights: [
      "Full Math & Physics CSCA syllabus, topic by topic",
      "Bilingual instruction — English explanations, Mandarin terms",
      "Past-paper analysis and timed mock exams",
      "Dedicated doubt-clearing sessions before exam windows",
    ],
    outcomes: [
      "Master every topic in the Engineering CSCA syllabus",
      "Read and answer exam questions in Chinese confidently",
      "A strong application for Tsinghua, Zhejiang, HUST and more",
    ],
    modules: [
      {
        title: "Calculus & Algebra",
        description: "Limits, derivatives, integrals and linear systems.",
      },
      {
        title: "Mechanics & Dynamics",
        description: "Kinematics, Newton's laws, work-energy and momentum.",
      },
      {
        title: "Electricity & Waves",
        description: "Fields, circuits, optics and modern physics.",
      },
      {
        title: "Mock Exams & Review",
        description: "Full timed papers under real exam conditions.",
      },
    ],
    live: {
      scheduleLabel: "Mon · Wed · Fri  ·  7:00 PM BST",
      zoomUrl: "https://zoom.us/j/1000000001",
      durationMinutes: 90,
      slots: [
        { day: 1, hour: 19, minute: 0 },
        { day: 3, hour: 19, minute: 0 },
        { day: 5, hour: 19, minute: 0 },
      ],
    },
    recorded: {
      lessons: 50,
      accessLabel: "12-month access",
    },
    instructorSlugs: ["dr-rafiqul-islam"],
    enrolledCount: 420,
    rating: 4.8,
    reviewCount: 134,
    curriculum: [
      {
        weekNumber: 1,
        title: "Foundations — Algebra & Functions",
        lessons: [
          { title: "Course orientation & exam overview", type: "video", durationMinutes: 15, isFreePreview: true },
          { title: "Algebra: equations, inequalities and sets", type: "video", durationMinutes: 55, isFreePreview: true },
          { title: "Functions — definition, domain, range", type: "video", durationMinutes: 50 },
          { title: "Week 1 quiz — Algebra fundamentals", type: "quiz" },
        ],
      },
      {
        weekNumber: 2,
        title: "Calculus — Limits & Differentiation",
        lessons: [
          { title: "Limits and continuity explained", type: "video", durationMinutes: 60 },
          { title: "Derivatives — rules and applications", type: "video", durationMinutes: 65 },
          { title: "Live class — derivatives problem session", type: "live", durationMinutes: 90 },
          { title: "Week 2 quiz", type: "quiz" },
        ],
      },
      {
        weekNumber: 3,
        title: "Calculus — Integration",
        lessons: [
          { title: "Antiderivatives and indefinite integrals", type: "video", durationMinutes: 55 },
          { title: "Definite integrals and area under curve", type: "video", durationMinutes: 60 },
          { title: "Integration by substitution & parts", type: "video", durationMinutes: 50 },
          { title: "Live class — integration drills", type: "live", durationMinutes: 90 },
        ],
      },
      {
        weekNumber: 4,
        title: "Mechanics — Kinematics & Dynamics",
        lessons: [
          { title: "Kinematics: motion in one and two dimensions", type: "video", durationMinutes: 55 },
          { title: "Newton's laws and their applications", type: "video", durationMinutes: 60 },
          { title: "Work, energy and power", type: "video", durationMinutes: 50 },
          { title: "Live class — mechanics problem set", type: "live", durationMinutes: 90 },
        ],
      },
      {
        weekNumber: 5,
        title: "Electricity, Waves & Mock Exams",
        lessons: [
          { title: "Electric fields, circuits and Ohm's law", type: "video", durationMinutes: 65 },
          { title: "Waves, optics and modern physics", type: "video", durationMinutes: 60 },
          { title: "Full mock exam 1 — timed", type: "quiz" },
          { title: "Mock exam review — live Q&A session", type: "live", durationMinutes: 90 },
          { title: "Chinese terminology glossary PDF", type: "resource" },
        ],
      },
    ],
  },

  /* ─────────────────────────────────────────────────────── 2. Medical CSCA */
  {
    slug: "medical-csca",
    category: "csca",
    code: "MED",
    name: "Medical CSCA",
    shortName: "Medical CSCA",
    tagline: "Your pathway to Chinese medical schools",
    summary:
      "Targeted CSCA prep for aspiring doctors — covering the Biology, Chemistry and Physics syllabus demanded by China's top medical universities.",
    description:
      "Medical admissions in China require a strong showing in the CSCA's Biology and Chemistry sections alongside Physics. This track is built specifically for that combination. Instructors unpack the Chinese-language exam terminology, run weekly mock exams, and give individual feedback so your scores reflect your real potential.",
    icon: Stethoscope,
    accent: "red",
    subjects: ["Math", "Physics"],
    divisions: ["live", "recorded"],
    fromLabel: "Bio + Chem + Physics",
    toLabel: "Medicine, CN",
    gate: "G2",
    level: "Secondary / A-Level equivalent",
    duration: "5 months · 3 sessions / week",
    priceBdt: 15000,
    highlights: [
      "Biology, Chemistry and Physics to CSCA Medical standard",
      "Bilingual terminology for exam-day confidence",
      "Weekly mock exams with per-topic score reports",
      "Application guidance for CSC scholarship eligibility",
    ],
    outcomes: [
      "Command the Medical CSCA syllabus across all three subjects",
      "Handle Chinese-language exam papers without hesitation",
      "A competitive application to MBBS programs across China",
    ],
    modules: [
      {
        title: "Cell Biology & Genetics",
        description: "Cell structure, mitosis, Mendelian and molecular genetics.",
      },
      {
        title: "Organic & Inorganic Chemistry",
        description: "Bonding, reactions, stoichiometry and organic synthesis.",
      },
      {
        title: "Physics for Medicine",
        description: "Mechanics, electricity and wave phenomena.",
      },
      {
        title: "Mock Papers & Terminology",
        description: "Full CSCA medical mocks with bilingual glossary review.",
      },
    ],
    live: {
      scheduleLabel: "Tue · Thu · Sat  ·  7:00 PM BST",
      zoomUrl: "https://zoom.us/j/1000000002",
      durationMinutes: 90,
      slots: [
        { day: 2, hour: 19, minute: 0 },
        { day: 4, hour: 19, minute: 0 },
        { day: 6, hour: 19, minute: 0 },
      ],
    },
    recorded: {
      lessons: 50,
      accessLabel: "12-month access",
    },
    instructorSlugs: ["dr-rafiqul-islam"],
    enrolledCount: 310,
    rating: 4.7,
    reviewCount: 89,
    curriculum: [
      {
        weekNumber: 1,
        title: "Cell Biology & Genetics",
        lessons: [
          { title: "Course overview & Medical CSCA syllabus", type: "video", durationMinutes: 15, isFreePreview: true },
          { title: "Cell structure and organelles", type: "video", durationMinutes: 55, isFreePreview: true },
          { title: "Mitosis, meiosis and cell division", type: "video", durationMinutes: 60 },
          { title: "Mendelian genetics fundamentals", type: "video", durationMinutes: 55 },
          { title: "Week 1 quiz", type: "quiz" },
        ],
      },
      {
        weekNumber: 2,
        title: "Organic & Inorganic Chemistry",
        lessons: [
          { title: "Chemical bonding and molecular structure", type: "video", durationMinutes: 55 },
          { title: "Organic reactions and functional groups", type: "video", durationMinutes: 65 },
          { title: "Stoichiometry and mole calculations", type: "video", durationMinutes: 50 },
          { title: "Live class — chemistry problem session", type: "live", durationMinutes: 90 },
        ],
      },
      {
        weekNumber: 3,
        title: "Physics for Medicine",
        lessons: [
          { title: "Mechanics and fluid dynamics", type: "video", durationMinutes: 55 },
          { title: "Electricity and bioelectric phenomena", type: "video", durationMinutes: 60 },
          { title: "Optics and imaging in medicine", type: "video", durationMinutes: 50 },
          { title: "Live class — medical physics", type: "live", durationMinutes: 90 },
        ],
      },
      {
        weekNumber: 4,
        title: "Mock Papers & Chinese Terminology",
        lessons: [
          { title: "Full timed mock exam 1", type: "quiz" },
          { title: "Bilingual medical terminology glossary", type: "resource" },
          { title: "Mock review & exam strategy", type: "live", durationMinutes: 90 },
          { title: "Full timed mock exam 2", type: "quiz" },
        ],
      },
    ],
  },

  /* ─────────────────────────────────────────────────────── 3. Business CSCA */
  {
    slug: "business-csca",
    category: "csca",
    code: "BIZ",
    name: "Business CSCA",
    shortName: "Business CSCA",
    tagline: "Open the door to China's top business schools",
    summary:
      "A focused CSCA preparation course for Business and Economics applicants — centred on the Mathematics syllabus and academic Mandarin used in Chinese university entrance.",
    description:
      "Business-track CSCA primarily tests Mathematics at a pre-university level — statistics, financial maths, calculus fundamentals — alongside reading comprehension in Mandarin. This course covers every tested topic, builds exam stamina through timed mocks, and ensures you can navigate the Chinese-language paper with ease.",
    icon: Briefcase,
    accent: "gold",
    subjects: ["Math"],
    divisions: ["live", "recorded"],
    fromLabel: "Mathematics",
    toLabel: "Business, CN",
    gate: "G3",
    level: "Secondary / A-Level equivalent",
    duration: "4 months · 2 sessions / week",
    priceBdt: 12000,
    highlights: [
      "Complete Business CSCA Mathematics syllabus",
      "Statistics, financial maths and basic calculus",
      "Mandarin reading comprehension for exam passages",
      "Timed practice papers and performance tracking",
    ],
    outcomes: [
      "Confidently tackle every Mathematics question in the Business CSCA",
      "Read and interpret Chinese exam instructions without support",
      "A strong application to Business and Economics programs in China",
    ],
    modules: [
      {
        title: "Algebra & Functions",
        description: "Equations, inequalities, sequences and series.",
      },
      {
        title: "Statistics & Probability",
        description: "Data analysis, distributions and basic inference.",
      },
      {
        title: "Calculus Foundations",
        description: "Limits, differentiation and introductory integration.",
      },
      {
        title: "Mock Tests & Mandarin Reading",
        description: "Full papers plus bilingual exam comprehension drills.",
      },
    ],
    live: {
      scheduleLabel: "Mon · Thu  ·  8:00 PM BST",
      zoomUrl: "https://zoom.us/j/1000000003",
      durationMinutes: 90,
      slots: [
        { day: 1, hour: 20, minute: 0 },
        { day: 4, hour: 20, minute: 0 },
      ],
    },
    recorded: {
      lessons: 36,
      accessLabel: "12-month access",
    },
    instructorSlugs: ["zhang-ming"],
    enrolledCount: 210,
    rating: 4.7,
    reviewCount: 62,
    curriculum: [
      {
        weekNumber: 1,
        title: "Algebra & Functions",
        lessons: [
          { title: "Business CSCA syllabus walkthrough", type: "video", durationMinutes: 15, isFreePreview: true },
          { title: "Algebra: equations and systems", type: "video", durationMinutes: 55, isFreePreview: true },
          { title: "Functions, sequences and series", type: "video", durationMinutes: 50 },
          { title: "Week 1 practice quiz", type: "quiz" },
        ],
      },
      {
        weekNumber: 2,
        title: "Statistics & Probability",
        lessons: [
          { title: "Descriptive statistics and data analysis", type: "video", durationMinutes: 55 },
          { title: "Probability distributions", type: "video", durationMinutes: 60 },
          { title: "Live class — statistics problem set", type: "live", durationMinutes: 90 },
        ],
      },
      {
        weekNumber: 3,
        title: "Calculus Foundations",
        lessons: [
          { title: "Limits and introduction to derivatives", type: "video", durationMinutes: 55 },
          { title: "Business applications of calculus", type: "video", durationMinutes: 50 },
          { title: "Live class — calculus in economics", type: "live", durationMinutes: 90 },
        ],
      },
      {
        weekNumber: 4,
        title: "Mandarin Reading & Mock Tests",
        lessons: [
          { title: "Chinese maths terminology guide", type: "resource" },
          { title: "Mandarin reading comprehension drills", type: "video", durationMinutes: 45 },
          { title: "Full mock exam — Business CSCA", type: "quiz" },
          { title: "Mock review live session", type: "live", durationMinutes: 90 },
        ],
      },
    ],
  },

  /* ─────────────────────────────────────────────────────── 4. All Star CSCA */
  {
    slug: "all-star-csca",
    category: "csca",
    code: "ALL",
    name: "All Star CSCA",
    shortName: "All Star CSCA",
    tagline: "Every subject. Maximum flexibility. One powerhouse track.",
    summary:
      "The comprehensive CSCA bundle — Mathematics, Physics and Chemistry — for students keeping all options open or targeting the most competitive programs.",
    description:
      "The All Star CSCA covers all three major CSCA subject streams: Mathematics, Physics and Chemistry. It's designed for high-achievers who want the full range of program options, or who are undecided and don't want to close any doors. Intensive live sessions, dense recorded libraries and a personal academic plan make this our most ambitious — and most rewarding — course.",
    icon: Sparkles,
    accent: "blue",
    subjects: ["Math", "Physics", "Chemistry"],
    divisions: ["live", "recorded"],
    popular: true,
    featured: true,
    fromLabel: "Math + Physics + Chem",
    toLabel: "Any Program, CN",
    gate: "G4",
    level: "Secondary / A-Level equivalent",
    duration: "6 months · 4 sessions / week",
    priceBdt: 18000,
    priceNote: "All three subjects included",
    highlights: [
      "Full syllabus across Mathematics, Physics and Chemistry",
      "Flexible — qualify for Engineering, Medical or Business programs",
      "Intensive live batches with 80+ recorded lessons",
      "Personal academic plan and progress check-ins",
    ],
    outcomes: [
      "Eligibility across Engineering, Medical and Business CSCA tracks",
      "Exam-ready in all three core sciences",
      "Maximum choice of universities and programs in China",
    ],
    modules: [
      {
        title: "Mathematics Deep Dive",
        description: "Calculus, algebra, statistics — every tested topic.",
      },
      {
        title: "Physics Mastery",
        description: "Mechanics, electricity, waves and modern physics.",
      },
      {
        title: "Chemistry Complete",
        description: "Organic, inorganic, physical chemistry and lab theory.",
      },
      {
        title: "Integrated Mock Exams",
        description: "Full-length papers across all subjects under exam conditions.",
      },
    ],
    live: {
      scheduleLabel: "Sun · Tue · Thu · Sat  ·  6:00 PM BST",
      zoomUrl: "https://zoom.us/j/1000000004",
      durationMinutes: 90,
      slots: [
        { day: 0, hour: 18, minute: 0 },
        { day: 2, hour: 18, minute: 0 },
        { day: 4, hour: 18, minute: 0 },
        { day: 6, hour: 18, minute: 0 },
      ],
    },
    recorded: {
      lessons: 80,
      accessLabel: "12-month access",
    },
    instructorSlugs: ["dr-rafiqul-islam", "zhang-ming"],
    enrolledCount: 540,
    rating: 4.9,
    reviewCount: 178,
    curriculum: [
      {
        weekNumber: 1,
        title: "Mathematics Deep Dive — Weeks 1–2",
        lessons: [
          { title: "All Star overview & study plan", type: "video", durationMinutes: 20, isFreePreview: true },
          { title: "Calculus: full derivatives and integrals", type: "video", durationMinutes: 75, isFreePreview: true },
          { title: "Algebra, linear algebra and matrices", type: "video", durationMinutes: 70 },
          { title: "Statistics and probability", type: "video", durationMinutes: 65 },
          { title: "Live — maths problem marathon", type: "live", durationMinutes: 90 },
          { title: "Maths mock quiz 1", type: "quiz" },
        ],
      },
      {
        weekNumber: 2,
        title: "Physics Mastery — Weeks 3–4",
        lessons: [
          { title: "Mechanics: full kinematics and dynamics", type: "video", durationMinutes: 70 },
          { title: "Electricity, magnetism and circuits", type: "video", durationMinutes: 65 },
          { title: "Waves, optics and modern physics", type: "video", durationMinutes: 60 },
          { title: "Live — physics problem marathon", type: "live", durationMinutes: 90 },
        ],
      },
      {
        weekNumber: 3,
        title: "Chemistry Complete — Weeks 5–6",
        lessons: [
          { title: "Inorganic chemistry and periodic table", type: "video", durationMinutes: 65 },
          { title: "Organic chemistry: reactions and mechanisms", type: "video", durationMinutes: 70 },
          { title: "Physical chemistry and equilibria", type: "video", durationMinutes: 60 },
          { title: "Live — chemistry problem marathon", type: "live", durationMinutes: 90 },
          { title: "Full chemistry notes PDF", type: "resource" },
        ],
      },
      {
        weekNumber: 4,
        title: "Integrated Mock Exams — Weeks 7–8",
        lessons: [
          { title: "Full timed mock exam 1 — all subjects", type: "quiz" },
          { title: "Mock 1 review live session", type: "live", durationMinutes: 90 },
          { title: "Full timed mock exam 2 — all subjects", type: "quiz" },
          { title: "Mock 2 review and exam strategy", type: "live", durationMinutes: 90 },
          { title: "Chinese terminology master glossary", type: "resource" },
        ],
      },
    ],
  },

  /* ─────────────────────────────────────────────────────── 5. Chinese HSK */
  {
    slug: "chinese-hsk",
    category: "hsk",
    code: "HSK",
    featured: true,
    name: "Chinese HSK (1–3)",
    shortName: "Chinese HSK",
    tagline: "From 你好 to HSK 3 in six months",
    summary:
      "A structured, beginner-to-intermediate Mandarin course covering HSK 1, 2 and 3 — building real speaking, listening, reading and writing skills alongside exam technique.",
    description:
      "NiHao Academy's Chinese HSK track takes you through the first three levels of China's official proficiency exam in six months. You'll build genuine language skills — not just exam tricks — while our 95% HSK pass rate system prepares you for every listening, reading and writing question. The course runs in small live batches with a complete recorded library for self-study.",
    icon: Languages,
    accent: "gold",
    divisions: ["live", "recorded"],
    fromLabel: "Complete beginner",
    toLabel: "HSK 3 Certified",
    gate: "G5",
    level: "Absolute beginner → HSK 3",
    duration: "6 months · 2 sessions / week",
    priceBdt: 12000,
    highlights: [
      "Full HSK 1, 2 and 3 vocabulary and grammar",
      "Tones, pinyin and 600+ characters from scratch",
      "Weekly timed mock exams in real HSK format",
      "Speaking and listening practice in every live class",
    ],
    outcomes: [
      "Pass HSK 3 and earn an internationally recognised certificate",
      "Hold everyday conversations in Mandarin",
      "A strong foundation for HSK 4–6 or CSCA tracks",
    ],
    modules: [
      {
        title: "Pinyin & HSK 1",
        description: "Tones, pronunciation and the 150 HSK 1 vocabulary words.",
      },
      {
        title: "HSK 2 — Everyday Chinese",
        description: "300 words, grammar patterns and listening comprehension.",
      },
      {
        title: "HSK 3 — Intermediate Leap",
        description: "600 words, reading passages and written responses.",
      },
      {
        title: "Exam Strategy & Mocks",
        description: "Timed full-length HSK 1–3 papers with score analysis.",
      },
    ],
    live: {
      scheduleLabel: "Wed · Sat  ·  7:00 PM BST",
      zoomUrl: "https://zoom.us/j/1000000005",
      durationMinutes: 90,
      slots: [
        { day: 3, hour: 19, minute: 0 },
        { day: 6, hour: 19, minute: 0 },
      ],
    },
    recorded: {
      lessons: 40,
      accessLabel: "12-month access",
    },
    instructorSlugs: ["li-wei"],
    enrolledCount: 680,
    rating: 4.9,
    reviewCount: 215,
    curriculum: [
      {
        weekNumber: 1,
        title: "Pinyin & HSK 1 (Weeks 1–4)",
        lessons: [
          { title: "Tones and pinyin masterclass", type: "video", durationMinutes: 45, isFreePreview: true },
          { title: "HSK 1 vocabulary: 150 words systematic", type: "video", durationMinutes: 60, isFreePreview: true },
          { title: "Greetings, numbers and daily expressions", type: "video", durationMinutes: 50 },
          { title: "Live class — speaking and tones practice", type: "live", durationMinutes: 90 },
          { title: "HSK 1 full mock exam", type: "quiz" },
        ],
      },
      {
        weekNumber: 2,
        title: "HSK 2 — Everyday Chinese (Weeks 5–8)",
        lessons: [
          { title: "HSK 2 vocabulary: 300 words", type: "video", durationMinutes: 65 },
          { title: "Grammar patterns: time, comparison, negation", type: "video", durationMinutes: 60 },
          { title: "Listening comprehension strategies", type: "video", durationMinutes: 50 },
          { title: "Live class — dialogue practice", type: "live", durationMinutes: 90 },
          { title: "HSK 2 full mock exam", type: "quiz" },
        ],
      },
      {
        weekNumber: 3,
        title: "HSK 3 — Intermediate Leap (Weeks 9–14)",
        lessons: [
          { title: "HSK 3 vocabulary: 300 new words (600 total)", type: "video", durationMinutes: 70 },
          { title: "Reading passages and comprehension", type: "video", durationMinutes: 65 },
          { title: "Written responses and character practice", type: "video", durationMinutes: 60 },
          { title: "Live class — reading and writing workshop", type: "live", durationMinutes: 90 },
          { title: "HSK 3 full mock exam 1", type: "quiz" },
        ],
      },
      {
        weekNumber: 4,
        title: "Exam Strategy & Final Prep (Weeks 15–16)",
        lessons: [
          { title: "HSK exam format deep dive", type: "video", durationMinutes: 40 },
          { title: "HSK 3 full mock exam 2 — timed", type: "quiz" },
          { title: "Mock exam review live session", type: "live", durationMinutes: 90 },
          { title: "Vocabulary flashcard pack PDF", type: "resource" },
        ],
      },
    ],
  },

  /* ─────────────────────────────────────────────────────── 6. Professional Chinese */
  {
    slug: "professional-chinese",
    category: "professional",
    code: "PRO",
    name: "Professional Chinese",
    shortName: "Professional Chinese",
    tagline: "Business Mandarin for traders, professionals and teams",
    summary:
      "A practical, self-paced Mandarin course built for businesspeople and traders who need to communicate in Chinese — contracts, negotiation, supply chains and daily commerce.",
    description:
      "Professional Chinese is for the importer, exporter, factory liaison or team manager who needs to communicate in Mandarin without returning to basics. The course fast-tracks business vocabulary, common negotiation phrases, reading Chinese invoices and contracts, and understanding Chinese business culture — all at your own pace in a dense recorded library.",
    icon: Handshake,
    accent: "red",
    divisions: ["recorded"],
    fromLabel: "Basic English",
    toLabel: "Business Mandarin",
    gate: "G6",
    level: "No prior Chinese required",
    duration: "Self-paced · 8 weeks recommended",
    priceBdt: 8000,
    priceNote: "Lifetime access",
    highlights: [
      "500+ business-specific vocabulary words",
      "Negotiation dialogues, order phrases and email templates",
      "Reading Chinese invoices, contracts and labels",
      "Business culture and etiquette for dealing with Chinese partners",
    ],
    outcomes: [
      "Handle day-to-day business communication in Mandarin",
      "Read and draft basic Chinese business documents",
      "Build confidence and trust with Chinese business partners",
    ],
    modules: [
      {
        title: "Business Basics",
        description: "Introductions, numbers, dates and company talk.",
      },
      {
        title: "Trade & Commerce",
        description: "Orders, pricing, shipping and supply-chain vocabulary.",
      },
      {
        title: "Negotiation & Contracts",
        description: "Agreement phrases, contract reading and polite refusals.",
      },
      {
        title: "Culture & Etiquette",
        description: "Meetings, gifts, face and building long-term guanxi.",
      },
    ],
    recorded: {
      lessons: 32,
      accessLabel: "Lifetime access",
    },
    instructorSlugs: ["zhang-ming", "li-wei"],
    enrolledCount: 175,
    rating: 4.7,
    reviewCount: 54,
    curriculum: [
      {
        weekNumber: 1,
        title: "Business Basics (Self-paced)",
        lessons: [
          { title: "Why Professional Chinese? Course overview", type: "video", durationMinutes: 12, isFreePreview: true },
          { title: "Introductions, numbers and company talk", type: "video", durationMinutes: 45, isFreePreview: true },
          { title: "Meeting etiquette and greetings", type: "video", durationMinutes: 40 },
          { title: "Pronunciation essentials for business", type: "video", durationMinutes: 35 },
        ],
      },
      {
        weekNumber: 2,
        title: "Trade & Commerce",
        lessons: [
          { title: "Orders, pricing and shipping vocabulary", type: "video", durationMinutes: 50 },
          { title: "Reading Chinese invoices and labels", type: "video", durationMinutes: 45 },
          { title: "Supply chain and logistics phrases", type: "video", durationMinutes: 45 },
          { title: "Trade vocabulary quiz", type: "quiz" },
        ],
      },
      {
        weekNumber: 3,
        title: "Negotiation & Contracts",
        lessons: [
          { title: "Agreement and price negotiation phrases", type: "video", durationMinutes: 50 },
          { title: "Reading Chinese contracts — key clauses", type: "video", durationMinutes: 55 },
          { title: "Polite refusals and counter-offers", type: "video", durationMinutes: 40 },
          { title: "Contract vocabulary PDF", type: "resource" },
        ],
      },
      {
        weekNumber: 4,
        title: "Culture, Etiquette & Final Review",
        lessons: [
          { title: "Mianzi, guanxi and business culture", type: "video", durationMinutes: 45 },
          { title: "Gift-giving, dinners and relationship building", type: "video", durationMinutes: 40 },
          { title: "Final vocabulary and phrase review quiz", type: "quiz" },
          { title: "Business Chinese phrase book PDF", type: "resource" },
        ],
      },
    ],
  },

  /* ─────────────────────────────────────────────────────── 7. DET Crash Course */
  {
    slug: "det-crash-course",
    category: "det",
    code: "DET",
    featured: true,
    name: "DET Crash Course",
    shortName: "DET Crash Course",
    tagline: "Hit your Duolingo English Test score in 4 weeks",
    summary:
      "A laser-focused, self-paced crash course for the Duolingo English Test — every question type, full practice tests and writing & speaking feedback so you reach your target score fast.",
    description:
      "The Duolingo English Test is now accepted by thousands of universities worldwide and it's faster and cheaper than IELTS. Our DET Crash Course is a dense, self-paced recorded library covering every question type the adaptive test throws at you — Read Aloud, Listen and Type, Complete the Sentence, Interactive Reading, and the Writing and Speaking samples. Go from registered to ready in four weeks.",
    icon: Captions,
    accent: "gold",
    divisions: ["recorded"],
    fromLabel: "Registered for DET",
    toLabel: "Target score",
    gate: "G7",
    level: "Targeting 100–135+",
    duration: "Self-paced · 4 weeks recommended",
    priceBdt: 6000,
    priceNote: "Lifetime access",
    highlights: [
      "Drills for every DET adaptive question type",
      "Full-length scored practice tests",
      "Writing sample frameworks and speaking guides",
      "Test-day strategy and time management",
    ],
    outcomes: [
      "Confident with the DET's unique adaptive format",
      "Polished writing and speaking sample technique",
      "The score your target universities require",
    ],
    modules: [
      {
        title: "Format & Strategy",
        description: "How the adaptive DET works and how to approach each section.",
      },
      {
        title: "Reading & Listening",
        description: "Rapid pattern drills for every reading and listening type.",
      },
      {
        title: "Writing Workshop",
        description: "Frameworks and scored feedback for the written responses.",
      },
      {
        title: "Speaking & Full Mocks",
        description: "Speaking sample guides plus three full scored practice tests.",
      },
    ],
    recorded: {
      lessons: 24,
      accessLabel: "Lifetime access",
    },
    instructorSlugs: ["nadia-chen"],
    enrolledCount: 290,
    rating: 4.9,
    reviewCount: 98,
    curriculum: [
      {
        weekNumber: 1,
        title: "DET Format & Strategy",
        lessons: [
          { title: "How the DET adaptive test works", type: "video", durationMinutes: 20, isFreePreview: true },
          { title: "Section breakdown and scoring explained", type: "video", durationMinutes: 25, isFreePreview: true },
          { title: "Test-day strategy and time management", type: "video", durationMinutes: 20 },
          { title: "Strategy quiz", type: "quiz" },
        ],
      },
      {
        weekNumber: 2,
        title: "Reading & Listening Drills",
        lessons: [
          { title: "Read Aloud — speed and accuracy drills", type: "video", durationMinutes: 35 },
          { title: "Listen and Type — transcription practice", type: "video", durationMinutes: 40 },
          { title: "Complete the Sentence patterns", type: "video", durationMinutes: 35 },
          { title: "Reading & listening mock drill", type: "quiz" },
        ],
      },
      {
        weekNumber: 3,
        title: "Writing Workshop",
        lessons: [
          { title: "Writing sample frameworks — task types", type: "video", durationMinutes: 40 },
          { title: "Opinion essays: structure and scoring", type: "video", durationMinutes: 45 },
          { title: "Common mistakes and how to avoid them", type: "video", durationMinutes: 30 },
          { title: "Writing templates PDF", type: "resource" },
        ],
      },
      {
        weekNumber: 4,
        title: "Speaking & Full Mock Tests",
        lessons: [
          { title: "Speaking sample: how to maximise your score", type: "video", durationMinutes: 35 },
          { title: "Full DET mock test 1 — all sections", type: "quiz" },
          { title: "Mock 1 review and scoring analysis", type: "video", durationMinutes: 30 },
          { title: "Full DET mock test 2 — final practice", type: "quiz" },
        ],
      },
    ],
  },
];

/* ─────────────────────────────────────────────────────── helpers */

export function getCourse(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

export function formatBdt(amount: number): string {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);
}

export interface NextSession {
  start: Date;
  end: Date;
  isLive: boolean;
}

/**
 * Compute the soonest upcoming (or currently running) live session from a
 * course's weekly slots. Returns null if none found in the next two weeks.
 * Call this on the client to avoid SSR/CSR time mismatches.
 */
export function getNextLiveSession(
  live: LiveClass,
  now: Date = new Date()
): NextSession | null {
  let best: NextSession | null = null;

  for (let ahead = 0; ahead < 14; ahead++) {
    const day = new Date(now);
    day.setDate(now.getDate() + ahead);

    for (const slot of live.slots) {
      if (slot.day !== day.getDay()) continue;

      const start = new Date(day);
      start.setHours(slot.hour, slot.minute, 0, 0);
      const end = new Date(start.getTime() + live.durationMinutes * 60_000);

      if (end.getTime() < now.getTime()) continue; // already finished

      if (!best || start.getTime() < best.start.getTime()) {
        best = { start, end, isLive: now >= start && now <= end };
      }
    }
  }

  return best;
}
