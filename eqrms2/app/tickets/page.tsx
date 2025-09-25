import TableTickets  from "./TableTickets";
import { Ticket } from "@/types/tickets-detail";
import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { getUserRoles } from '@/lib/auth/getUserRoles';
import { can } from '@/lib/permissions';
import { redirect } from 'next/navigation';

export default async function TicketsPage() {
  const userRoles = await getUserRoles();
  const tickets = await supabaseListRead<Ticket>({
    table: "v_tickets",
    columns: "*",
  });

  return (
    <div>
      <TableTickets data={tickets} />
    </div>
  );
}