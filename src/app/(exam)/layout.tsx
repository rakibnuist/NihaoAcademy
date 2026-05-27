import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";

/**
 * Exam layout group — auth-gated but no chrome (no header/nav).
 * Full-screen exam UI renders directly.
 */
export default async function ExamGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (!user) redirect("/login?next=/student/dashboard");

  return <>{children}</>;
}
