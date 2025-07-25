import SimpleTable from "@/components/tables/singleRowTable";
import { supabaseSingleRead, supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { AssetClass } from "@/types/asset-class-detail";
import { Category } from "@/types/category-detail";
import { TableCategories } from "@/app/categories/TableCategories";
import { columns } from "@/app/categories/columns-categories";
import { annualColumns } from "@/app/categories/columns-catannual";

interface PageProps {
    params: Promise<{slug:string}>;
}


export default async function AssetClassPage({params}: PageProps) {
    const {slug} = await params;
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
                <h1 className="text-2xl font-bold">{assetClass.asset_class_name}</h1>
                <p className="font-bold">{assetClass.asset_class_summary}</p>
                <p>{assetClass.asset_class_desc}</p>
            </div>
            <div>
                <h2> Trailing Returns</h2>
                <TableCategories data={catTrailing}/>
            </div>
            <div>
                <h2> Annual Returns</h2>
                <TableCategories data={catAnnual} columnType="annual"/>
            </div>
        </div>
    );
}