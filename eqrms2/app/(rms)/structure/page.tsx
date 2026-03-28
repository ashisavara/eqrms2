import { redirect } from 'next/navigation';
import { logUserPageView } from '@/lib/logging/logUserPageView';

export default async function StructurePage() {
  await logUserPageView({
    segment: 'funds',
    entityTitle: 'Structure',
    pagePath: '/structure',
    entitySlug: 'structure',
  });
  redirect('/funds');
}

