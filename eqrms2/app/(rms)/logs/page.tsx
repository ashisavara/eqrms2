import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { getCurrentGroupId, getCurrentGroupName } from "@/lib/auth/serverGroupMandate";
import UserLog from "@/components/rms/UserLog";
import TableUserLogs from "@/app/(rms)/crm/TableUserLogs";
import { UserLogDetail } from "@/types/user-log";
import RmsPageTitle from "@/components/uiComponents/rms-page-title";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserRoles } from '@/lib/auth/getUserRoles';
import { can } from '@/lib/permissions';
import { redirect } from 'next/navigation';

const USER_LOG_COLUMNS =
  "log_id, user_id, user_role, user_name, group_id, group_name, event_timestamp, segment, entity_id, entity_slug, entity_title, page_path";

export default async function LogsPage() {
  const userRoles = await getUserRoles();
  
  // Check permission first
  if (!can(userRoles, 'crm', 'view_leads')) {
    redirect('/404'); // or wherever you want to send them
  }

  const groupId = await getCurrentGroupId();
  const groupName = await getCurrentGroupName();

  const [groupLogs, allLogs] = await Promise.all([
    groupId != null
      ? supabaseListRead<UserLogDetail>({
          table: "user_logs",
          columns: USER_LOG_COLUMNS,
          filters: [(query) => query.eq("group_id", groupId).order("event_timestamp", { ascending: false })],
        })
      : Promise.resolve([] as UserLogDetail[]),
    supabaseListRead<UserLogDetail>({
      table: "user_logs",
      columns: USER_LOG_COLUMNS,
      filters: [(query) => query.order("event_timestamp", { ascending: false })],
    }),
  ]);

  return (
    <div className="px-4 py-2">
      <UserLog segment="logs" entityTitle="Logs" pagePath="/logs" entitySlug="logs" />
      <RmsPageTitle
        title="Logs"
        caption="Activity for the selected client group, or the full log across all groups."
      />
      <Tabs defaultValue="group-logs" className="ime-tabs">
        <TabsList className="w-full">
          <TabsTrigger value="group-logs">Group Logs</TabsTrigger>
          <TabsTrigger value="all-logs">All Logs</TabsTrigger>
        </TabsList>
        <TabsContent value="group-logs" className="mt-4">
          {groupId == null ? (
            <p className="text-muted-foreground">Use Select Group to choose a client group, then view logs for that group here.</p>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Showing activity for the selected group{groupName ? `: ${groupName}` : ` (ID ${groupId})`}.
              </p>
              <TableUserLogs data={groupLogs} />
            </div>
          )}
        </TabsContent>
        <TabsContent value="all-logs" className="mt-4">
          <TableUserLogs data={allLogs} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
