import { InvQueryDetail } from "@/types/inv-query-detail";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { notFound } from 'next/navigation';
import { supabaseSingleRead } from '@/lib/supabase/serverQueryHelper';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Force dynamic rendering for internal pages
export const dynamic = 'force-dynamic';

export default async function InvestmentQueryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const queryId = parseInt(id, 10);
    
    if (isNaN(queryId)) {
        notFound();
    }

    try {
        const investmentQuery = await supabaseSingleRead<InvQueryDetail>({
            table: "investment_queries",
            columns: "*",
            filters: [
                (query) => query.eq("query_id", queryId)
            ],
        });

        if (!investmentQuery) {
            notFound();
        }

        return (
            <div className="max-w-4xl mx-auto px-6 md:px-0 pt-5">
                {/* Edit Button */}
                <div className="mb-4 flex justify-end">
                    <Link href={`/internal/public-site/investment-query/edit/${queryId}`}>
                        <Button variant="outline" className="bg-blue-500 hover:bg-blue-600 text-white">
                            Edit Investment Query
                        </Button>
                    </Link>
                </div>

                {/* Investment Query Content */}
                <h1 className="text-3xl font-bold mb-2 text-gray-600">{investmentQuery.title}</h1>
                <div className="flex flex-row justify-center mb-4">
                    <Badge variant="secondary">{investmentQuery.query_categories}</Badge>
                    <span className="text-sm text-gray-500 ml-2">| Created on {formatDate(investmentQuery.created_at)}</span>
                </div>

                <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap">{investmentQuery.body}</p>
                </div>
            </div>
        );
    } catch (error) {
        console.error('[InvestmentQueryPage] ERROR loading investment query:', error);
        return (
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-2xl font-bold text-red-600">Error loading investment query</h1>
                <p>There was an error loading this investment query. Please try again later.</p>
                <pre className="mt-4 text-sm bg-gray-100 p-4 rounded overflow-auto">
                    {error instanceof Error ? error.message : JSON.stringify(error)}
                </pre>
            </div>
        );
    }
}

