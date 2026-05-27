import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Next.js 16 Proxy — runs on every request.
 * Responsibilities:
 *  1. Refresh the Supabase session cookie (keep auth alive).
 *  2. Redirect unauthenticated users away from protected routes.
 *  3. Redirect already-authenticated users away from auth pages.
 */
export default async function proxy(request: NextRequest) {
  // Skip all auth logic if Supabase credentials are not configured yet.
  // This allows public pages to render during local development without .env.local.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  try {
    // Build a lightweight Supabase client that only reads/writes cookies.
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            // Apply cookies to both the request (for downstream reads) and response.
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // IMPORTANT: getUser() refreshes the session token if it's expired.
    // Do NOT use getSession() here — it doesn't validate the JWT with the server.
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const path = request.nextUrl.pathname;

    // ── Protected routes ────────────────────────────────────────────────────
    const isStudentRoute = path.startsWith("/student");
    const isAdminRoute = path.startsWith("/admin");

    if ((isStudentRoute || isAdminRoute) && !user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", path);
      return NextResponse.redirect(loginUrl);
    }

    // Admin-only check: role is stored in app_metadata (set server-side).
    // If a non-admin student hits /admin, redirect to student dashboard.
    if (isAdminRoute && user) {
      const role = user.app_metadata?.role as string | undefined;
      if (role !== "admin") {
        return NextResponse.redirect(new URL("/student/dashboard", request.url));
      }
    }

    // ── Auth pages redirect when already logged in ──────────────────────────
    const isAuthPage = path === "/login" || path === "/verify";
    if (isAuthPage && user) {
      const role = user.app_metadata?.role as string | undefined;
      const dest =
        role === "admin" ? "/admin/dashboard" : "/student/dashboard";
      return NextResponse.redirect(new URL(dest, request.url));
    }
  } catch (error) {
    console.error("🔒 Proxy Security Middleware Exception:", error);
    // Proceed to target route on proxy failure to prevent a hard 503 server crash
    return NextResponse.next({ request });
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     *  - _next/static  (static files)
     *  - _next/image   (image optimisation)
     *  - favicon.ico
     *  - public assets with image extensions
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
