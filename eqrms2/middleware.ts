/**
 * OTP-ONLY AUTHENTICATION MIDDLEWARE
 * 
 * This middleware enforces OTP-only authentication:
 * - Redirects unauthenticated users to /auth/otp-login
 * - Redirects old email/password auth routes to /auth/otp-login
 * - Allows public access to static assets and OTP-related routes
 * - Post-login redirects to /investments
 */

import { updateSession } from "@/lib/supabase/middleware";
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Define public routes (no auth needed)
  const publicRoutes = [
    "/auth/otp-login",          // OTP login page
    "/api/send-otp",            // OTP generation API
    "/api/verify-otp",          // OTP verification API
  ]

  // Define old auth routes to redirect to OTP login
  const oldAuthRoutes = [
    "/auth/login",
    "/auth/sign-up", 
    "/auth/forgot-password",
    "/auth/update-password",
    "/auth/sign-up-success",
    "/auth/error"
  ]

  // Check if current path is public (no auth needed)
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + "/")
  )

  // Check if it's an old auth route that should redirect to OTP login
  const isOldAuthRoute = oldAuthRoutes.some(route =>
    pathname === route || pathname.startsWith(route + "/")
  )

  // Allow static assets and Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico)$/)
  ) {
    return NextResponse.next()
  }

  // Redirect old auth routes to OTP login
  if (isOldAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/otp-login'
    return NextResponse.redirect(url)
  }

  // Allow public routes
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // For all other routes, check authentication using Supabase session
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // No need to set cookies in middleware for auth check
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // If no user and trying to access protected route, redirect to OTP login
  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/otp-login'
    return NextResponse.redirect(url)
  }

  // If user is authenticated and on root path, redirect to investments
  if (user && pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = '/investments'
    return NextResponse.redirect(url)
  }

  // For authenticated users on other routes, use updateSession to maintain session
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
