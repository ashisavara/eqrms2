import { headers } from 'next/headers';
import type { Metadata } from 'next';
import { PublicNavBar } from '@/components/ui/public-navbar';
import { PublicFooter } from '@/components/ui/public-footer';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  
  // Only apply noindex to RMS subdomain (private/authenticated content)
  // public.imecapital.in now redirects to root domain via middleware
  const isRMS = host.startsWith('rms.');

  if (isRMS) {
    return {
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  // Root domain (imecapital.in) - allow indexing
  return {};
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  // TODO: Add admin-only access check after fixing auth issues
  // For now, allow all access during development
  
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavBar />
      <main className="flex-1">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}

