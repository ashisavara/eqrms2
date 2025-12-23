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

  const [tickets,ongoing] = await Promise.all([
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
      (query) => query.neq('funding_done', 'TRUE'),
    ],
  }),
  ])

  return (
    <div>
        <div className="pageHeadingBox"><h1>Ticketing</h1></div>
        <Tabs defaultValue="tickets" className="w-full mx-auto mt-6 text-sm">
          <TabsList className="w-full">
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
            <TabsTrigger value="accountonboard">Ac Onboarding</TabsTrigger>
            <TabsTrigger value="appbugs">App Bugs</TabsTrigger>
            <TabsTrigger value="content">Content Pipeline</TabsTrigger>
          </TabsList>
          <TabsContent value="tickets">
            <AddTicketButton/>
            <TableTickets data={tickets} />
          </TabsContent>
          <TabsContent value="accountonboard">
            <AddAcOnboardButton />
            <TableAccOnboard data={ongoing} />
          </TabsContent>
          <TabsContent value="appbugs">
            <div className="w-full max-w-screen-2xl mx-auto" style={{ aspectRatio: '16 / 9' }}>
                <iframe 
                src="https://coda.io/embed/s248BHCxNm/_su6BtulV?viewMode=embedplay&hideSections=true" 
                style={{ width:1800, height:1000, maxWidth: '100%' }} 
                allow="fullscreen"
                />
            </div>
          </TabsContent>
          <TabsContent value="content">
            <div className="w-full max-w-screen-2xl mx-auto" style={{ aspectRatio: '16 / 9' }}>
                <iframe 
                src="https://coda.io/embed/s248BHCxNm/_suL6Fxu3?viewMode=embedplay&hideSections=true" 
                style={{ width:1800, height:1000, maxWidth: '100%' }} 
                allow="fullscreen"
                />
            </div>

          </TabsContent>

        </Tabs>
    </div>
  );
}

