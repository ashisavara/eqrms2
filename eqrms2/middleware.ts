/**
 * SUBDOMAIN ROUTING + OTP AUTHENTICATION + AFFILIATE COOKIE CAPTURE
 *
 * - Routes requests based on subdomain:
 *    • rms.imecapital.in → serves /(rms) routes (authenticated)
 *    • public.imecapital.in → serves /(public) routes (mostly public)
 *    • imecapital.in → NOT HANDLED (continues to WordPress)
 * - Captures rf + UTM params site-wide and stores them in an httpOnly cookie for 30 days (last-click)
 * - Enforces OTP-only auth with subdomain-aware redirects.
 * - Cross-subdomain session persistence via .imecapital.in cookies.
 *  - some text 
 */

import { updateSession } from "@/lib/supabase/middleware";
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

// ===== Affiliate capture config =====
const AFF_COOKIE = "aff_rf";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

// ===== Subdomain detection =====
type Subdomain = 'rms' | 'public' | 'root' | null;

function getSubdomain(host: string): Subdomain {
  // Localhost or non-production
  if (!host.includes('.imecapital.in') && host !== 'imecapital.in') return null;
  
  // Root domain - NOT HANDLED by Next.js (continues to WordPress)
  if (host === 'imecapital.in') return 'root';
  
  // Subdomains
  if (host.startsWith('rms.')) return 'rms';
  if (host.startsWith('public.')) return 'public';
  
  return null;
}

// ===== Route group detection =====
type RouteGroup = 'rms' | 'public' | 'canvas' | 'api' | 'static';

function getRouteGroup(pathname: string): RouteGroup {
  // Static assets and Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico)$/)
  ) {
    return 'static';
  }

  // API routes
  if (pathname.startsWith('/api/')) return 'api';

  // Auth/canvas routes
  if (pathname.startsWith('/auth/')) return 'canvas';

  // Known RMS routes
  const rmsRoutes = [
    '/investments', '/mandate', '/funds', '/companies', '/categories',
    '/amc', '/assetclass', '/sectors', '/structure', '/crm',
    '/tickets', '/internal', '/uservalidation', '/survey', '/protected'
  ];
  
  if (rmsRoutes.some(r => pathname === r || pathname.startsWith(r + '/'))) {
    return 'rms';
  }

  // Everything else is public (blogs, homepage, etc.)
  return 'public';
}

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
  const host = request.headers.get("host") || "";

  // Build affiliate cookie payload UP FRONT so we can attach it on any return branch
  const affPayload = buildAffiliateCookiePayload(request);

  // ===== PHASE 1: Subdomain Detection =====
  const subdomain = getSubdomain(host);
  const routeGroup = getRouteGroup(pathname);

  // Root domain (imecapital.in) - NOT HANDLED, pass through to WordPress
  if (subdomain === 'root') {
    const res = NextResponse.next();
    return applyAffCookie(request, res, affPayload);
  }

  // ===== PHASE 2: Static Assets (always allowed) =====
  if (routeGroup === 'static') {
    const res = NextResponse.next();
    return applyAffCookie(request, res, affPayload);
  }

  // ===== PHASE 3: Subdomain Routing (Production only) =====
  if (subdomain) {
    // RMS routes on public subdomain -> redirect to RMS subdomain
    if (subdomain === 'public' && routeGroup === 'rms') {
      const url = request.nextUrl.clone();
      url.host = host.replace('public.', 'rms.');
      const res = NextResponse.redirect(url);
      return applyAffCookie(request, res, affPayload);
    }

    // Public routes on RMS subdomain -> will be handled by auth check below
    // (RMS requires auth for everything, so they'll be redirected to login)
  }

  // ===== PHASE 4: Old Auth Route Redirects =====
  const oldAuthRoutes = [
    "/auth/login",
    "/auth/sign-up",
    "/auth/forgot-password",
    "/auth/update-password",
    "/auth/sign-up-success",
    "/auth/error",
  ];

  const isOldAuthRoute = oldAuthRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (isOldAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/otp-login";
    const res = NextResponse.redirect(url);
    return applyAffCookie(request, res, affPayload);
  }

  // ===== PHASE 5: Authentication =====

  // Define private routes that require authentication
  const privateRoutes = [
    // All RMS routes
    '/investments', '/mandate', '/funds', '/companies', '/categories',
    '/amc', '/assetclass', '/sectors', '/structure', '/crm',
    '/tickets', '/internal', '/uservalidation', '/survey', '/protected',
    // Specific public routes that need auth
    '/blogs/edit'
  ];

  // Determine if this route requires authentication
  const requiresAuth = privateRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  // If not requiring auth, just pass through and apply affiliate cookie
  if (!requiresAuth) {
    const res = NextResponse.next();
    return applyAffCookie(request, res, affPayload);
  }

  // If requiring auth, check Supabase session
  if (requiresAuth) {
    let supabaseResponse = NextResponse.next({ request });
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            
            // Determine cookie domain for cross-subdomain persistence
            const host = request.headers.get("host") || "";
            const onProdDomain = host.endsWith(".imecapital.in") || host === "imecapital.in";
            const cookieDomain = onProdDomain ? ".imecapital.in" : undefined;
            
            // Update response with cross-subdomain cookies
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) => {
              supabaseResponse.cookies.set(name, value, {
                ...options,
                domain: cookieDomain,
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
                path: "/",
              });
            });
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    // Unauthenticated -> redirect to OTP login on same subdomain
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/otp-login";
      // Store original URL for post-login redirect
      url.searchParams.set('redirectTo', pathname);
      const res = NextResponse.redirect(url);
      return applyAffCookie(request, res, affPayload);
    }

    // Authenticated and on root path of RMS -> redirect to /investments
    // this is required since there is no landing page for rms.imecapital.in
    if (user && pathname === "/" && (subdomain === 'rms' || routeGroup === 'rms')) {
      const url = request.nextUrl.clone();
      url.pathname = "/investments";
      const res = NextResponse.redirect(url);
      return applyAffCookie(request, res, affPayload);
    }

    // ===== PHASE 6: Maintain Session & Return =====
    return applyAffCookie(request, supabaseResponse, affPayload);
  }

  // ===== PHASE 6: Maintain Session & Return =====
  const res = await updateSession(request);
  return applyAffCookie(request, res, affPayload);
}

export const config = {
  matcher: [
    // Match everything except Next.js internals & common static assets
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
