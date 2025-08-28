import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { SearchButton } from "@/components/forms/SearchButton";
import { GroupMandateProvider } from "@/lib/contexts/GroupMandateContext";
import { MasterOptionsProvider } from "@/lib/contexts/MasterOptionsContext";
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
  DollarSignIcon
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
                  <SidebarHeader>
                    <h2 className="text-lg font-semibold">IME RMS</h2>
                  </SidebarHeader>
                  <SidebarContent>
                    <SidebarMenu>
                      <SidebarMenuItem href="/investments" icon={<DollarSignIcon />}>Investments</SidebarMenuItem>
                      <SidebarMenuItem href="/mandate" icon={<ListCheckIcon />}>Mandate</SidebarMenuItem>
                      <SidebarMenuItem href="/funds" icon={<SearchIcon />}>RMS</SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarContent>
                </Sidebar>
                <MainContent>
                  <div className="pt-2 pl-5 pr-5 pb-2 bg-gray-100">
                    {/* Top Navigation Bar */}
                    <div className="flex items-center justify-between pb-2">
                      <div className="flex items-center gap-2">
                         <SidebarTrigger /> 
                      </div>
                      <ChangeGroup />
                    </div>
                  </div>
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
