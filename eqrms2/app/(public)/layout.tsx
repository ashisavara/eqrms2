import { headers } from 'next/headers';
import type { Metadata } from 'next';
import { getUserRoles } from '@/lib/auth/getUserRoles';
import { can } from '@/lib/permissions';
import { redirect } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const isStaging = host.startsWith('public.');

  if (isStaging) {
    return {
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {};
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  // Admin-only access during development
  const userRoles = await getUserRoles();
  
  if (!can(userRoles, 'internal', 'admin_only')) {
    redirect('/auth/otp-login');
  }

  return (
    <div>
      <div className="bg-gray-100 border-b p-4">
        <div className="max-w-7xl mx-auto">Hello World</div>
      </div>
      {children}
    </div>
  );
}

