import { headers } from 'next/headers';
import type { Metadata } from 'next';

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

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  // TODO: Add admin-only access check after fixing auth issues
  // For now, allow all access during development
  
  return (
    <div>
      <div className="bg-gray-100 border-b p-4">
        <div className="max-w-7xl mx-auto">Hello World</div>
      </div>
      {children}
    </div>
  );
}

