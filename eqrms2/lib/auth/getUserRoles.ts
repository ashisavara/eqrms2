'use server';

import { cache } from 'react';
import { createClient } from "@/lib/supabase/server";

/**
 * Extract user roles from JWT token (server-side only)
 * Uses React cache to ensure only 1 fetch per request
 * Returns empty array if no user (supports guest users)
 */
export const getUserRoles = cache(async (): Promise<string[]> => {
  try {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.getSession();

    // Return empty array if no session or error (guest user)
    if (error || !session?.access_token) {
      return [];
    }

    // Decode JWT payload to extract user_roles
    const payload = JSON.parse(atob(session.access_token.split('.')[1]));
    return payload.user_roles || [];
    
  } catch (error) {
    console.error('Error extracting user roles:', error);
    return []; // Return empty array instead of throwing
  }
});

/**
 * Get user authentication status and roles
 */
export async function getUserStatus() {
  const userRoles = await getUserRoles();
  return {
    isAuthenticated: userRoles.length > 0,
    isGuest: userRoles.length === 0,
    roles: userRoles,
    isAdmin: userRoles.includes('admin') || userRoles.includes('super_admin'),
    isSuperAdmin: userRoles.includes('super_admin')
  };
} 