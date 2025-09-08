import { TableValscreen } from "./TableValscreen";
import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { Company } from "@/types/company-detail";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TableSectors } from "../sectors/TableSectors";
import { SectorValues } from "@/types/forms";
import { getUserRoles } from '@/lib/auth/getUserRoles';
import { can } from '@/lib/permissions';
import { redirect } from 'next/navigation';

export default async function CompaniesPage() {
  // Fetch data server-side

  const userRoles = await getUserRoles();
  
  // Check permission first
  if (!can(userRoles, 'eqrms', 'view_companies')) {
    redirect('/uservalidation'); // or wherever you want to send them
  }

  const [companies, sectors] = await Promise.all([
    supabaseListRead<Company>({
      table: "eq_rms_company_view",
      columns: "company_id,ime_name,sector_name,industry,quality,mt_growth,market_momentum,upside,stock_score,cmp,target_price,multiple,pe_t2,pe_t4,gr_t1,gr_t2,gr_t3,gr_t4,1m_return,3m_return,1yr_return,3yrs_return,5yrs_return, coverage",
      filters: [
        (query) => query.in('coverage', ['Focus', 'Detail', 'Basic']),
        //(query) => query.order('upside', { ascending: false, nullsFirst: false })
      ]
    }),
    supabaseListRead<SectorValues>({
      table: 'eq_rms_sectors',
      columns: '*',
      filters: [
          (query) => query.order('sector_name', { ascending: true })
      ]
  })
]);

  return (
    <div>
      <Tabs defaultValue="companies" className="w-full mx-auto mt-6 text-sm">
            <TabsList className="w-full">
                  <TabsTrigger value="companies">ValScreen</TabsTrigger>
                  <TabsTrigger value="sectors">Sectors</TabsTrigger>
          </TabsList>
                <TabsContent value="companies">
                <TableValscreen data={companies}/>
                </TabsContent>
                <TabsContent value="sectors">
                  <TableSectors data={sectors} />
                </TabsContent>
      </Tabs>
    </div>
  );
}
