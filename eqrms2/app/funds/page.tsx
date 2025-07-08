import { SupabaseListResource } from "@/components/supabase/listRead";
import Link from "next/link";

type Fund = { fund_id: string; fund_name: string };

export default function FundsPage() {
  return (
    <SupabaseListResource<Fund> table="rms_funds" columns="fund_id, fund_name" filters={[]}>
      {(funds) => (
        <div>
          {funds.map((fund) => (
            <div key={fund.fund_id}>
              <Link href={`/funds/${fund.fund_id}`}>{fund.fund_name}</Link>
            </div>
          ))}
        </div>
      )}
    </SupabaseListResource>
  );
}