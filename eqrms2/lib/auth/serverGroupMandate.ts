// Reads group id from cookies .. these cookies are saved in the file contexts, GroupMandateContext

"use server";

import { cookies } from 'next/headers';

// Cookie constants (must match the ones in GroupMandateContext.tsx)
const GROUP_COOKIE = 'ime_group_id';
const GROUP_NAME_COOKIE = 'ime_group_name';

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
 * Get the current group name from cookies (server-side)
 * Useful for logging/audit rows when selected group can change.
 */
export async function getCurrentGroupName(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const groupName = cookieStore.get(GROUP_NAME_COOKIE)?.value;

    if (!groupName) return null;
    return decodeURIComponent(groupName);
  } catch (error) {
    console.warn('Failed to read group name from cookies:', error);
    return null;
  }
}
