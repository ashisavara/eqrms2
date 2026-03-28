import { redirect } from 'next/navigation';
import { logUserPageView } from '@/lib/logging/logUserPageView';

export default async function RecommendationsRedirectPage() {
  await logUserPageView({
    segment: 'funds',
    entityTitle: 'Recommendations',
    pagePath: '/recommendations',
    entitySlug: 'recommendations',
  });
  redirect('/funds');
}
