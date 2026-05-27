import type { FaqItem, NavItem, Stat, Testimonial } from "@/types";

export const siteConfig = {
  name: "NiHao Academy",
  nameZh: "你好学院",
  description:
    "Chinese language, HSK, DET and study-abroad preparation for Bangladeshi students.",
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
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
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
    role: "HSK 5 · Now studying at Zhejiang University",
    initials: "TA",
    quote:
      "I started from zero Chinese. The structured HSK track and weekly mock tests got me to HSK 5 in a year — and a full CSC scholarship.",
    accent: "blue",
  },
  {
    name: "Rifat Hossain",
    role: "Duolingo English Test · 125",
    initials: "RH",
    quote:
      "The DET prep was incredibly focused. The practice questions felt exactly like the real test. Scored 125 on my first attempt.",
    accent: "gold",
  },
  {
    name: "Nusrat Jahan",
    role: "Foundation Program · Studying in Beijing",
    initials: "NJ",
    quote:
      "From document prep to the visa checklist, NiHao Academy handled everything. I never felt lost in the study-abroad process.",
    accent: "red",
  },
];

export const faqs: FaqItem[] = [
  {
    question: "Do I need any prior Chinese knowledge to start?",
    answer:
      "Not at all. Our CSCA and HSK 1 tracks are designed for complete beginners. We start from pinyin and tones and build up systematically.",
  },
  {
    question: "Are classes online or in person?",
    answer:
      "Both. Every course runs as live online batches and selected in-person batches at our Dhaka campus. Recorded lessons are available in your student library either way.",
  },
  {
    question: "How do payments work?",
    answer:
      "You can pay securely with bKash, Nagad, or any card through our checkout. Installment options are available for the Foundation and long HSK tracks.",
  },
  {
    question: "Do you help with scholarships and visas?",
    answer:
      "Yes. Our Foundation Program includes university selection, application and document support, scholarship guidance, and a full visa checklist with one-on-one help.",
  },
  {
    question: "What happens after I enroll?",
    answer:
      "You'll receive an SMS and email confirmation, get added to your batch, and unlock your student dashboard with the schedule, lessons, and announcements.",
  },
];
