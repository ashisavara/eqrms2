import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { SearchButton } from "@/components/forms/SearchButton";
import { GroupMandateProvider } from "@/lib/contexts/GroupMandateContext";
import { ChangeGroup } from "@/components/forms/ChangeGroup";
import { ContextDisplay } from "@/components/forms/ContextDisplay";
import { Toaster } from "sonner";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  MainContent,
} from "@/components/ui/simple-sidebar";

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
              <SidebarProvider>
                <Sidebar>
                  <SidebarHeader>
                    <h2 className="text-lg font-semibold">IME RMS</h2>
                  </SidebarHeader>
                  <SidebarContent>
                    <SidebarMenu>
                      <SidebarMenuItem href="/companies">Val Screen</SidebarMenuItem>
                      <SidebarMenuItem href="/funds">RMS</SidebarMenuItem>
                      <SidebarMenuItem href="/crm">CRM</SidebarMenuItem>
                      <SidebarMenuItem href="/investments">Investments</SidebarMenuItem>
                      <SidebarMenuItem href="/finplan">Fin Plan</SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarContent>
                  <SidebarFooter>
                    <SidebarMenu>
                      <SidebarMenuItem href="/protected">Logout</SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarFooter>
                </Sidebar>
                <MainContent>
                  <div className="pt-2 pl-5 pr-5 pb-2 bg-gray-100">
                    {/* Top Navigation Bar */}
                    <div className="flex items-center justify-between pb-2">
                      <div className="flex items-center gap-2">
                        <SidebarTrigger />
                        <p className="font-bold text-blue-700">
                          <SearchButton /> | 
                          <a href="/funds/all"> AllFunds</a> | 
                          <a href="/funds/changelog"> ChangeLog</a> |
                        </p>
                      </div>
                      <ChangeGroup />
                    </div>
                  </div>
                  <div className="px-2 py-4 md:px-10">{children}</div>
                </MainContent>
                <Toaster />
              </SidebarProvider>
            </GroupMandateProvider>
          </ThemeProvider>
      </body>
    </html>
  );
}
