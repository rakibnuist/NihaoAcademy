import type { Metadata } from "next";
export const metadata: Metadata = { title: "Complete your profile · NiHao Academy" };

export default function SetupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-secondary/30">
      {children}
    </div>
  );
}
