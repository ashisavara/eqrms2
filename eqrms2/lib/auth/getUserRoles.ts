'use server';

import { cache } from 'react';
import { createClient } from "@/lib/supabase/server";

/**
 * Extract user roles from JWT token (server-side only)
 * Uses React cache to ensure only 1 fetch per request
 * Returns guest role if no user or user role (supports guest users)
 */
export const getUserRoles = cache(async (): Promise<string[]> => {
  try {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.getSession();

    // Return guest role if no session or error
    if (error || !session?.access_token) {
      return ['guest'];
    }

    // Decode JWT payload to extract user_roles
    const payload = JSON.parse(atob(session.access_token.split('.')[1]));
    return payload.user_roles || ['guest'];
    
  } catch (error) {
    console.error('Error extracting user roles:', error);
    return ['guest']; // Return guest role instead of throwing
  }
});

/**
 * Extract group and mandate information from JWT token (server-side only)
 * Used for login initialization only - no caching needed since used once
 */
export async function getJWTGroupMandate(): Promise<{
  groupInfo: { id: number; name: string } | null;
  mandateInfo: { id: number; name: string } | null;
}> {
  try {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session?.access_token) {
      return { groupInfo: null, mandateInfo: null };
    }

    const payload = JSON.parse(atob(session.access_token.split('.')[1]));
    
    return {
      groupInfo: payload.group_id && payload.group_name ? {
        id: payload.group_id,
        name: payload.group_name
      } : null,
      mandateInfo: payload.mandate_id && payload.mandate_name ? {
        id: payload.mandate_id,
        name: payload.mandate_name
      } : null
    };
  } catch (error) {
    console.error('Error extracting group/mandate from JWT:', error);
    return { groupInfo: null, mandateInfo: null };
  }
}

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