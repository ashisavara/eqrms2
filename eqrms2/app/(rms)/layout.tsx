import { getUserRoles } from '@/lib/auth/getUserRoles';
import { can } from '@/lib/permissions';
import RoleExpiring from "@/components/access-control/RoleExpiring";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  MainContent,
} from "@/components/ui/simple-sidebar";
import {
  RotateCcwIcon,
  LogOutIcon,
  ListCheckIcon,
  DollarSignIcon,
  StarIcon,
  BlocksIcon,
  FileChartColumnIncreasingIcon,
  ShieldCheckIcon,
  BookIcon
} from "lucide-react";
import { LogoutHandler } from "@/components/ui/logout-handler";
import { ChangeGroupHandler } from "@/components/ui/change-group-handler";
import { PWAInstallButton } from "@/components/ui/pwa-install-button";

export default async function RmsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get user roles for conditional rendering
  const userRoles = await getUserRoles();
  const canViewInternal = can(userRoles, 'internal', 'view');
  const canViewAcademy = can(userRoles, 'blogs', 'edit');

  return (
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
            <SidebarMenuItem href="/shortlist" icon={<StarIcon />}>Shortlist</SidebarMenuItem>
            <SidebarMenuItem href="/mandate" icon={<ShieldCheckIcon />}>Mandate</SidebarMenuItem>
            <SidebarMenuItem href="/categories" icon={<BlocksIcon />}>Categories</SidebarMenuItem>
            <SidebarMenuItem href="/funds" icon={<FileChartColumnIncreasingIcon />}>Funds</SidebarMenuItem>
            {canViewAcademy && (
              <SidebarMenuItem href="/academy" icon={<BookIcon />}>Academy</SidebarMenuItem>
            )}
            {canViewInternal && (
              <SidebarMenuItem icon={<RotateCcwIcon />}>
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
        <div>
          {can(userRoles, 'expiring', 'view_expiring') && (
          <RoleExpiring />)}
          {children}
        </div>
      </MainContent>
    </SidebarProvider>
  );
}

