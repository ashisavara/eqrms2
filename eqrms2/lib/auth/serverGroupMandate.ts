// Reads group and mandate ids from cookies .. these cookies are saved in the file contexts, GroupMandateContext

"use server";

import { cookies } from 'next/headers';

// Cookie constants (must match the ones in GroupMandateContext.tsx)
const GROUP_COOKIE = 'ime_group_id';
const MANDATE_COOKIE = 'ime_mandate_id';

/**
 * Get current group and mandate IDs from cookies (server-side)
 * Returns null if no selection is saved
 */
export async function getCurrentGroupMandate(): Promise<{ groupId: number; mandateId: number } | null> {
  try {
    const cookieStore = await cookies();
    const groupId = cookieStore.get(GROUP_COOKIE)?.value;
    const mandateId = cookieStore.get(MANDATE_COOKIE)?.value;

    if (groupId && mandateId) {
      return {
        groupId: parseInt(groupId),
        mandateId: parseInt(mandateId)
      };
    }

    return null;
  } catch (error) {
    console.warn('Failed to read group/mandate from cookies:', error);
    return null;
  }
}

/**
 * Get only the current group ID from cookies (server-side)
 * Useful when you only need to filter by group
 */
export async function getCurrentGroupId(): Promise<number | null> {
  try {
    const cookieStore = await cookies();
    const groupId = cookieStore.get(GROUP_COOKIE)?.value;
    
    return groupId ? parseInt(groupId) : null;
  } catch (error) {
    console.warn('Failed to read group ID from cookies:', error);
    return null;
  }
}

/**
 * Get only the current mandate ID from cookies (server-side)
 */
export async function getCurrentMandateId(): Promise<number | null> {
  try {
    const cookieStore = await cookies();
    const mandateId = cookieStore.get(MANDATE_COOKIE)?.value;
    
    return mandateId ? parseInt(mandateId) : null;
  } catch (error) {
    console.warn('Failed to read mandate ID from cookies:', error);
    return null;
  }
} 