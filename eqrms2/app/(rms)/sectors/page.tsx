import { TableSectors } from "./TableSectors";
import { SectorValues } from "@/types/forms";
import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { getUserRoles } from '@/lib/auth/getUserRoles';
import { can } from '@/lib/permissions';
import { redirect } from 'next/navigation';

export default async function SectorsPage() {
  const userRoles = await getUserRoles();
  
  // Check permission first
  if (!can(userRoles, 'eqrms', 'view_companies')) {
    redirect('/uservalidation'); // or wherever you want to send them
  }

    const sectors = await supabaseListRead<SectorValues>({
        table: 'eq_rms_sectors',
        columns: '*',
        filters: [
            (query) => query.order('sector_name', { ascending: true })
        ]
    });
  
    return (
    <div>
      <h1 className="text-2xl font-bold">Sectors</h1>
      <TableSectors data={sectors} />
    </div>
  );
}