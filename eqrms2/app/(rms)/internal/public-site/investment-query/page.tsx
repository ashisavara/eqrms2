import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { InvQueryDetail } from "@/types/inv-query-detail";
import TableInvestmentQuery from "./TableInvestmentQuery";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function InvestmentQueryPage() {
  const investmentQueries = await supabaseListRead<InvQueryDetail>({
    table: "investment_queries",
    columns: "*",
    filters: [
      (query) => query.order('created_at', { ascending: false })
    ],
  });

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Investment Queries</h1>
        <Link href="/internal/public-site/investment-query/add">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            Add Investment Query
          </Button>
        </Link>
      </div>
      <TableInvestmentQuery data={investmentQueries} />
    </div>
  );
}

