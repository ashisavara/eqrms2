import { TableSectors } from "./TableSectors";
import { SectorValues } from "@/types/forms";
import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";

export default async function SectorsPage() {

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