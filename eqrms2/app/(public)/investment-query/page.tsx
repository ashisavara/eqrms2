import { InvQueryDetail } from "@/types/inv-query-detail";
import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import InvQueryClient from "./InvQueryClient";

export default async function InvQueryPage() {
  const invQuery = await supabaseListRead<InvQueryDetail>({
    table: "investment_queries",
    columns: "*",
    filters: [
      (query) => query.order('created_at', { ascending: false })
    ],
  });

  return <InvQueryClient invQuery={invQuery} />;
}

