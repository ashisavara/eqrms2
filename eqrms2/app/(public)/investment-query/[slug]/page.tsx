import { supabaseSingleRead } from "@/lib/supabase/serverQueryHelper";
import { InvQueryDetail } from "@/types/inv-query-detail";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default async function InvestmentQueryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const investmentQuery = await supabaseSingleRead<InvQueryDetail>({
        table: "investment_queries",
        columns: "*",
        filters: [
            (query) => query.eq("slug", slug)
        ]
    });

    if (!investmentQuery) {
        return <div>Investment query not found</div>;
    }

    return (
        <div className="p-5 max-w-5xl mx-auto">
            <h2>{investmentQuery.title}</h2>
            <div className="flex flex-wrap gap-2 justify-center mb-6">
            <span className="text-sm text-gray-600">Written by <b>IME Capital’s Investor Desk</b> on <b>{formatDate(investmentQuery.created_at)} | Categories: </b></span>
            <Badge>{investmentQuery.query_categories}</Badge>
            </div>
            <p><div dangerouslySetInnerHTML={{ __html: investmentQuery.body }} /></p>
            <div className="text-sm bg-gray-100 p-4 rounded-md my-4">
            IME Capital Investment Queries provide answers to common investor queries that are directly written by IME Capital’s Central Investment Team. This helps ensure centralised, common and transparent communication of our thoughts to all investors (& potential investors) of IME Capital, and helps mitigate against the disparate communication common in the wealth management industry. Please note, that the answers to these queries can be time/market-condition sensitive, or only applicable to specific types of investors.
            </div>
        </div>);
    
    }