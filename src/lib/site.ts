import type { FaqItem, NavItem, Stat, Testimonial } from "@/types";

export const siteConfig = {
  name: "NiHao Academy",
  nameZh: "你好学院",
  description:
    "CSCA admission prep, HSK, Professional Chinese and DET preparation for Bangladeshi students.",
  url: "https://nihaoacademy.com",
  contact: {
    phone: "+880 1700-000000",
    phoneHref: "tel:+8801700000000",
    whatsapp: "+880 1700-000000",
    whatsappHref: "https://wa.me/8801700000000",
    email: "hello@nihaoacademy.com",
    emailHref: "mailto:hello@nihaoacademy.com",
    address: "House 12, Road 7, Dhanmondi, Dhaka 1205, Bangladesh",
  },
} as const;

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Mock Tests", href: "/mock-tests" },
  { label: "Instructors", href: "/instructors" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const destinations: string[] = [
  "Tsinghua University",
  "Peking University",
  "Zhejiang University",
  "Fudan University",
  "Shanghai Jiao Tong",
  "Wuhan University",
  "HUST · Wuhan",
  "CSC Scholarship",
  "Beijing",
  "Shanghai",
  "Hangzhou",
  "Nanjing",
  "HSK Certified",
  "DET 125+",
  "Chengdu",
  "Xi'an",
];

export const stats: Stat[] = [
  { value: "2,400+", label: "Students taught" },
  { value: "95%", label: "HSK pass rate" },
  { value: "60+", label: "Scholarships secured" },
  { value: "12", label: "Expert instructors" },
];

export const testimonials: Testimonial[] = [
  {
    name: "Tahmina Akter",
    role: "HSK 3 · Now studying at Zhejiang University",
    initials: "TA",
    quote:
      "I started from zero Chinese. The structured HSK track and weekly mock tests got me to HSK 3 in six months — and a full CSC scholarship followed.",
    accent: "blue",
  },
  {
    name: "Rifat Hossain",
    role: "DET Crash Course · Score 125",
    initials: "RH",
    quote:
      "The recorded lessons were incredibly focused. Every question type covered, every strategy explained. Scored 125 on my first attempt.",
    accent: "gold",
  },
  {
    name: "Nusrat Jahan",
    role: "All Star CSCA · Accepted to MBBS at HUST",
    initials: "NJ",
    quote:
      "The All Star track covered everything — Maths, Physics, Chemistry. The live classes and recorded library together meant I never had to guess what to study.",
    accent: "red",
  },
];

export const faqs: FaqItem[] = [
  {
    question: "Do I need any prior knowledge to start a CSCA course?",
    answer:
      "No. Our CSCA tracks are built for students at secondary or A-Level stage. We assume you know high-school maths and sciences, and we build the exam technique and bilingual terminology from there.",
  },
  {
    question: "What is the difference between the Live and Recorded divisions?",
    answer:
      "Live classes run on a fixed weekly schedule via Zoom — you join in real time, ask questions and practice with classmates. Recorded courses are a self-paced video library you can watch any time; they're ideal if you have a busy schedule or just want to move at your own pace.",
  },
  {
    question: "Can I access the recorded lessons if I'm enrolled in a Live course?",
    answer:
      "Yes — every Live division enrollment also unlocks the full recorded library for that course. You get the best of both: live instruction and the ability to re-watch every lesson whenever you need.",
  },
  {
    question: "How do payments work?",
    answer:
      "You can pay securely with bKash, Nagad or any card through our checkout. Installment options are available for the longer CSCA tracks.",
  },
  {
    question: "Do you help with scholarship and university applications?",
    answer:
      "Our CSCA courses include exam preparation only. For personalised university shortlisting, application support and scholarship guidance, reach out to our advisors directly via WhatsApp — we're happy to help.",
  },
  {
    question: "What happens after I enroll?",
    answer:
      "You'll receive a confirmation SMS and email, get added to your batch, and unlock your student dashboard with the schedule, recorded lessons and announcements — usually within 24 hours.",
  },
];
