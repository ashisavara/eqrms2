import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { SearchButton } from "@/components/forms/SearchButton";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <p className="font-bold text-blue-700 pt-6 pb-2 pl-4"><a href="/companies">  Val Screen  </a>  |  <a href="/funds"> Funds  </a> | <a href="/funds/all"> AllFunds</a> | <a href="/amc"> AMC</a> | <a href="/categories"> Categories</a> | <a href="/funds/changelog"> ChangeLog</a> | <a href="/sectors"> Sectors</a> | <SearchButton /></p>
            {children}
          </ThemeProvider>
      </body>
    </html>
  );
}
