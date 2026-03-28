import { redirect } from "next/navigation";
import { logUserPageView } from '@/lib/logging/logUserPageView';

// Force dynamic rendering - even for redirects, to prevent static generation issues
export const dynamic = 'force-dynamic';

export default async function AmcPage() {
  await logUserPageView({
    segment: 'funds',
    entityTitle: 'AMC',
    pagePath: '/amc',
    entitySlug: 'amc',
  });
  redirect('/funds');
}
