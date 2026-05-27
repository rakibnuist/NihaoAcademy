import { redirect } from "next/navigation";
import { getUser, getProfile } from "@/lib/supabase/server";
import { StudentHeader } from "@/components/student/student-header";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (!user) redirect("/login?next=/student/dashboard");

  const profile = await getProfile();
  const name    = profile?.full_name ?? user.phone ?? "Student";

  return (
    <div className="flex min-h-dvh flex-col">
      <StudentHeader name={name} />
      <main className="flex-1 bg-secondary/20">{children}</main>
    </div>
  );
}
