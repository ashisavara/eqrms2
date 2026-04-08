import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicNavBarPms } from '@/components/ui/public-navbar-pms';

export const metadata: Metadata = {
  title: "IME PMS",
  description: "IME PMS - Portfolio Management Services",
};

export default function ImepmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header>
        <PublicNavBarPms />
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2025 IME PMS. All rights reserved. SEBI License Number: INP000009524 </p>
      </footer>
    </div>
  );
}

