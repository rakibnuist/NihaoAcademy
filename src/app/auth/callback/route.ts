import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

/**
 * Supabase auth callback — handles magic link and email OTP redirects.
 *
 * Supabase appends ?code=<pkce_code>&next=<path> to the redirect URL.
 * We exchange the code for a session, then redirect to `next`.
 * If `next` isn't set we auto-detect based on user role.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (code) {
    const cookieStore = await cookies();

    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Determine destination
      let destination = next ?? "/student/dashboard";

      // If no explicit `next`, check role and route appropriately
      if (!next) {
        const role = data.user?.app_metadata?.role as string | undefined;
        if (role === "admin") destination = "/admin/dashboard";
      }

      return NextResponse.redirect(new URL(destination, origin));
    }

    console.error("[auth/callback] exchangeCodeForSession error:", error.message);
  }

  // No code or exchange failed — back to login with error hint
  return NextResponse.redirect(
    new URL("/login?error=auth_callback_failed", origin)
  );
}
