import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database, Student } from "@/types/database";

/**
 * Server-side Supabase client.
 * Use in Server Components, Server Actions, and API Route Handlers.
 *
 * Pass serviceRole = true only in trusted API routes that need to bypass RLS.
 */
export async function createClient(serviceRole = false) {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRole
      ? process.env.SUPABASE_SERVICE_ROLE_KEY!
      : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll is called from the proxy / server context;
            // safe to ignore in read-only Server Component renders.
          }
        },
      },
    }
  );
}

/**
 * Get the currently authenticated user.
 * Returns null when not logged in.
 */
export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Get the full student profile for the authenticated user.
 * Returns null when not logged in or profile not found.
 */
export async function getProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("students")
    .select("*")
    .eq("id", user.id)
    .single();

  return data as Student | null;
}
