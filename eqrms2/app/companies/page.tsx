import { TableValscreen } from "./TableValscreen";
import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { Company } from "@/types/company-detail";

export default async function CompaniesPage() {
  // Fetch data server-side
  const companies = await supabaseListRead<Company>({
    table: "eq_rms_company_view",
    columns: "company_id,ime_name,sector_name,industry,quality,mt_growth,market_momentum,upside,stock_score,cmp,target_price,multiple,pe_t2,pe_t4,gr_t1,gr_t2,gr_t3,gr_t4,1m_return,3m_return,1yr_return,3yrs_return,5yrs_return",
    filters: [
      (query) => query.in('coverage', ['Coverage', 'DV', 'BV'])
    ]
  });

  return (
    <div>
      <h1 className="text-2xl font-bold m-1">Companies</h1>
      <TableValscreen data={companies}/>
    </div>
  );
}
