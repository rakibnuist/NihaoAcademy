import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nihaoacademy.com"),
  title: {
    default: "NiHao Academy — Chinese, HSK, DET & Study-Abroad Prep",
    template: "%s · NiHao Academy",
  },
  description:
    "Bangladesh's dedicated academy for Chinese language (CSCA, HSK), the Duolingo English Test, and university foundation & study-abroad programs. Learn from expert instructors, online and in person.",
  keywords: [
    "HSK",
    "Chinese language",
    "CSCA",
    "Duolingo English Test",
    "DET",
    "study abroad",
    "study in China",
    "Bangladesh",
    "NiHao Academy",
  ],
  openGraph: {
    type: "website",
    title: "NiHao Academy",
    description:
      "Chinese language, HSK, DET and study-abroad preparation for Bangladeshi students.",
    siteName: "NiHao Academy",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "NiHao Academy",
    description:
      "Chinese language, HSK, DET and study-abroad preparation for Bangladeshi students.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} scroll-smooth antialiased`}
    >
      <body className="flex min-h-dvh flex-col">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
