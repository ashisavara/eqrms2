import { AMC } from "@/types/amc-detail";
import { RmsPublicFundsOfAmc  } from "@/types/funds-detail-public";
import FundPerformanceTable from "@/components/tables/FundPerformanceTable";
import { notFound } from 'next/navigation';
import { getPublicPmsAmcSlugs, getStaticPmsAmc, getStaticPmsAmcFunds } from '@/lib/supabase/serverQueryHelper';
import { generateAmcSEO } from '@/lib/seo/helpers/amc';
import type { Metadata } from 'next';
import RmaCta from "@/components/uiComponents/rma-cta";


// Generate static params for all published PMS AMCs
export async function generateStaticParams() {
    try {
        const pmsAmcs = await getPublicPmsAmcSlugs();
        return pmsAmcs.map((pmsAmc) => ({
            slug: pmsAmc.slug,
        }));
    } catch (error) {
        console.error('Error generating static params for PMS AMCs:', error);
        return [];
    }
}

// Generate SEO metadata for PMS AMCs
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const amc = await getStaticPmsAmc(slug);
    if (!amc) return {};
    return generateAmcSEO(amc);
}

// ISR: Revalidate every 7 days (604800 seconds)
export const revalidate = 604800; // 7 days

export default async function PmsSchemePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    console.log('[PmsAmcPage] Loading PMS AMC with slug:', slug);

    try {
        console.log('[PmsAmcPage] Fetching PMS AMC from database...');
        const [amc, funds] = await Promise.all([
            getStaticPmsAmc(slug),
            getStaticPmsAmcFunds(slug)
        ]);

        if (!amc) {
            console.log('[PmsAmcPage] PMS AMC not found:', slug);
            notFound();
        }
        
        console.log('[PmsAmcPage] PMS AMC found:', amc.amc_name);

        return (
            <div className="p-5 max-w-5xl mx-auto">
                <div className="pageHeadingBox">
                    <h1>{amc.amc_name}</h1>
                    <span>{amc.structure} </span>
                </div>
                <div className="border-box ime-fund-view-box">
                    <h2>IME's View on {amc.amc_name}</h2>
                    <p className="font-semibold">AMC View</p>
                    <p>{amc.amc_view}</p>
                    <p className="font-semibold pt-6">AMC Pedigree</p>
                    <p>{amc.amc_pedigree_desc}</p>
                    <p className="font-semibold pt-6">Team Pedigree</p>
                    <p>{amc.team_pedigree_desc}</p>
                    {amc.inv_phil_desc && (<>
                    <p className="font-semibold pt-6">Investment Philosophy</p>
                    <p>{amc.inv_phil_desc}</p>
                    </>
                    )}
                </div>

                {amc.amc_body && <div dangerouslySetInnerHTML={{ __html: amc.amc_body }} />}
                <h2>Investment team</h2>
                {amc.amc_fm_html && <div dangerouslySetInnerHTML={{ __html: amc.amc_fm_html }} />}

                <h2>Recommended Funds</h2>
                <FundPerformanceTable data={funds} />
                <div className="py-12">
                    <h2>Experience the benefits of working with a 'research-first' investments firm</h2>
                    <RmaCta />
                </div>
            </div>
        );
    } catch (error) {
        console.error('[PmsAmcPage] ERROR loading PMS AMC:', error);
        // Log full error details for debugging
        console.error('[PmsAmcPage] Error details:', error instanceof Error ? error.stack : JSON.stringify(error));
        // Show 404 to user (cleaner UX, no technical details exposed)
        notFound();
    }
}