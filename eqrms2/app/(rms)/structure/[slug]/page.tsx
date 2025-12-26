import { supabaseSingleRead, supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { Structure } from "@/types/structure-detail";
import { RmsFundsScreener } from "@/types/funds-detail";
import TableFundScreen from "@/app/(rms)/funds/TableFundScreen";
import { FavouriteHeart } from "@/components/ui/favourite-heart";
import { getUserRoles } from '@/lib/auth/getUserRoles';
import { can } from '@/lib/permissions';
import { redirect } from 'next/navigation';

interface PageProps {
    params: Promise<{slug:string}>;
}


export default async function StructurePage({params}: PageProps) {
    const {slug} = await params;

    const userRoles = await getUserRoles();
  
    // Check permission first
    if (!can(userRoles, 'rms', 'view_detailed')) {
        redirect('/uservalidation'); // or wherever you want to send them
    }

    // First get the structure details
    const structure = await supabaseSingleRead<Structure>({
        table: "rms_structure",
        columns: "structure_id, structure_name, structure_summary, structure_desc, structure_slug",
        filters: [(query) => query.eq('structure_slug', slug)]
    });

    if (!structure) { 
        return(<div>Structure not found</div>);
    }

    // Then fetch funds for this structure
    const funds = await supabaseListRead<RmsFundsScreener>({
        table: "view_rms_funds_screener",
        columns: "fund_id, fund_name, slug, asset_class_name, category_name, structure_name, fund_rating, fund_strategy_rating, fund_performance_rating, one_yr, three_yr, five_yr, since_inception, amc_rating",
        filters: [(query) => query.eq('structure_id', structure.structure_id),
            (query) => query.gt('fund_rating', 3),
            (query) => query.eq('open_for_subscription', 'Y'),
            (query) => query.order('fund_rating', {ascending: false})]
    });

    return (
        <div>
            <div className="pageHeadingBox">
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-4">
                        <h1>{structure.structure_name}</h1>
                        <FavouriteHeart entityType="structure" entityId={structure.structure_id}  size="lg" />
                    </div>
                </div>
                <p className="font-bold">{structure.structure_summary}</p>
                <p className="text-sm">{structure.structure_desc}</p>
            </div>
            <div>
                <h3>Recommended {structure.structure_name} Funds</h3>
                <TableFundScreen data={funds} userRoles={userRoles} />
            </div>
        </div>
    );
}

