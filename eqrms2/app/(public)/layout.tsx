import type { Metadata } from 'next';
import { PublicNavBar } from '@/components/ui/public-navbar';
import { PublicFooter } from '@/components/ui/public-footer';

export async function generateMetadata(): Promise<Metadata> {
  // Note: Removed headers() call to allow static generation of blog pages
  // RMS subdomain protection is handled by:
  // 1. Middleware (blocks RMS subdomain from accessing public routes)
  // 2. Robots.txt (sets noindex for RMS subdomain)
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

