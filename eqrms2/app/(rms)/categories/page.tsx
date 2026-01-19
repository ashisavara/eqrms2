import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { TableCategories } from "@/app/(rms)/categories/TableCategories";
import { Category } from "@/types/category-detail";
import { AssetClass } from "@/types/asset-class-detail";
import { TableAssetClass } from "@/app/(rms)/assetclass/TableAssetclass"
import { Structure } from "@/types/structure-detail";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserRoles } from '@/lib/auth/getUserRoles';
import { PerformanceFootnote } from "@/components/ui/performance-footnote";
import { TableStructure } from "../structure/TableStructure";
import RmsPageTitle from "@/components/uiComponents/rms-page-title";

// Force dynamic rendering to prevent static generation issues with AMC data
export const dynamic = 'force-dynamic';

export default async function FundsPage() {
  const userRoles = await getUserRoles();

  const [Eqcategory, Debtcategory, Hybridcategory, Altcategory, GlobalEqcategory, GlobalDebtcategory, DomesticAssetClass, GlobalAssetClass, DomesticStructure, GlobalStructure] = await Promise.all([
    supabaseListRead<Category>({
      table: "view_rms_category",
      columns: "category_id, cat_name, slug, asset_class_name, one_yr, three_yr, five_yr, cat_summary, rms_show, cy_1, cy_2, cy_3, cy_4, cy_5, cy_6, cy_7, cy_8, cy_9, cy_10, category_stance, category_risk_profile",
      filters: [
        (query) => query.eq('rms_show', true),
        (query) => query.eq('asset_class_name', 'Equity'),  
        (query) => query.order('category_stance', { ascending: false }),
      ]
    }),
    supabaseListRead<Category>({
      table: "view_rms_category",
      columns: "category_id, cat_name, slug, asset_class_name, one_yr, three_yr, five_yr, cat_summary, rms_show, cy_1, cy_2, cy_3, cy_4, cy_5, cy_6, cy_7, cy_8, cy_9, cy_10, category_stance, category_risk_profile",
      filters: [
        (query) => query.eq('rms_show', true),
        (query) => query.eq('asset_class_name', 'Debt'),  
        (query) => query.order('category_stance', { ascending: false }),
      ]
    }),
    supabaseListRead<Category>({
      table: "view_rms_category",
      columns: "category_id, cat_name, slug, asset_class_name, one_yr, three_yr, five_yr, cat_summary, rms_show, cy_1, cy_2, cy_3, cy_4, cy_5, cy_6, cy_7, cy_8, cy_9, cy_10, category_stance, category_risk_profile",
      filters: [
        (query) => query.eq('rms_show', true),
        (query) => query.eq('asset_class_name', 'Hybrid'),  
        (query) => query.order('category_stance', { ascending: false }),
      ]
    }),
    supabaseListRead<Category>({
      table: "view_rms_category",
      columns: "category_id, cat_name, slug, asset_class_name, one_yr, three_yr, five_yr, cat_summary, rms_show, cy_1, cy_2, cy_3, cy_4, cy_5, cy_6, cy_7, cy_8, cy_9, cy_10, category_stance, category_risk_profile",
      filters: [
        (query) => query.eq('rms_show', true),
        (query) => query.eq('asset_class_name', 'Alternatives'),  
        (query) => query.order('category_stance', { ascending: false }),
      ]
    }),
    supabaseListRead<Category>({
      table: "view_rms_category",
      columns: "category_id, cat_name, slug, asset_class_name, one_yr, three_yr, five_yr, cat_summary, rms_show, cy_1, cy_2, cy_3, cy_4, cy_5, cy_6, cy_7, cy_8, cy_9, cy_10, category_stance, category_risk_profile",
      filters: [
        (query) => query.eq('rms_show', true),
        (query) => query.eq('asset_class_name', 'Global - Equity'),  
        (query) => query.order('category_stance', { ascending: false }),
      ]
    }),
    supabaseListRead<Category>({
      table: "view_rms_category",
      columns: "category_id, cat_name, slug, asset_class_name, one_yr, three_yr, five_yr, cat_summary, rms_show, cy_1, cy_2, cy_3, cy_4, cy_5, cy_6, cy_7, cy_8, cy_9, cy_10, category_stance, category_risk_profile",
      filters: [
        (query) => query.eq('rms_show', true),
        (query) => query.in('asset_class_name', ['Global - Debt', 'Global - Alt']),  
        (query) => query.order('category_stance', { ascending: false }),
      ]
    }),
    supabaseListRead<AssetClass>({
      table: "rms_asset_class",
      columns: "asset_class_id, asset_class_name, asset_class_summary, asset_class_desc, asset_class_slug",
      filters: [(query) => query.in('asset_class_name', ['Equity', 'Debt', 'Hybrid', 'Alternatives','Global - Equity', 'Global - Debt', 'Global - Alt'])]
    }),
    supabaseListRead<AssetClass>({
      table: "rms_asset_class",
      columns: "asset_class_id, asset_class_name, asset_class_summary, asset_class_desc, asset_class_slug",
      filters: [(query) => query.in('asset_class_name', ['Global - Equity', 'Global - Debt', 'Global - Alt'])]
    }),
    supabaseListRead<Structure>({
      table: "rms_structure",
      columns: "structure_id, structure_name, structure_summary, structure_desc, structure_slug",
      filters: [(query) => query.in('structure_id', [1, 2, 3, 5,6,7,8])]
    }),
    supabaseListRead<Structure>({
      table: "rms_structure",
      columns: "structure_id, structure_name, structure_summary, structure_desc, structure_slug",
      filters: [(query) => query.in('structure_id', [5])]
    })

  ]);


  return (
    <div>
      <RmsPageTitle 
                title="IME RMS" 
                caption="Direct access to IME Central Research Team's insights across funds, AMC's, asset classes, categories & more." 
            />
        {/* ✅ Top-level filters */}
        <div className="px-4 py-0">
        <Tabs defaultValue="assetclass" className="w-full mx-auto mt-6 text-sm">
            <TabsList className="w-full">
                <TabsTrigger value="assetclass">Asset Classes</TabsTrigger>
                <TabsTrigger value="india">India</TabsTrigger>
                <TabsTrigger value="global">Global</TabsTrigger>
          </TabsList>
                <TabsContent value="assetclass">
                    <h3>Asset Classes</h3>
                    <TableAssetClass data={DomesticAssetClass}/>
                    <h3 className="mt-6">Structures</h3>
                    <TableStructure data={DomesticStructure}/>
                            

                </TabsContent>
                <TabsContent value="india">
                    <Tabs defaultValue="Equity" className="w-full mx-auto mt-2">
                        <TabsList className="w-full">
                            <TabsTrigger value="Equity">Equity</TabsTrigger>
                            <TabsTrigger value="Debt">Debt</TabsTrigger>
                            <TabsTrigger value="Hybrid">Hybrid</TabsTrigger>
                            <TabsTrigger value="Alternatives">Altenatives</TabsTrigger>
                        </TabsList>
                        <TabsContent value="Equity">
                            <h3 className="ime-table-heading"> Trailing Returns </h3>
                            <TableCategories data={Eqcategory} columnType="summary" userRoles={userRoles} />
                            <PerformanceFootnote />
                            <div className="hidden md:block">
                              <h3 className="ime-table-heading mt-6"> Annual Returns </h3>
                              <TableCategories data={Eqcategory} columnType="annual" userRoles={userRoles} />
                            </div>
                        </TabsContent>  
                        <TabsContent value="Debt">
                            <h3 className="ime-table-heading"> Trailing Returns </h3>
                            <TableCategories data={Debtcategory} columnType="summary" userRoles={userRoles} />
                            <PerformanceFootnote />
                            <div className="hidden md:block">
                              <h3 className="ime-table-heading mt-6"> Annual Returns </h3>
                              <TableCategories data={Debtcategory} columnType="annual" userRoles={userRoles} />
                            </div>
                        </TabsContent>
                        <TabsContent value="Hybrid">
                            <h3 className="ime-table-heading"> Trailing Returns </h3>
                            <TableCategories data={Hybridcategory} columnType="summary" userRoles={userRoles} />
                            <PerformanceFootnote />
                            <div className="hidden md:block">
                              <h3 className="ime-table-heading mt-6"> Annual Returns </h3>
                              <TableCategories data={Hybridcategory} columnType="annual" userRoles={userRoles} />
                            </div>
                        </TabsContent>
                        <TabsContent value="Alternatives">
                            <h3 className="ime-table-heading"> Trailing Returns </h3>
                            <TableCategories data={Altcategory} columnType="summary" userRoles={userRoles} />
                            <PerformanceFootnote />
                            <div className="hidden md:block">
                              <h3 className="ime-table-heading mt-6"> Annual Returns </h3>
                              <TableCategories data={Altcategory} columnType="annual" userRoles={userRoles} />
                            </div>
                        </TabsContent>
                    </Tabs>
                </TabsContent>  
                <TabsContent value="global">
                    <Tabs defaultValue="Global-Equity" className="w-full mx-auto mt-2">
                        <TabsList className="w-full">
                            <TabsTrigger value="Global-Equity">Global-Equity</TabsTrigger>
                            <TabsTrigger value="Global-Others">Global-Others</TabsTrigger>
                        </TabsList>
                        <TabsContent value="Global-Equity">
                            <h3 className="ime-table-heading"> Trailing Returns </h3>
                            <TableCategories data={GlobalEqcategory} columnType="summary" userRoles={userRoles} />
                            <div className="hidden md:block">
                              <h3 className="ime-table-heading mt-6"> Annual Returns </h3>
                              <TableCategories data={GlobalEqcategory} columnType="annual" userRoles={userRoles} />
                            </div>
                        </TabsContent>
                        <TabsContent value="Global-Others">
                        <h3 className="ime-table-heading"> Trailing Returns </h3>
                            <TableCategories data={GlobalDebtcategory} columnType="summary" userRoles={userRoles} />
                            <div className="hidden md:block mt-6">
                            <h3 className="ime-table-heading mt-6"> Annual Returns </h3>
                              <TableCategories data={GlobalDebtcategory} columnType="annual" userRoles={userRoles} />
                            </div>
                        </TabsContent>
                    </Tabs>
                </TabsContent>
      </Tabs>
    </div>
     
    </div>
  );
}

