import { SupabaseSingleResource } from "@/components/supabase/singleRead";

type Fund = { fund_id: string; fund_name: string; fund_rating: number; fund_aum: number };

export default async function FundPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // Await the params to get the id
  
  return (
    <SupabaseSingleResource<Fund> table="rms_funds" columns="fund_id, fund_name, fund_rating, fund_aum" filters={[{ column: "fund_id", operator: "eq", value: id }]}>
        {(fund) => (
            <div className="p-4 m-4 bg-gray-600 rounded-lg shadow-md text-center">
                <h1 className="text-2xl font-bold">{fund.fund_name}</h1>
                <p className="text-gray-300">Rating: {fund.fund_rating}</p>
                <p className="text-gray-300">AUM: Rs. {fund.fund_aum} cr</p>
            </div>
        )}
    </SupabaseSingleResource>
  );
}