import { SiteHeader }   from "@/components/public/site-header";
import { SiteFooter }   from "@/components/public/site-footer";
import { WhatsAppFab }  from "@/components/public/whatsapp-fab";
import { createClient } from "@/lib/supabase/server";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Resolve auth state once on the server so the header reflects reality.
  // (A logged-in user must NOT keep seeing "Log in / Enroll now".)
  let signedIn = false;
  let dashboardHref = "/student/dashboard";

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      signedIn = true;
      const role = user.app_metadata?.role as string | undefined;
      dashboardHref = role === "admin" ? "/admin/dashboard" : "/student/dashboard";
    }
  } catch {
    // Supabase not configured (local dev without env) — treat as logged out.
  }

  return (
    <>
      <SiteHeader signedIn={signedIn} dashboardHref={dashboardHref} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <WhatsAppFab />
    </>
  );
}
