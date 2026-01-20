/**
 * SUBDOMAIN ROUTING + OTP AUTHENTICATION + AFFILIATE COOKIE CAPTURE
 *
 * - Routes requests based on subdomain:
 *    • rms.imecapital.in → serves /(rms) routes (authenticated)
 *    • imecapital.in (root) → serves /(public) routes (public website)
 *    • public.imecapital.in → redirects to imecapital.in (legacy staging)
 * - Captures rf + UTM params site-wide and stores them in an httpOnly cookie for 30 days (last-click)
 * - Enforces OTP-only auth with subdomain-aware redirects.
 * - Cross-subdomain session persistence via .imecapital.in cookies.
 */

import { updateSession } from "@/lib/supabase/middleware";
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

// ===== Affiliate capture config =====
const AFF_COOKIE = "aff_rf";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

// ===== Domain and Subdomain detection =====
type DomainInfo = {
  domain: 'imecapital' | 'imepms' | null;
  subdomain: 'root' | 'rms' | 'public' | null;
};

function getDomainInfo(host: string): DomainInfo {
  // Localhost - allow access to all routes (no domain restrictions)
  if (host.startsWith('localhost') || host.startsWith('127.0.0.1')) {
    return { domain: null, subdomain: null };
  }
  
  // Production - imecapital.in domain family
  if (host === 'imecapital.in') {
    return { domain: 'imecapital', subdomain: 'root' };
  }
  if (host === 'rms.imecapital.in' || host.startsWith('rms.imecapital.in')) {
    return { domain: 'imecapital', subdomain: 'rms' };
  }
  if (host === 'public.imecapital.in' || host.startsWith('public.imecapital.in')) {
    return { domain: 'imecapital', subdomain: 'public' };
  }
  
  // Production - imepms.in domain family
  if (host === 'imepms.in' || host === 'www.imepms.in') {
    return { domain: 'imepms', subdomain: 'root' };
  }
  
  // Unknown host - treat as localhost
  return { domain: null, subdomain: null };
}

// ===== Route group detection =====
type RouteGroup = 'rms' | 'public' | 'canvas' | 'static';

function getRouteGroup(pathname: string): RouteGroup {
  // PWA files (manifest, service worker) - must be served on all subdomains
  if (
    pathname === '/manifest.json' ||
    pathname === '/sw.js'
  ) {
    return 'static';
  }

  // Static assets and Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico|json)$/)
  ) {
    return 'static';
  }

  // Auth/canvas routes
  if (pathname.startsWith('/auth/')) return 'canvas';

  // Known RMS routes
  const rmsRoutes = [
    '/investments', '/mandate', '/funds', '/companies', '/categories',
    '/amc', '/assetclass', '/sectors', '/structure', '/crm',
    '/tickets', '/internal', '/uservalidation', '/survey', '/protected', '/app', '/ime-view', '/shortlist', '/academy'
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

/** 
 * Attach affiliate cookie to a response if payload exists 
 * Note: Currently, imepms.in shares cookies with imecapital.in domains
 * (no domain restriction for imepms.in at this time) .. however since cookies are domain specific they will not work on imepms.in
 */
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

  // ===== PHASE 1: Domain Detection =====
  const domainInfo = getDomainInfo(host);
  const routeGroup = getRouteGroup(pathname);

  // ===== PHASE 1.5: imepms.in Domain Rewrite =====
  // Rewrite imepms.in requests to /imepms path (transparent to user)
  // Note: imepms.in currently shares affiliate cookies with imecapital.in
  if (domainInfo.domain === 'imepms') {
    // Don't rewrite if already on /imepms path or static assets
    if (!pathname.startsWith('/imepms') && routeGroup !== 'static' && !pathname.startsWith('/api/')) {
      const url = request.nextUrl.clone();
      url.pathname = `/imepms${pathname}`;
      const res = NextResponse.rewrite(url);
      return applyAffCookie(request, res, affPayload);
    }
  }

  // ===== PHASE 1.6: Legacy Public Subdomain Redirect =====
  // Redirect public.imecapital.in to root domain (301 permanent redirect)
  if (domainInfo.subdomain === 'public') {
    const url = request.nextUrl.clone();
    url.host = 'imecapital.in';
    const res = NextResponse.redirect(url, { status: 301 });
    return applyAffCookie(request, res, affPayload);
  }

  // ===== PHASE 2: Static Assets (always allowed) =====
  if (routeGroup === 'static') {
    const res = NextResponse.next();
    return applyAffCookie(request, res, affPayload);
  }

  // ===== PHASE 2.5: API Routes (no auth required) =====
  if (pathname.startsWith('/api/')) {
    const res = NextResponse.next();
    return applyAffCookie(request, res, affPayload);
  }

  // ===== PHASE 3: Subdomain Routing (Production only) =====
  if (domainInfo.domain === 'imecapital' && domainInfo.subdomain) {
    // Root domain trying to access RMS routes -> redirect to RMS subdomain
    if (domainInfo.subdomain === 'root' && routeGroup === 'rms') {
      const url = request.nextUrl.clone();
      url.host = 'rms.imecapital.in';
      const res = NextResponse.redirect(url);
      return applyAffCookie(request, res, affPayload);
    }

    // RMS subdomain should only serve RMS routes (handled by strict enforcement below)
  }

  // ===== PHASE 3.5: RMS Root Handling (BEFORE strict enforcement) =====
  // Handle RMS subdomain root - redirect to /app for clean URL structure
  if (domainInfo.subdomain === 'rms' && pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/app';
    const res = NextResponse.redirect(url);
    return applyAffCookie(request, res, affPayload);
  }

  // ===== PHASE 3.6: Strict Subdomain-Path Enforcement =====
  if (domainInfo.subdomain === 'rms') {
    // RMS subdomain trying to access public routes -> 404
    if (routeGroup === 'public') {
      const url = request.nextUrl.clone();
      url.pathname = '/not-found';
      const res = NextResponse.rewrite(url);
      return applyAffCookie(request, res, affPayload);
    }
  }
  
  // Root domain serves public routes only (RMS routes already redirected above)

  // ===== PHASE 5: Old Auth Route Redirects =====
  const oldAuthRoutes = [
    "/auth/login",
    "/auth/sign-up",
    "/auth/forgot-password",
    "/auth/update-password",
    "/auth/sign-up-success",
    "/auth/error",
    "/auth/otp-login",
  ];

  const isOldAuthRoute = oldAuthRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (isOldAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/app";
    const res = NextResponse.redirect(url);
    return applyAffCookie(request, res, affPayload);
  }

  // ===== PHASE 6: Authentication =====

  // Define private routes that require authentication
  const privateRoutes = [
    // All RMS routes
    '/investments', '/mandate', '/funds', '/companies', '/categories',
    '/amc', '/assetclass', '/sectors', '/structure', '/crm',
    '/tickets', '/internal', '/uservalidation', '/survey', '/protected', '/shortlist', '/academy'
    // Note: /blogs/edit moved to (rms)/internal/edit/blog/[slug]
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

    // Unauthenticated -> redirect to RMS app landing page
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/app";
      // Store original URL for post-login redirect
      url.searchParams.set('redirectTo', pathname);
      const res = NextResponse.redirect(url);
      return applyAffCookie(request, res, affPayload);
    }


    // ===== PHASE 7: Maintain Session & Return =====
    return applyAffCookie(request, supabaseResponse, affPayload);
  }

  // ===== PHASE 7: Maintain Session & Return =====
  const res = await updateSession(request);
  return applyAffCookie(request, res, affPayload);
}

export const config = {
  matcher: [
    // Match everything except Next.js internals & common static assets
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
