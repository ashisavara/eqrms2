'use server';

import { createClient } from "@/lib/supabase/server";

/**
 * Extract user roles from JWT token (server-side only)
 * Returns array of role strings from custom JWT claims
 */
export async function getUserRoles(): Promise<string[]> {
  try {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.getSession();

    // Return empty array if no session or error
    if (error || !session?.access_token) {
      return [];
    }

    // Decode JWT payload to extract user_roles
    const payload = JSON.parse(atob(session.access_token.split('.')[1]));
    return payload.user_roles || [];
    
  } catch (error) {
    console.error('Error extracting user roles:', error);
    return [];
  }
} 