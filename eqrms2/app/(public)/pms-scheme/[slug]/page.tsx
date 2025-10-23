import { supabaseSingleRead } from "@/lib/supabase/serverQueryHelper";
import { RmsFundAmc } from "@/types/funds-detail";

export default async function PmsSchemePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const pmsScheme = await supabaseSingleRead<RmsFundAmc>({
        table: "v_public_rms_funds",
        columns: "*",
        filters: [
            (query) => query.eq("slug", slug)
        ]
    });

    if (!pmsScheme) {
        return <div>PMS Scheme not found</div>;
    }

    return (
    <div className="p-5 max-w-5xl mx-auto">
        <div className="pageHeadingBox">
            <h1>{pmsScheme.fund_name}</h1>
            <span>{pmsScheme.amc_name} | {pmsScheme.asset_class_name} | {pmsScheme.category_name} | {pmsScheme.structure_name}</span>
        </div>
        <div className="border-box">
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

        <div className="border-box mt-12">
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
    </div>
)};