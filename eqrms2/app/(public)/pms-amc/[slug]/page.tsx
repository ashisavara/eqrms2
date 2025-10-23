import { supabaseSingleRead, supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { AMC } from "@/types/amc-detail";
import { RmsPublicFundsOfAmc  } from "@/types/funds-detail-public";
import FundPerformanceTable from "@/components/tables/FundPerformanceTable";


export default async function PmsSchemePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const [amc,funds] = await Promise.all([
        supabaseSingleRead<AMC>({
            table: "v_public_rms_amc",
            columns: "*",
            filters: [
                (query) => query.eq("slug", slug)
            ]
        }),
        supabaseListRead<RmsPublicFundsOfAmc>({
            table: "v_public_rms_funds",
            columns: "*",
            filters: [
                (query) => query.eq("amc_slug", slug)
            ]
        })
    ])

    if (!amc) {
        return <div>AMC not found</div>;
    }

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
)};