import { logUserPageView } from '@/lib/logging/logUserPageView';

type UserLogProps = {
  segment: string;
  entityId?: number | null;
  entitySlug?: string | null;
  entityTitle?: string | null;
  pagePath?: string | null;
};

export default async function UserLog({
  segment,
  entityId,
  entitySlug,
  entityTitle,
  pagePath,
}: UserLogProps) {
  await logUserPageView({
    segment,
    entityId,
    entitySlug,
    entityTitle,
    pagePath,
  });

  return null;
}
