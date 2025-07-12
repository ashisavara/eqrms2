import { SupabaseListResource } from "@/components/supabase/listRead";
import { columns, Company } from "./columns-valscreen";
import { ValScreenDataTable } from "./TableValscreen";

export default function FundsPage() {
  return (
    <SupabaseListResource<Company> table="eq_rms_company" columns="company_id,ime_name,sector_id,industry,coverage" filters={[]}>
      {(companies) => {
        return (
          <div>
            <h1 className="text-2xl font-bold m-10">Companies</h1>
             <ValScreenDataTable columns={columns} data={companies} />
          </div>
          
        )
      }}
    </SupabaseListResource>
  );
}