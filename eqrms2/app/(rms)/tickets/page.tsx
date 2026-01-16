import TableTickets  from "./TableTickets";
import { Ticket } from "@/types/tickets-detail";
import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { getUserRoles } from '@/lib/auth/getUserRoles';
import { AddTicketButton } from "@/components/forms/AddTicket";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddAcOnboardButton } from "@/components/forms/AddAcOnboard";
import TableAccOnboard from "./TableAccOnboard";
import { AccountOnboarding } from "@/types/account-onboard-detail";
import { can } from '@/lib/permissions';
import { redirect } from 'next/navigation';

export default async function TicketsPage() {
  const userRoles = await getUserRoles();
  // Check permission first
  if (!can(userRoles, 'internal', 'view')) {
    redirect('/404'); // or wherever you want to send them
  }

  const [tickets,ongoing,waitingFunding] = await Promise.all([
    supabaseListRead<Ticket>({
    table: "v_tickets",
    columns: "*",
    filters: [
      (query) => query.neq('status', 'Closed'),
      (query) => query.order('created_at', { ascending: false }),
    ],
  }),
    supabaseListRead<AccountOnboarding>({
      table: "v_account_onboard",
      columns: "*",
      filters: [
        (query) => query.neq('account_opened', 'TRUE'),
        (query) => query.neq('client_cancellation', 'TRUE'),
      ],
    }),
    supabaseListRead<AccountOnboarding>({
      table: "v_account_onboard",
      columns: "*",
      filters: [
        (query) => query.eq('funding_done', 'FALSE'),
        (query) => query.eq('account_opened', 'TRUE'),
        (query) => query.neq('client_cancellation', 'TRUE'),
      ],
    }),
  ])

  return (
    <div>
        <div className="pageHeadingBox"><h1 className="text-white">Ticketing</h1></div>
        <div className="px-6">
        <Tabs defaultValue="tickets" className="w-full mx-auto mt-6 text-sm">
          <TabsList className="w-full">
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
            <TabsTrigger value="accountonboard">Ac Onboarding</TabsTrigger>
            <TabsTrigger value="appbugs">Trackers</TabsTrigger>
          </TabsList>
          <TabsContent value="tickets">
            <AddTicketButton/>
            <TableTickets data={tickets} />
          </TabsContent>
          <TabsContent value="accountonboard">
            <AddAcOnboardButton />
            <h2>Ongoing Account Onboarding</h2>
            <TableAccOnboard data={ongoing} />
            <h2>Funding Awaited</h2>
            <TableAccOnboard data={waitingFunding} />
          </TabsContent>
          <TabsContent value="appbugs">
            <div className="w-full mx-auto" style={{ aspectRatio: '16 / 9' }}>
            <iframe src="https://bush-juniper-c4a.notion.site/ebd//2e455ec789e180e4a8f6e0242dbfe4a9?v=2e455ec789e180c2ad89000c007f1b05" width="100%" height="800"/>
                
            </div>
          </TabsContent>

        </Tabs>
    </div>
    </div>
  );
}

