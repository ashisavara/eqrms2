import { redirect } from 'next/navigation';
import { getUserRoles } from '@/lib/auth/getUserRoles';
import { can } from '@/lib/permissions';

export default async function PublicSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userRoles = await getUserRoles();
  
  // Check permission for internal public-site access
  if (!can(userRoles, 'internal', 'link_login_lead')) {
    redirect('/uservalidation');
  }

  return <>{children}</>;
}

