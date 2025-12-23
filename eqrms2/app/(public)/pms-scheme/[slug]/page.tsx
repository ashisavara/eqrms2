import { RmsFundAmc } from "@/types/funds-detail";
import { notFound } from 'next/navigation';
import { getPublicPmsSchemeSlugs, getStaticPmsScheme } from '@/lib/supabase/serverQueryHelper';
import { generateFundSEO } from '@/lib/seo/helpers/fund';
import type { Metadata } from 'next';
import RmaCta from "@/components/uiComponents/rma-cta";

// Generate static params for all published PMS schemes
export async function generateStaticParams() {
    try {
        const pmsSchemes = await getPublicPmsSchemeSlugs();
        return pmsSchemes.map((pmsScheme) => ({
            slug: pmsScheme.slug,
        }));
    } catch (error) {
        console.error('Error generating static params for PMS schemes:', error);
        return [];
    }
}

// Generate SEO metadata for PMS schemes
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const fund = await getStaticPmsScheme(slug);
    if (!fund) return {};
    return generateFundSEO(fund);
}

// ISR: Revalidate every 7 days (604800 seconds)
export const revalidate = 604800; // 7 days

export default async function PmsSchemePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    console.log('[PmsSchemePage] Loading PMS scheme with slug:', slug);

    try {
        console.log('[PmsSchemePage] Fetching PMS scheme from database...');
        const pmsScheme = await getStaticPmsScheme(slug);

        if (!pmsScheme) {
            console.log('[PmsSchemePage] PMS scheme not found:', slug);
            notFound();
        }
        
        console.log('[PmsSchemePage] PMS scheme found:', pmsScheme.fund_name);

        return (
            <div className="p-5 max-w-5xl mx-auto">
                <div className="pageHeadingBox">
                    <h1>{pmsScheme.fund_name}</h1>
                    <span>{pmsScheme.amc_name} | {pmsScheme.asset_class_name} | {pmsScheme.category_name} | {pmsScheme.structure_name}</span>
                </div>
                <div className="border-box ime-fund-view-box">
                    <h2>IME's View on {pmsScheme.fund_name}</h2>
                    <p className="font-semibold">Strategy</p>
                    <p>{pmsScheme.strategy_name}</p>
                    <p className="font-semibold pt-6">Investment Fund</p>
                    <p>{pmsScheme.investment_view}</p>
                    <p className="font-semibold pt-6">Fund's Strategy View</p>
                    <p>{pmsScheme.strategy_view}</p>
                    {pmsScheme.performance_view && (<>
                    <p className="font-semibold pt-6">Fund Performance</p>
                    <p>{pmsScheme.performance_view}</p>
                    </>
                    )}
                </div>

                <div className="border-box mt-12 ime-fund-view-box">
                    <h2>IME's View on {pmsScheme.amc_name}</h2>
                    <p className="font-semibold">View on AMC</p>
                    <p>{pmsScheme.amc_view}</p>
                    <p className="font-semibold pt-6">AMC's Pedigree</p>
                    <p>{pmsScheme.amc_pedigree_desc}</p>
                    <p className="font-semibold pt-6">AMC Team</p>
                    <p>{pmsScheme.team_pedigree_desc}</p>
                    {pmsScheme.performance_view && (<>
                    <p className="font-semibold pt-6">Investment Philosophy</p>
                    <p>{pmsScheme.inv_phil_desc}</p>
                    </>
                    )}
                </div>
                {pmsScheme.fund_body && <div dangerouslySetInnerHTML={{ __html: pmsScheme.fund_body }} />}
                <h2>Trailing Performance</h2>
                {pmsScheme.trailing_perf_html && <div dangerouslySetInnerHTML={{ __html: pmsScheme.trailing_perf_html }} />}
                <h2>Investment team</h2>
                {pmsScheme.amc_fm_html && <div dangerouslySetInnerHTML={{ __html: pmsScheme.amc_fm_html }} />}
                <div className="py-12">
                    <h2>Experience the benefits of working with a 'research-first' investments firm</h2>
                    <RmaCta />
                </div>
            </div>
        );
    } catch (error) {
        console.error('[PmsSchemePage] ERROR loading PMS scheme:', error);
        return <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-red-600">Error loading PMS scheme</h1>
            <p>There was an error loading this PMS scheme. Please try again later.</p>
            <pre className="mt-4 text-sm bg-gray-100 p-4 rounded overflow-auto">
                {error instanceof Error ? error.message : JSON.stringify(error)}
            </pre>
        </div>;
    }
}