import type { InstructorProfile } from "@/types";

export const instructors: InstructorProfile[] = [
  {
    slug: "li-wei",
    name: "Li Wei",
    nameZh: "李威",
    initials: "LW",
    title: "Head of Chinese Language · HSK Specialist",
    bio: "Li Wei is a native Mandarin speaker from Beijing with a Master's in Applied Linguistics from Peking University. She has taught Mandarin to over 1,200 Bangladeshi students and holds an HSK Teaching Certificate from Hanban. Her structured approach — tones first, vocabulary patterns second, exam strategy third — has driven NiHao Academy's 95% HSK pass rate.",
    accent: "gold",
    courseSlugs: ["chinese-hsk", "professional-chinese"],
    studentCount: 1200,
    rating: 4.9,
    credentials: [
      "M.A. Applied Linguistics · Peking University",
      "Hanban Certified HSK Instructor",
      "8 years teaching Mandarin as a Foreign Language",
      "Co-author of the NiHao HSK Vocabulary Workbook",
    ],
    subjects: ["Mandarin Chinese", "HSK 1–6", "Business Chinese"],
  },
  {
    slug: "dr-rafiqul-islam",
    name: "Dr. Rafiqul Islam",
    nameZh: undefined,
    initials: "RI",
    title: "CSCA Mathematics & Physics · Lead Instructor",
    bio: "Dr. Rafiqul holds a PhD in Applied Mathematics from BUET and spent three years as a visiting lecturer at Wuhan University. He has coached 600+ students through the CSCA Engineering and Medical tracks, with a focus on bilingual problem-solving — teaching in English while using the exact Chinese mathematical terminology that appears in the exam.",
    accent: "blue",
    courseSlugs: ["engineering-csca", "medical-csca", "all-star-csca"],
    studentCount: 650,
    rating: 4.8,
    credentials: [
      "PhD Applied Mathematics · BUET",
      "Visiting Lecturer · Wuhan University (2019–2022)",
      "CSCA Examiner & Curriculum Advisor",
      "10 years university-level Mathematics teaching",
    ],
    subjects: ["Mathematics", "Physics", "CSCA Exam Strategy"],
  },
  {
    slug: "nadia-chen",
    name: "Nadia Chen",
    nameZh: "陈娜迪亚",
    initials: "NC",
    title: "DET & English Communication Specialist",
    bio: "Nadia holds a CELTA from Cambridge and a B.Sc. in English from Dhaka University. She scored 145 on the Duolingo English Test herself — then spent two years reverse-engineering every question type to build NiHao's DET Crash Course. Her students' average score improvement is 18 points within four weeks.",
    accent: "red",
    courseSlugs: ["det-crash-course"],
    studentCount: 380,
    rating: 4.9,
    credentials: [
      "CELTA · Cambridge Assessment English",
      "B.Sc. English · University of Dhaka",
      "DET Score: 145 / 160",
      "Certified IELTS & Duolingo English Test trainer",
    ],
    subjects: ["Duolingo English Test", "Academic Writing", "IELTS"],
  },
  {
    slug: "zhang-ming",
    name: "Zhang Ming",
    nameZh: "张明",
    initials: "ZM",
    title: "Business Chinese · CSCA Chemistry",
    bio: "Zhang Ming grew up in Chengdu and completed his MBA at Shanghai Jiao Tong University before relocating to Dhaka to work in Sino-Bangladeshi trade. He teaches Professional Chinese to business professionals using real contracts, negotiation dialogues and supply-chain scenarios from his own trading experience — making the language immediately practical.",
    accent: "gold",
    courseSlugs: ["professional-chinese", "business-csca", "all-star-csca"],
    studentCount: 290,
    rating: 4.7,
    credentials: [
      "MBA · Shanghai Jiao Tong University",
      "HSK 6 Certified",
      "12 years Sino-BD trade & business development",
      "Interpreter for BD-China trade delegations",
    ],
    subjects: ["Business Mandarin", "CSCA Chemistry", "Trade Chinese"],
  },
];

export function getInstructor(slug: string): InstructorProfile | undefined {
  return instructors.find((i) => i.slug === slug);
}

export function getInstructorsForCourse(courseSlug: string): InstructorProfile[] {
  return instructors.filter((i) => i.courseSlugs.includes(courseSlug));
}
