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
        <p className="text-white"> <Link href="https://pms.wealthspectrum.com/feecalc.html" className="text-blue-500">Fee Calculation Tool</Link> | <Link href="https://drive.google.com/file/d/1yEt8nDuou85Cvw4FSkFI0J65H2yGf8yk/view?usp=drive_link" className="text-blue-500">Investment Charter</Link> | <Link href="https://drive.google.com/file/d/1xtCPp5F-cu9NVbI_2rz4GJaS5KIL73zQ/view?usp=drive_link" className="text-blue-500">Disclosure Document</Link> | <Link href="https://imepms.in/investor-complaints" className="text-blue-500">Investor Complaints</Link>
        | <Link href="https://scores.sebi.gov.in/" className="text-blue-500">SCORES</Link>
        | <Link href="https://smartodr.in/login" className="text-blue-500">ODR</Link> | UPI (imeportfolio.pms@validhdfc)
        </p>
      </footer>
    </div>
  );
}

