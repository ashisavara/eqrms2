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
                <Sidebar>
                  <div className="border-b border-gray-200 p-2 flex items-center justify-center">
                    <SidebarTrigger />
                  </div>
                  <SidebarContent>
                    <SidebarMenu>
                      <SidebarMenuItem href="/investments" icon={<DollarSignIcon />}>Investments</SidebarMenuItem>
                      <SidebarMenuItem href="/mandate" icon={<ListCheckIcon />}>Mandate</SidebarMenuItem>
                      <SidebarMenuItem href="/funds" icon={<FileChartColumnIncreasingIcon />}>RMS</SidebarMenuItem>
                      <SidebarMenuItem icon={<TargetIcon />}>
                        <ChangeGroupHandler />
                      </SidebarMenuItem>
                      <SidebarMenuItem icon={<LogOutIcon />}>
                        <LogoutHandler />
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarContent>
                </Sidebar>
                <MainContent>
                  <div className="px-2 py-4 md:px-10">{children}</div>
                </MainContent>
                <Toaster />
              </SidebarProvider>
              </GroupMandateProvider>
            </MasterOptionsProvider>
          </ThemeProvider>
      </body>
    </html>
  );
}
