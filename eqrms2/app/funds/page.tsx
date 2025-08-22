import { ReactTableWrapper } from "@/components/data-table/ReactTableWrapper";
import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { RmsFundsScreener } from "@/types/funds-detail";
import TableFundScreen from "./TableFundScreen";
import { TableAmcScreen } from "@/app/amc/TableAmcScreen";
import { AMC } from "@/types/amc-detail";
import { TableCategories } from "@/app/categories/TableCategories";
import { Category } from "@/types/category-detail";
import { AssetClass } from "@/types/asset-class-detail";
import { TableAssetClass } from "@/app/assetclass/TableAssetclass"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Force dynamic rendering to prevent static generation issues with AMC data
export const dynamic = 'force-dynamic';

export default async function FundsPage() {

  const [funds, amc, Eqcategory, Debtcategory, Hybridcategory, Altcategory, GlobalEqcategory, GlobalDebtcategory, GlobalAltcategory, DomesticAssetClass, GlobalAssetClass] = await Promise.all([
    supabaseListRead<RmsFundsScreener>({
      table: "view_rms_funds_screener",
      columns: "fund_id,fund_name,fund_rating,fund_performance_rating,amc_name,amc_rating,asset_class_name,category_name,cat_long_name,structure_name,open_for_subscription, estate_duty_exposure,us_investors,one_yr,three_yr,five_yr,since_inception,slug",
      filters: [
        (query) => query.eq('open_for_subscription', 'Y'),
        (query) => query.gte('fund_rating', 3)
      ]
    }),
    supabaseListRead<AMC>({
      table: "rms_amc",
      columns: "id, amc_name, structure, amc_rating, amc_size_rating, amc_pedigree_rating, amc_team_rating, amc_philosophy_rating, open_for_distribution, us_investor_tagging, aum, slug ",
      filters: [
        (query) => query.eq('open_for_distribution', ['Y']),
        (query) => query.order('amc_rating', { ascending: false })
      ]
    }),
    supabaseListRead<Category>({
      table: "view_rms_category",
      columns: "category_id, cat_name, slug, asset_class_name, one_yr, three_yr, five_yr, cat_summary, rms_show, cy_1, cy_2, cy_3, cy_4, cy_5, cy_6, cy_7, cy_8, cy_9, cy_10",
      filters: [
        (query) => query.eq('rms_show', true),
        (query) => query.eq('asset_class_name', 'Equity'),  
        (query) => query.order('five_yr', { ascending: false }),
      ]
    }),
    supabaseListRead<Category>({
      table: "view_rms_category",
      columns: "category_id, cat_name, slug, asset_class_name, one_yr, three_yr, five_yr, cat_summary, rms_show, cy_1, cy_2, cy_3, cy_4, cy_5, cy_6, cy_7, cy_8, cy_9, cy_10",
      filters: [
        (query) => query.eq('rms_show', true),
        (query) => query.eq('asset_class_name', 'Debt'),  
        (query) => query.order('five_yr', { ascending: false }),
      ]
    }),
    supabaseListRead<Category>({
      table: "view_rms_category",
      columns: "category_id, cat_name, slug, asset_class_name, one_yr, three_yr, five_yr, cat_summary, rms_show, cy_1, cy_2, cy_3, cy_4, cy_5, cy_6, cy_7, cy_8, cy_9, cy_10",
      filters: [
        (query) => query.eq('rms_show', true),
        (query) => query.eq('asset_class_name', 'Hybrid'),  
        (query) => query.order('five_yr', { ascending: false }),
      ]
    }),
    supabaseListRead<Category>({
      table: "view_rms_category",
      columns: "category_id, cat_name, slug, asset_class_name, one_yr, three_yr, five_yr, cat_summary, rms_show, cy_1, cy_2, cy_3, cy_4, cy_5, cy_6, cy_7, cy_8, cy_9, cy_10",
      filters: [
        (query) => query.eq('rms_show', true),
        (query) => query.eq('asset_class_name', 'Alternatives'),  
        (query) => query.order('five_yr', { ascending: false }),
      ]
    }),
    supabaseListRead<Category>({
      table: "view_rms_category",
      columns: "category_id, cat_name, slug, asset_class_name, one_yr, three_yr, five_yr, cat_summary, rms_show, cy_1, cy_2, cy_3, cy_4, cy_5, cy_6, cy_7, cy_8, cy_9, cy_10",
      filters: [
        (query) => query.eq('rms_show', true),
        (query) => query.eq('asset_class_name', 'Global - Equity'),  
        (query) => query.order('five_yr', { ascending: false }),
      ]
    }),
    supabaseListRead<Category>({
      table: "view_rms_category",
      columns: "category_id, cat_name, slug, asset_class_name, one_yr, three_yr, five_yr, cat_summary, rms_show, cy_1, cy_2, cy_3, cy_4, cy_5, cy_6, cy_7, cy_8, cy_9, cy_10",
      filters: [
        (query) => query.eq('rms_show', true),
        (query) => query.eq('asset_class_name', 'Global - Debt'),  
        (query) => query.order('five_yr', { ascending: false }),
      ]
    }),
    supabaseListRead<Category>({
      table: "view_rms_category",
      columns: "category_id, cat_name, slug, asset_class_name, one_yr, three_yr, five_yr, cat_summary, rms_show, cy_1, cy_2, cy_3, cy_4, cy_5, cy_6, cy_7, cy_8, cy_9, cy_10",
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
        <Tabs defaultValue="funds" className="w-full mx-auto mt-6 text-sm">
            <TabsList className="w-full">
                <TabsTrigger value="funds">Funds</TabsTrigger>
                <TabsTrigger value="amc">AMCs</TabsTrigger>
                <TabsTrigger value="india">India</TabsTrigger>
                <TabsTrigger value="global">Global</TabsTrigger>
          </TabsList>
                <TabsContent value="funds">
                    <TableFundScreen data={funds} />
                </TabsContent>
                <TabsContent value="amc">
                  <TableAmcScreen data={amc}/>
                </TabsContent>
                <TabsContent value="india">
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
                            <h3 className="ime-table-heading"> Trailing Returns </h3>
                            <TableCategories data={Eqcategory} columnType="summary"/>
                            <h3 className="ime-table-heading"> Annual Returns </h3>
                            <TableCategories data={Eqcategory} columnType="annual"/>
                        </TabsContent>  
                        <TabsContent value="Debt">
                            <h3 className="ime-table-heading"> Trailing Returns </h3>
                            <TableCategories data={Debtcategory} columnType="summary"/>
                            <h3 className="ime-table-heading"> Annual Returns </h3>
                            <TableCategories data={Debtcategory} columnType="annual"/>
                        </TabsContent>
                        <TabsContent value="Hybrid">
                            <h3 className="ime-table-heading"> Trailing Returns </h3>
                            <TableCategories data={Hybridcategory} columnType="summary"/>
                            <h3 className="ime-table-heading"> Annual Returns </h3>
                            <TableCategories data={Hybridcategory} columnType="annual"/>
                        </TabsContent>
                        <TabsContent value="Alternatives">
                            <h3 className="ime-table-heading"> Trailing Returns </h3>
                            <TableCategories data={Altcategory} columnType="summary"/>
                            <h3 className="ime-table-heading"> Annual Returns </h3>
                            <TableCategories data={Altcategory} columnType="annual"/>
                        </TabsContent>
                    </Tabs>
                </TabsContent>  
                <TabsContent value="global">
                    <Tabs defaultValue="Global-Assets" className="w-full mx-auto mt-6">
                        <TabsList className="w-full">
                          <TabsTrigger value="Global-Assets">Global Assets</TabsTrigger>
                            <TabsTrigger value="Global-Equity">Global-Equity</TabsTrigger>
                            <TabsTrigger value="Global-Others">Global-Others</TabsTrigger>
                        </TabsList>
                        <TabsContent value="Global-Assets">
                            <TableAssetClass data={GlobalAssetClass}/>
                        </TabsContent>
                        <TabsContent value="Global-Equity">
                            <h3 className="ime-table-heading"> Trailing Returns </h3>
                            <TableCategories data={GlobalEqcategory} columnType="summary"/>
                            <h3 className="ime-table-heading"> Annual Returns </h3>
                            <TableCategories data={GlobalEqcategory} columnType="annual"/>
                        </TabsContent>
                        <TabsContent value="Global-Others">
                            <h3 className="text-base font-bold text-center text-gray-500 p-5">Global Debt</h3>
                            <TableCategories data={GlobalDebtcategory} columnType="summary"/>
                            <h3 className="ime-table-heading"> Annual Returns </h3>
                            <TableCategories data={GlobalDebtcategory} columnType="annual"/>
                            <h3 className="text-base font-bold text-center text-gray-500 p-5">Global Alternatives</h3>
                            <TableCategories data={GlobalAltcategory} columnType="summary"/>
                            <h3 className="ime-table-heading"> Annual Returns </h3>
                            <TableCategories data={GlobalAltcategory} columnType="annual"/>
                        </TabsContent>
                    </Tabs>
                </TabsContent>
      </Tabs>





     
    </div>
  );
}

