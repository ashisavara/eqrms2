import { AMC } from "@/types/amc-detail";
import { RmsPublicFundsOfAmc  } from "@/types/funds-detail-public";
import FundPerformanceTable from "@/components/tables/FundPerformanceTable";
import { notFound } from 'next/navigation';
import { getPublicPmsAmcSlugs, getStaticPmsAmc, getStaticPmsAmcFunds } from '@/lib/supabase/serverQueryHelper';
import { generateAmcSEO } from '@/lib/seo/helpers/amc';
import type { Metadata } from 'next';

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
                <div className="border-box">
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
            </div>
        );
    } catch (error) {
        console.error('[PmsAmcPage] ERROR loading PMS AMC:', error);
        return <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-red-600">Error loading PMS AMC</h1>
            <p>There was an error loading this PMS AMC. Please try again later.</p>
            <pre className="mt-4 text-sm bg-gray-100 p-4 rounded overflow-auto">
                {error instanceof Error ? error.message : JSON.stringify(error)}
            </pre>
        </div>;
    }
}