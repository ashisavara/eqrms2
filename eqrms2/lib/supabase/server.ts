import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";

/**
 * Determine the cookie domain for cross-subdomain session persistence.
 * Must match the middleware's domain logic to prevent duplicate cookies
 * with different domain scopes (which causes intermittent auth failures).
 */
function getCookieDomain(host: string): string | undefined {
  const onProdDomain = host.endsWith(".imecapital.in") || host === "imecapital.in";
  return onProdDomain ? ".imecapital.in" : undefined;
}

export async function createClient() {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const host = headerStore.get("host") || "";
  const cookieDomain = getCookieDomain(host);

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, {
                ...options,
                ...(cookieDomain ? { domain: cookieDomain } : {}),
              });
            });
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
}
