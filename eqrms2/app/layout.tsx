import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { SearchButton } from "@/components/forms/SearchButton";
import { GroupMandateProvider } from "@/lib/contexts/GroupMandateContext";
import { MasterOptionsProvider } from "@/lib/contexts/MasterOptionsContext";
import { ContextDisplay } from "@/components/forms/ContextDisplay";
import { Toaster } from "sonner";
import { logoutFromChangeGroupAction } from '@/app/auth/otp-login/otpServerActions';
import { LogoutHandler } from "@/components/ui/logout-handler";
import { ChangeGroupHandler } from "@/components/ui/change-group-handler";
import { PWAInstallButton } from "@/components/ui/pwa-install-button";
import { PWARegister } from "@/components/ui/pwa-register";
import { getUserRoles } from '@/lib/auth/getUserRoles';
import { can } from '@/lib/permissions';
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
import {
  TrendingUpIcon,
  FolderIcon,
  UsersIcon,
  WalletIcon,
  TargetIcon,
  ArchiveIcon,
  FileTextIcon,
  SearchIcon,
  LogOutIcon,
  ListCheckIcon,
  DollarSignIcon,
  FileChartColumnIncreasingIcon
} from "lucide-react";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "IME RMS",
  description: "Proprietary Fund Research Database",
  manifest: "/manifest.json",
  themeColor: "#000000",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "IME RMS",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "IME RMS",
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get user roles for conditional rendering
  const userRoles = await getUserRoles();
  const canViewInternal = can(userRoles, 'internal', 'view');
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={`${geistSans.className} antialiased`} suppressHydrationWarning>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <MasterOptionsProvider>
              <GroupMandateProvider>
              <SidebarProvider>
                {/* Mobile-only top navigation bar - full width overlay */}
                <div className="md:hidden bg-white border-b border-gray-200 p-2 flex items-center justify-between fixed top-0 left-0 right-0 z-50">
                  <SidebarTrigger />
                  <div className="font-semibold text-gray-800">IME RMS</div>
                  <div className="w-6"></div> {/* Spacer for centering */}
                </div>
                
                <Sidebar>
                  <div className="hidden md:flex border-b border-gray-200 p-2 items-center justify-center">
                    <SidebarTrigger />
                  </div>
                  <SidebarContent>
                    {/* Add top padding on mobile to account for fixed header */}
                    <div className="md:hidden h-12"></div>
                    <SidebarMenu>
                      <SidebarMenuItem href="/investments" icon={<DollarSignIcon />}>Investments</SidebarMenuItem>
                      <SidebarMenuItem href="/mandate" icon={<ListCheckIcon />}>Mandate</SidebarMenuItem>
                      <SidebarMenuItem href="/funds" icon={<FileChartColumnIncreasingIcon />}>RMS</SidebarMenuItem>
                      {canViewInternal && (
                        <SidebarMenuItem icon={<TargetIcon />}>
                          <ChangeGroupHandler />
                        </SidebarMenuItem>
                      )}
                      <PWAInstallButton />
                      <SidebarMenuItem icon={<LogOutIcon />}>
                        <LogoutHandler />
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarContent>
                </Sidebar>
                <MainContent>
                  <div className="px-4 pt-16 pb-4 md:px-6 md:py-4">{children}</div>
                </MainContent>
                <Toaster />
                <PWARegister />
              </SidebarProvider>
              </GroupMandateProvider>
            </MasterOptionsProvider>
          </ThemeProvider>
      </body>
    </html>
  );
}
