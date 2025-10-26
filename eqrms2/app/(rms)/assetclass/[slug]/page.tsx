import { supabaseSingleRead, supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { AssetClass } from "@/types/asset-class-detail";
import { Category } from "@/types/category-detail";
import { TableCategories } from "@/app/(rms)/categories/TableCategories";
import { EditAssetClassButton } from "@/components/forms/EditAssetClass";
import { FavouriteHeart } from "@/components/ui/favourite-heart";
import { getUserRoles } from '@/lib/auth/getUserRoles';
import { can } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import { PerformanceFootnote } from "@/components/ui/performance-footnote";

interface PageProps {
    params: Promise<{slug:string}>;
}


export default async function AssetClassPage({params}: PageProps) {
    const {slug} = await params;

    const userRoles = await getUserRoles();
  
    // Check permission first
    if (!can(userRoles, 'rms', 'view_detailed')) {
        redirect('/uservalidation'); // or wherever you want to send them
    }

    const [assetClass, catTrailing, catAnnual] = await Promise.all([
        supabaseSingleRead<AssetClass>({
            table: "rms_asset_class",
            columns: "asset_class_id, asset_class_name, asset_class_summary, asset_class_desc, asset_class_slug",
            filters: [(query) => query.eq('asset_class_slug', slug)]
        }),
        supabaseListRead<Category>({
            table: "view_rms_category",
            columns: "category_id, cat_name, slug, asset_class_name, one_yr, three_yr, five_yr, cat_summary, rms_show",
            filters: [(query) => query.eq('asset_class_slug', slug)]
        }),
        supabaseListRead<Category>({
            table: "view_rms_category",
            columns: "category_id, cat_name, slug, cy_1, cy_2, cy_3, cy_4, cy_5, cy_6, cy_7, cy_8, cy_9, cy_10",
            filters: [(query) => query.eq('asset_class_slug', slug)]
        }) 
    ]);

    if (!assetClass) { return(<div>Asset Class not found</div>);}

    return (
        <div>
            <div className="pageHeadingBox">
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-4">
                        <h1>{assetClass.asset_class_name}</h1>
                        <FavouriteHeart entityType="asset_class" entityId={assetClass.asset_class_id}  size="lg" />
                    </div>
                </div>
                <span className="font-bold">{assetClass.asset_class_summary} | </span>
                {(can(userRoles, 'rms', 'edit_rms')) && (
                    <EditAssetClassButton assetClassData={assetClass} assetClassId={assetClass.asset_class_id} />
                )}
            </div>
            <p className="text-sm">{assetClass.asset_class_desc}</p>
            <div>
                <h2> Trailing Returns</h2>
                <TableCategories data={catTrailing}/>
                <PerformanceFootnote additionalText="Category returns are average returns for all funds in category." />
            </div>
            <div className="hidden md:block md:mt-6">
                <h2> Annual Returns</h2>
                <TableCategories data={catAnnual} columnType="annual"/>
            </div>
        </div>
    );
}