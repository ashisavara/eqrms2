import { EditInvestmentQueryForm } from "@/components/forms/EditInvestmentQuery";
import { supabaseSingleRead } from "@/lib/supabase/serverQueryHelper";
import { InvQueryDetail } from "@/types/inv-query-detail";
import { notFound } from "next/navigation";

export default async function EditInvestmentQueryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const queryId = parseInt(id, 10);
    
    if (isNaN(queryId)) {
        notFound();
    }

    const investmentQueryData = await supabaseSingleRead<InvQueryDetail>({
        table: "investment_queries",
        columns: "*",
        filters: [
            (query) => query.eq("query_id", queryId)
        ],
    });

    if (!investmentQueryData) {
        notFound();
    }

    // Convert InvQueryDetail to InvestmentQueryValues format
    const initialData = {
        title: investmentQueryData.title || "",
        body: investmentQueryData.body || "",
        query_categories: investmentQueryData.query_categories || "",
        slug: investmentQueryData.slug || ""
    };

    return (
        <div>
            <EditInvestmentQueryForm initialData={initialData} id={queryId} />
        </div>
    );
}

