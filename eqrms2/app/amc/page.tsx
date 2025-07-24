import { TableAmcScreen } from "./TableAmcScreen";
import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { AMC } from "@/types/amc-detail";

export default async function CompaniesPage() {
  // Fetch data server-side
  const amc = await supabaseListRead<AMC>({
    table: "rms_amc",
    columns: "id, amc_name, structure, amc_rating, amc_size_rating, amc_pedigree_rating, amc_team_rating, amc_philosophy_rating, open_for_distribution, us_investor_tagging, aum, slug ",
    filters: [
      (query) => query.eq('open_for_distribution', ['Y']),
      (query) => query.order('amc_rating', { ascending: false })
    ]
  });

  return (
    <div>
      <h1 className="text-2xl font-bold m-1">AMCs</h1>
      <TableAmcScreen data={amc}/>
    </div>
  );
}
