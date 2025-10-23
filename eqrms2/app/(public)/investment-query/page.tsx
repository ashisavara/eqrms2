import { InvQueryDetail } from "@/types/inv-query-detail";
import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import Link from "next/link";

export default async function InvQueryPage() {
  const invQuery = await supabaseListRead<InvQueryDetail>({
    table: "investment_queries",
    columns: "*",
    filters: [
      (query) => query.order('created_at', { ascending: false })
    ],
  });

  return (
      <div className="ime-invQuery-page">
        <h1>invQuery List</h1>
        {invQuery.map((invQuery) => (
          <div key={invQuery.query_id}>
            <span>{invQuery.query_id}</span>
            <Link href={`/investment-query/${invQuery.slug}`}><span className="blue-hyperlink my-5">      {invQuery.title}</span></Link>
          </div>
        ))}
      </div>
  );
}

