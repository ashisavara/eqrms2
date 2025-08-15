import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TableCategories } from "./TableCategories";
import { supabaseListRead, supabaseSingleRead } from "@/lib/supabase/serverQueryHelper";
import { Category } from "@/types/category-detail";
import { AssetClass } from "@/types/asset-class-detail";
import { TableAssetClass } from "../assetclass/TableAssetclass";

export default async function CategoriesPage() {
  // Fetch all category data in parallel for better performance
  const [Eqcategory, Debtcategory, Hybridcategory, Altcategory, GlobalEqcategory, GlobalDebtcategory, GlobalAltcategory, DomesticAssetClass, GlobalAssetClass] = await Promise.all([
    supabaseListRead<Category>({
      table: "view_rms_category",
      columns: "category_id, cat_name, slug, asset_class_name, one_yr, three_yr, five_yr, cat_summary, rms_show",
      filters: [
        (query) => query.eq('rms_show', true),
        (query) => query.eq('asset_class_name', 'Equity'),  
        (query) => query.order('five_yr', { ascending: false }),
      ]
    }),
    supabaseListRead<Category>({
      table: "view_rms_category",
      columns: "category_id, cat_name, slug, asset_class_name, one_yr, three_yr, five_yr, cat_summary, rms_show",
      filters: [
        (query) => query.eq('rms_show', true),
        (query) => query.eq('asset_class_name', 'Debt'),  
        (query) => query.order('five_yr', { ascending: false }),
      ]
    }),
    supabaseListRead<Category>({
      table: "view_rms_category",
      columns: "category_id, cat_name, slug, asset_class_name, one_yr, three_yr, five_yr, cat_summary, rms_show",
      filters: [
        (query) => query.eq('rms_show', true),
        (query) => query.eq('asset_class_name', 'Hybrid'),  
        (query) => query.order('five_yr', { ascending: false }),
      ]
    }),
    supabaseListRead<Category>({
      table: "view_rms_category",
      columns: "category_id, cat_name, slug, asset_class_name, one_yr, three_yr, five_yr, cat_summary, rms_show",
      filters: [
        (query) => query.eq('rms_show', true),
        (query) => query.eq('asset_class_name', 'Alternatives'),  
        (query) => query.order('five_yr', { ascending: false }),
      ]
    }),
    supabaseListRead<Category>({
      table: "view_rms_category",
      columns: "category_id, cat_name, slug, asset_class_name, one_yr, three_yr, five_yr, cat_summary, rms_show",
      filters: [
        (query) => query.eq('rms_show', true),
        (query) => query.eq('asset_class_name', 'Global - Equity'),  
        (query) => query.order('five_yr', { ascending: false }),
      ]
    }),
    supabaseListRead<Category>({
      table: "view_rms_category",
      columns: "category_id, cat_name, slug, asset_class_name, one_yr, three_yr, five_yr, cat_summary, rms_show",
      filters: [
        (query) => query.eq('rms_show', true),
        (query) => query.eq('asset_class_name', 'Global - Debt'),  
        (query) => query.order('five_yr', { ascending: false }),
      ]
    }),
    supabaseListRead<Category>({
      table: "view_rms_category",
      columns: "category_id, cat_name, slug, asset_class_name, one_yr, three_yr, five_yr, cat_summary, rms_show",
      filters: [
        (query) => query.eq('rms_show', true),
        (query) => query.eq('asset_class_name', 'Global - Alt'),  
        (query) => query.order('five_yr', { ascending: false }),
      ]
    }),
    supabaseListRead<AssetClass>({
      table: "rms_asset_class",
      columns: "asset_class_id, asset_class_name, asset_class_summary, asset_class_desc, asset_class_slug",
      filters: [(query) => query.in('asset_class_name', ['Equity', 'Debt', 'Hybrid', 'Alternatives'])]
    }),
    supabaseListRead<AssetClass>({
      table: "rms_asset_class",
      columns: "asset_class_id, asset_class_name, asset_class_summary, asset_class_desc, asset_class_slug",
      filters: [(query) => query.in('asset_class_name', ['Global - Equity', 'Global - Debt', 'Global - Alt'])]
    })
  ]);

  return (
    <div>
        <div className="pageHeadingBox"><h1>Domestic Categories</h1></div>
        <Tabs defaultValue="Asset Class" className="w-full mx-auto mt-6">
            <TabsList className="w-full">
                <TabsTrigger value="Asset Class">Asset Class</TabsTrigger>
                <TabsTrigger value="Equity">Equity</TabsTrigger>
                <TabsTrigger value="Debt">Debt</TabsTrigger>
                <TabsTrigger value="Hybrid">Hybrid</TabsTrigger>
                <TabsTrigger value="Alternatives">Altenatives</TabsTrigger>
            </TabsList>
            <TabsContent value="Asset Class">
                <TableAssetClass data={DomesticAssetClass}/>
            </TabsContent> 
            <TabsContent value="Equity">
                <TableCategories data={Eqcategory}/>
            </TabsContent>  
            <TabsContent value="Debt">
                <TableCategories data={Debtcategory}/>
            </TabsContent>
            <TabsContent value="Hybrid">
                <TableCategories data={Hybridcategory}/>
            </TabsContent>
            <TabsContent value="Alternatives">
                <TableCategories data={Altcategory}/>
            </TabsContent>
        </Tabs>
        <div className="pageHeadingBox !mt-10"><h1>Global Categories</h1></div>
        <Tabs defaultValue="Global-Assets" className="w-full mx-auto mt-6">
            <TabsList className="w-full">
              <TabsTrigger value="Global-Assets">Global Assets</TabsTrigger>
                <TabsTrigger value="Global-Equity">Global-Equity</TabsTrigger>
                <TabsTrigger value="Global-Debt">Global-Debt</TabsTrigger>
                <TabsTrigger value="Global-Alt">Global-Alt</TabsTrigger>
            </TabsList>
            <TabsContent value="Global-Assets">
                <TableAssetClass data={GlobalAssetClass}/>
            </TabsContent>
            <TabsContent value="Global-Equity">
                <TableCategories data={GlobalEqcategory}/>
            </TabsContent>
            <TabsContent value="Global-Debt">
                <TableCategories data={GlobalDebtcategory}/>
            </TabsContent>
            <TabsContent value="Global-Alt">
                <TableCategories data={GlobalAltcategory}/>
            </TabsContent>
        </Tabs>
    </div>
  );
}
