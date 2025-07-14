import { TableValscreen } from "./TableValscreen";
import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { Company } from "@/types/company-detail";

export default async function CompaniesPage() {
  // Fetch data server-side
  const companies = await supabaseListRead<Company>({
    table: "eq_rms_company",
    columns: "company_id,ime_name,sector_id,industry,coverage",
    filters: [
      (query) => query.in('coverage', ['Coverage', 'DV', 'BV'])
    ]
  });

  return (
    <div>
      <h1 className="text-2xl font-bold m-10">Companies</h1>
      <TableValscreen data={companies} />
    </div>
  );
}