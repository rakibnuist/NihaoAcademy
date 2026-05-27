import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side auth guard — redirect non-admins immediately.
  const user = await getUser();

  if (!user) {
    redirect("/login?next=/admin/dashboard");  // URL is now /admin/dashboard ✓
  }

  const role = user.app_metadata?.role as string | undefined;
  if (role !== "admin") {
    redirect("/student/dashboard");
  }

  return (
    <div className="flex min-h-dvh">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-secondary/20 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
