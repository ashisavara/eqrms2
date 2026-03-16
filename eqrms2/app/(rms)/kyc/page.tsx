import TableTickets  from "./TableTickets";
import TableAccOnboard from "./TableAccOnboard";
import TableKyc from "./TableKyc";
import { Ticket } from "@/types/tickets-detail";
import { AccountOnboarding } from "@/types/account-onboard-detail";
import { GroupInvestorDetail } from "@/types/group-investor-detail";
import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { getUserRoles } from '@/lib/auth/getUserRoles';
import { AddTicketButton } from "@/components/forms/AddTicket";
import { AddAcOnboardButton } from "@/components/forms/AddAcOnboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { can } from '@/lib/permissions';
import { redirect } from 'next/navigation';

export default async function TicketsPage() {
  const userRoles = await getUserRoles();
  // Check permission first
  if (!can(userRoles, 'internal', 'kyc')) {
    redirect('/404'); // or wherever you want to send them
  }

  const [tickets, ongoing, waitingFunding, kyc] = await Promise.all([
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
    supabaseListRead<GroupInvestorDetail>({
      table: "group_investors",
      columns: "*",
      filters: [
        (query) => query.neq('investor_name', ''),
      ],
    }),
  ])

  return (
    <div>
        <div className="pageHeadingBox"><h1 className="text-white">Ticketing</h1></div>
        <div className="px-6">
        <Tabs defaultValue="kyc" className="w-full mx-auto mt-6 text-sm">
          <TabsList className="w-full">
            <TabsTrigger value="kyc">KYC</TabsTrigger>
            <TabsTrigger value="accountonboard">Ac Onboarding</TabsTrigger>
          </TabsList>
          <TabsContent value="kyc">
            <h2 className="mb-2 font-semibold text-gray-800">KYC Status</h2>
            <TableKyc data={kyc} />
          </TabsContent>
          <TabsContent value="accountonboard">
            <AddAcOnboardButton />
            <h2>Ongoing Account Onboarding</h2>
            <TableAccOnboard data={ongoing} />
            <h2>Funding Awaited</h2>
            <TableAccOnboard data={waitingFunding} />
          </TabsContent>
        </Tabs>
    </div>
    </div>
  );
}

