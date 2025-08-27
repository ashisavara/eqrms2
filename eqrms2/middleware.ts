/**
 * MIDDLEWARE TEMPORARILY DISABLED FOR OTP TESTING
 * 
 * This middleware has been disabled to allow testing of the OTP authentication system.
 * The original middleware was redirecting OTP API calls to /auth/login, preventing
 * the OTP system from working properly.
 * 
 * TODO: Re-enable middleware and configure it to allow OTP routes:
 * - /api/send-otp
 * - /api/verify-otp
 * - /auth/otp-login
 * 
 * Original middleware logic is preserved in comments below.
 */

import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // TEMPORARILY DISABLED FOR OTP TESTING
  // TODO: Re-enable and configure to allow OTP routes
  return NextResponse.next();
  
  // Original middleware (commented out)
  // return await updateSession(request);
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
