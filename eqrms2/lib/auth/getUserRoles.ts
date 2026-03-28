'use server';

import { cache } from 'react';
import { createClient } from "@/lib/supabase/server";

export type CachedSessionIdentity = {
  userId: string | null;
  userRole: string;
  userName: string | null;
};

/**
 * Extract user roles from JWT token (server-side only)
 * Uses React cache to ensure only 1 fetch per request
 * Returns guest role if no user, or no_role if user has no specific role
 */
export const getUserRoles = cache(async (): Promise<string> => {
  try {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.getSession();

    // Return guest role if no session or error (unauthenticated)
    if (error || !session?.access_token) {
      return 'guest';
    }

    // Decode JWT payload to extract user_roles (now a single string)
    const payload = JSON.parse(atob(session.access_token.split('.')[1]));
    return payload.user_roles || 'no_role';
    
  } catch (error) {
    console.error('Error extracting user roles:', error);
    return 'guest'; // Return guest role instead of throwing
  }
});

/**
 * Get current user UUID from Supabase session (server-side only).
 * Uses React cache to avoid repeated session reads within a request.
 */
export const getCachedSessionUserId = cache(async (): Promise<string | null> => {
  try {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session?.user?.id) {
      return null;
    }

    return session.user.id;
  } catch (error) {
    console.error('Error extracting user id from session:', error);
    return null;
  }
});

/**
 * Get cached session identity details (server-side only).
 * Reads uid + role + lead_name from current session/JWT claims.
 */
export const getCachedSessionIdentity = cache(async (): Promise<CachedSessionIdentity> => {
  try {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session?.access_token) {
      return { userId: null, userRole: 'guest', userName: null };
    }

    const payload = JSON.parse(atob(session.access_token.split('.')[1]));

    return {
      userId: session.user?.id ?? null,
      userRole: payload.user_roles || 'no_role',
      userName: payload.lead_name ?? null,
    };
  } catch (error) {
    console.error('Error extracting session identity:', error);
    return { userId: null, userRole: 'guest', userName: null };
  }
});

/**
 * Extract group information from JWT token (server-side only)
 * Used for login initialization only - no caching needed since used once
 */
export async function getJWTGroupMandate(): Promise<{
  groupInfo: { id: number; name: string } | null;
}> {
  try {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session?.access_token) {
      return { groupInfo: null };
    }

    const payload = JSON.parse(atob(session.access_token.split('.')[1]));
    
    return {
      groupInfo: payload.group_id && payload.group_name ? {
        id: payload.group_id,
        name: payload.group_name
      } : null
    };
  } catch (error) {
    console.error('Error extracting group from JWT:', error);
    return { groupInfo: null };
  }
}

/**
 * Get user authentication status and roles
 */
export async function getUserStatus() {
  const userRoles = await getUserRoles();
  return {
    isAuthenticated: userRoles !== 'guest' && userRoles !== 'no_role',
    isGuest: userRoles === 'guest' || userRoles === 'no_role',
    role: userRoles,
    isAdmin: userRoles === 'admin' || userRoles === 'super_admin',
    isSuperAdmin: userRoles === 'super_admin'
  };
} 