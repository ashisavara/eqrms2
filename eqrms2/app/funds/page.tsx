import { SupabaseListResource } from "@/components/supabase/listRead";
import { columns, Fund } from "./columns";
import { FundsDataTable } from "./FundsDataTable";

export default function FundsPage() {
  return (
    <SupabaseListResource<Fund> table="rms_funds" columns="fund_id, fund_name, fund_rating, one_yr, three_yr, five_yr, open_for_subscription" filters={[]}>
      {(funds) => {
        return (
          <div>
            <h1 className="text-2xl font-bold m-10">Funds</h1>
            <FundsDataTable columns={columns} data={funds} />
          </div>
          
        )
      }}
    </SupabaseListResource>
  );
}