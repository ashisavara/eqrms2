import { InvQueryDetail } from "@/types/inv-query-detail";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { notFound } from 'next/navigation';
import { getPublicInvestmentQuerySlugs, getStaticInvestmentQuery } from '@/lib/supabase/serverQueryHelper';
import { generateInvestmentQuerySEO } from '@/lib/seo/helpers/investment-query';
import type { Metadata } from 'next';

// Generate static params for all published investment queries
export async function generateStaticParams() {
    try {
        const investmentQueries = await getPublicInvestmentQuerySlugs();
        return investmentQueries.map((investmentQuery) => ({
            slug: investmentQuery.slug,
        }));
    } catch (error) {
        console.error('Error generating static params for investment queries:', error);
        return [];
    }
}

// Generate SEO metadata for investment queries
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const query = await getStaticInvestmentQuery(slug);
    if (!query) return {};
    return generateInvestmentQuerySEO(query);
}

// ISR: Revalidate every 7 days (604800 seconds)
export const revalidate = 604800; // 7 days

export default async function InvestmentQueryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    console.log('[InvestmentQueryPage] Loading investment query with slug:', slug);

    try {
        console.log('[InvestmentQueryPage] Fetching investment query from database...');
        const investmentQuery = await getStaticInvestmentQuery(slug);

        if (!investmentQuery) {
            console.log('[InvestmentQueryPage] Investment query not found:', slug);
            notFound();
        }
        
        console.log('[InvestmentQueryPage] Investment query found:', investmentQuery.title);

        return (
            <div className="p-5 max-w-5xl mx-auto">
                <h2>{investmentQuery.title}</h2>
                <div className="flex flex-wrap gap-2 justify-center mb-6 text-center">
                <span className="text-sm text-gray-600">Written by <b>IME Capital's Investor Desk</b> on <b>{formatDate(investmentQuery.created_at)} | </b></span>
                <Badge>{investmentQuery.query_categories}</Badge>
                </div>
                <p><div dangerouslySetInnerHTML={{ __html: investmentQuery.body }} /></p>
                <div className="text-sm bg-gray-100 p-4 rounded-md my-4">
                IME Capital Investment Queries provide answers to common investor queries that are directly written by IME Capital's Central Investment Team. This helps ensure centralised, common and transparent communication of our thoughts to all investors (& potential investors) of IME Capital, and helps mitigate against the disparate communication common in the wealth management industry. Please note, that the answers to these queries can be time/market-condition sensitive, or only applicable to specific types of investors.
                </div>
            </div>
        );
    } catch (error) {
        console.error('[InvestmentQueryPage] ERROR loading investment query:', error);
        // Log full error details for debugging
        console.error('[InvestmentQueryPage] Error details:', error instanceof Error ? error.stack : JSON.stringify(error));
        // Show 404 to user (cleaner UX, no technical details exposed)
        notFound();
    }
}