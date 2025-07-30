import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { SearchButton } from "@/components/forms/SearchButton";
import { GroupMandateProvider } from "@/lib/contexts/GroupMandateContext";
import { ChangeGroup } from "@/components/forms/ChangeGroup";
import { ContextDisplay } from "@/components/forms/ContextDisplay";
import { Toaster } from "sonner";

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
            <GroupMandateProvider>
              <div className="px-4 pt-6">
                {/* Main Navigation */}
                <div className="flex items-center justify-between pb-2">
                  <p className="font-bold text-blue-700">
                    <a href="/companies">Val Screen</a> | 
                    <a href="/funds"> Funds</a> | 
                    <a href="/funds/all"> AllFunds</a> | 
                    <a href="/amc"> AMC</a> | 
                    <a href="/categories"> Categories</a> | 
                    <a href="/funds/changelog"> ChangeLog</a> | 
                    <a href="/sectors"> Sectors</a> | 
                    <a href="/crm"> CRM</a> | 
                    <SearchButton />
                  </p>
                  <ChangeGroup />
                </div>
                
                {/* Context Display for debugging */}
                <div className="flex justify-center pb-4">
                  <ContextDisplay />
                </div>
              </div>
              {children}
              <Toaster />
            </GroupMandateProvider>
          </ThemeProvider>
      </body>
    </html>
  );
}
