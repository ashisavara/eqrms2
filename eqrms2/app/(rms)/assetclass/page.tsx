import { redirect } from 'next/navigation';
import { logUserPageView } from '@/lib/logging/logUserPageView';

export default async function assetClassPage() {
  await logUserPageView({
    segment: 'funds',
    entityTitle: 'Asset Class',
    pagePath: '/assetclass',
    entitySlug: 'assetclass',
  });
  redirect('/funds');
}
