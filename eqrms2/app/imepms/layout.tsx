import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "IME PMS",
  description: "IME PMS - Portfolio Management Services",
};

export default function ImepmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-800 text-white p-4">
        <h1 className="text-2xl font-bold"><Link href="https://imepms.in" className="text-white">IME PMS</Link></h1>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2025 IME PMS. All rights reserved. SEBI License Number: INP000009524 </p>
        <p> <Link href="https://pms.wealthspectrum.com/feecalc.html" className="text-blue-500">Fee Calculation Tool</Link> | <Link href="https://drive.google.com/file/d/1yEt8nDuou85Cvw4FSkFI0J65H2yGf8yk/view?usp=drive_link" className="text-blue-500">Investment Charter</Link> | <Link href="https://drive.google.com/file/d/1xtCPp5F-cu9NVbI_2rz4GJaS5KIL73zQ/view?usp=drive_link" className="text-blue-500">Disclosure Document</Link> | <Link href="https://imepms.in/investor-complaints" className="text-blue-500">Investor Complaints</Link>
        </p>
      </footer>
    </div>
  );
}

