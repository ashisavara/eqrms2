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
  title: "IME RMS",
  description: "Proprietary Fund Research Database",
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
              <div className="pt-2 pl-5 pr-5 pb-2 bg-gray-100">
                {/* Main Navigation */}
                <div className="flex items-center justify-between pb-2">
                  <p className="font-bold text-blue-700">
                    <a href="/companies">Val Screen</a> | 
                    <a href="/funds"> RMS</a> | 
                    <a href="/funds/all"> AllFunds</a> | 
                    <a href="/funds/changelog"> ChangeLog</a> |
                    <a href="/crm"> CRM</a> | 
                    <a href="/investments"> Investments</a> | 
                    <a href="/finplan"> Fin Plan</a> | 
                    <a href="/protected"> Logout</a> | 
                    <SearchButton />
                  </p>
                  <ChangeGroup />
                </div>


                
                
              </div>
              <div className="px-5">{children}</div>
              <Toaster />
            </GroupMandateProvider>
          </ThemeProvider>
      </body>
    </html>
  );
}
