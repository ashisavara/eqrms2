/**
 * OTP-ONLY AUTHENTICATION MIDDLEWARE + AFFILIATE COOKIE CAPTURE
 *
 * - Captures rf + UTM params site-wide and stores them in an httpOnly cookie for 30 days (last-click)
 * - Enforces OTP-only auth:
 *    • Redirects unauthenticated users to /auth/otp-login
 *    • Redirects old email/password routes to /auth/otp-login
 *    • Allows public access to static assets and OTP routes
 *    • Post-login redirects / -> /investments
 */

import { updateSession } from "@/lib/supabase/middleware";
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

// ===== Affiliate capture config =====
const AFF_COOKIE = "aff_rf";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

/** Parse rf + utm_* from URL and build cookie payload string, or return null if no valid rf */
function buildAffiliateCookiePayload(req: NextRequest): string | null {
  const url = req.nextUrl;
  const rfRaw = url.searchParams.get("rf")?.trim();
  if (!rfRaw) return null;

  // Only accept a clean integer (raw lead_id as string)
  const rfInt = Number.parseInt(rfRaw, 10);
  if (!Number.isFinite(rfInt) || String(rfInt) !== rfRaw) return null;

  const utm: Record<string, string> = {};
  for (const k of UTM_KEYS) {
    const v = url.searchParams.get(k);
    if (v) utm[k] = v;
  }
  return JSON.stringify({ rf: rfRaw, ...utm });
}

/** Attach affiliate cookie to a response if payload exists */
function applyAffCookie(req: NextRequest, res: NextResponse, payload: string | null) {
  if (!payload) return res;

  const host = req.headers.get("host") || "";
  const onProdDomain = host.endsWith(".imecapital.in") || host === "imecapital.in";
  const cookieDomain = onProdDomain ? ".imecapital.in" : undefined;

  res.cookies.set(AFF_COOKIE, payload, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    domain: cookieDomain,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return res;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Build affiliate cookie payload UP FRONT so we can attach it on any return branch
  const affPayload = buildAffiliateCookiePayload(request);

  // ----- Public/old routes config -----
  const publicRoutes = [
    "/auth/otp-login",
    "/api/send-otp",
    "/api/verify-otp",
  ];

  const oldAuthRoutes = [
    "/auth/login",
    "/auth/sign-up",
    "/auth/forgot-password",
    "/auth/update-password",
    "/auth/sign-up-success",
    "/auth/error",
  ];

  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  const isOldAuthRoute = oldAuthRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // ----- Allow static assets and Next.js internals -----
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico)$/)
  ) {
    const res = NextResponse.next();
    return applyAffCookie(request, res, affPayload);
  }

  // ----- Redirect old auth routes to OTP login -----
  if (isOldAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/otp-login";
    const res = NextResponse.redirect(url);
    return applyAffCookie(request, res, affPayload);
  }

  // ----- Allow public routes (no auth needed) -----
  if (isPublicRoute) {
    const res = NextResponse.next();
    return applyAffCookie(request, res, affPayload);
  }

  // ----- Protected routes: check Supabase session -----
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(_cookiesToSet) {
          // Intentionally no-op here (we set our own affiliate cookie via applyAffCookie)
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Unauthenticated -> redirect to OTP login
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/otp-login";
    const res = NextResponse.redirect(url);
    return applyAffCookie(request, res, affPayload);
  }

  // Authenticated and on root -> redirect to /investments
  if (user && pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/investments";
    const res = NextResponse.redirect(url);
    return applyAffCookie(request, res, affPayload);
  }

  // Authenticated on other routes -> maintain session
  const res = await updateSession(request);
  return applyAffCookie(request, res, affPayload);
}

export const config = {
  matcher: [
    // Match everything except Next.js internals & common static assets
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
