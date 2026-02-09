import { RmsFundAmc } from "@/types/funds-detail";
import { notFound } from 'next/navigation';
import { getPublicPmsSchemeSlugs, getStaticPmsScheme } from '@/lib/supabase/serverQueryHelper';
import { generateFundSEO } from '@/lib/seo/helpers/fund';
import type { Metadata } from 'next';
import RmaCta from "@/components/uiComponents/rma-cta";
import PageTitle from "@/components/uiComponents/page-title";
import { PublicFundRatingUpgrade, PublicAmcRatingUpgrade } from "@/components/uiComponents/rating-rationales";

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
            <div>
                <PageTitle title={pmsScheme.fund_name} caption="Our view on the fund, the AMC, the strategy, the performance & the investment team." />
            <div className="px-2 md:px-5 max-w-5xl mx-auto">
                
                <h2 className="mt-6 mb-0">IME's Review of {pmsScheme.fund_name}</h2>
                <div className="border-box !mt-0 ime-fund-view-box">
                <PublicFundRatingUpgrade />
                    <p className="font-semibold border-b border-gray-300">View on the Fund</p>
                    <p>{pmsScheme.investment_view}</p>
                    <p className="font-semibold pt-6 border-b border-gray-300">Strategy</p>
                    <p>{pmsScheme.strategy_name}</p>
                    <p className="font-semibold pt-6 border-b border-gray-300">Fund's Strategy View</p>
                    <p>{pmsScheme.strategy_view}</p>
                    {pmsScheme.performance_view && (<>
                    <p className="font-semibold pt-6 border-b border-gray-300">Fund Performance</p>
                    <p>{pmsScheme.performance_view}</p>
                    </>
                    )}
                </div>
                <h2>Trailing Performance</h2>
                {pmsScheme.trailing_perf_html && <div dangerouslySetInnerHTML={{ __html: pmsScheme.trailing_perf_html }} />}
                <h2>Investment team</h2>
                {pmsScheme.amc_fm_html && <div className="px-4 md:px-6" dangerouslySetInnerHTML={{ __html: pmsScheme.amc_fm_html }} />}


                <h2 className="mt-6 mb-0">IME's Review of {pmsScheme.amc_name}</h2>
                
                <div className="border-box !mt-0 ime-fund-view-box">
                <PublicAmcRatingUpgrade />
                    
                    <p className="font-semibold border-b border-gray-300">View on AMC</p>
                    <p>{pmsScheme.amc_view}</p>
                    <p className="font-semibold pt-6 border-b border-gray-300">AMC's Pedigree</p>
                    <p>{pmsScheme.amc_pedigree_desc}</p>
                    <p className="font-semibold pt-6 border-b border-gray-300">AMC Team</p>
                    <p>{pmsScheme.team_pedigree_desc}</p>
                    {pmsScheme.performance_view && (<>
                    <p className="font-semibold pt-6 border-b border-gray-300">Investment Philosophy</p>
                    <p>{pmsScheme.inv_phil_desc}</p>
                    </>
                    )}
                </div>
                {pmsScheme.fund_body && <div className="rms-body" dangerouslySetInnerHTML={{ __html: pmsScheme.fund_body }} />}
                {pmsScheme.amc_body && <div className="rms-body" dangerouslySetInnerHTML={{ __html: pmsScheme.amc_body }} />}
                
                <div className="py-12">
                    <h2>Experience the benefits of working with a 'research-first' investments firm</h2>
                    <RmaCta />
                </div>
            </div>
            </div>
        );
    } catch (error) {
        console.error('[PmsSchemePage] ERROR loading PMS scheme:', error);
        // Log full error details for debugging
        console.error('[PmsSchemePage] Error details:', error instanceof Error ? error.stack : JSON.stringify(error));
        // Show 404 to user (cleaner UX, no technical details exposed)
        notFound();
    }
}