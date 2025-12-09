import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "IME PMS",
  description: "IME PMS - Portfolio Management Services",
};

export default function ImepmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-green-600 text-white p-4">
        <h1 className="text-2xl font-bold">IME PMS</h1>
      </header>
      <main className="flex-1 p-8">
        {children}
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2025 IME PMS. All rights reserved.</p>
      </footer>
    </div>
  );
}

