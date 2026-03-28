'use server';

import { headers } from 'next/headers';
import { getCachedSessionIdentity } from '@/lib/auth/getUserRoles';
import { getCurrentGroupId, getCurrentGroupName } from '@/lib/auth/serverGroupMandate';
import { supabaseInsertRow } from '@/lib/supabase/serverQueryHelper';
import { UserLogInsert } from '@/types/user-log';

type LogUserPageViewInput = {
  segment: string;
  entityId?: number | null;
  entitySlug?: string | null;
  entityTitle?: string | null;
  pagePath?: string | null;
};

function isAbsoluteHttpUrl(value: string): boolean {
  return value.startsWith('http://') || value.startsWith('https://');
}

function stripTrailingSlash(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1);
  return pathname;
}

async function resolvePagePath(pagePath?: string | null): Promise<string | null> {
  const h = await headers();
  const forwardedProto = h.get('x-forwarded-proto');
  const forwardedHost = h.get('x-forwarded-host');
  const host = forwardedHost || h.get('host');
  const protocol = forwardedProto || (process.env.NODE_ENV === 'production' ? 'https' : 'http');

  const buildFullUrl = (pathname: string): string => {
    const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
    if (!host) return normalizedPath;
    return `${protocol}://${host}${stripTrailingSlash(normalizedPath)}`;
  };

  if (pagePath && pagePath.trim() !== '') {
    const trimmed = pagePath.trim();
    if (isAbsoluteHttpUrl(trimmed)) return trimmed;
    return buildFullUrl(trimmed);
  }

  const headerUrl = h.get('x-url');
  if (headerUrl && headerUrl.trim() !== '') return headerUrl.trim();

  const headerPathname = h.get('x-pathname');
  if (headerPathname && headerPathname.trim() !== '') return buildFullUrl(headerPathname.trim());

  return host ? `${protocol}://${host}` : null;
}

export async function logUserPageView(input: LogUserPageViewInput): Promise<void> {
  try {
    const segment = input.segment?.trim();
    if (!segment) return;

    const identity = await getCachedSessionIdentity();
    if (identity.userRole === 'guest' || identity.userRole === 'no_role') return;
    if (!identity.userId) return;

    const groupId = await getCurrentGroupId();
    const groupName = await getCurrentGroupName();
    const resolvedPagePath = await resolvePagePath(input.pagePath);

    const row: UserLogInsert = {
      user_id: identity.userId,
      user_role: identity.userRole,
      user_name: identity.userName,
      group_id: groupId,
      group_name: groupName,
      segment,
      entity_id: input.entityId ?? null,
      entity_slug: input.entitySlug ?? null,
      entity_title: input.entityTitle ?? null,
      page_path: resolvedPagePath,
    };

    await supabaseInsertRow<UserLogInsert>('user_logs', row);
  } catch (error) {
    console.error('Error logging user page view:', error);
  }
}
