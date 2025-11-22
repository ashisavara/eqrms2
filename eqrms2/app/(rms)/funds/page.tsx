import { ReactTableWrapper } from "@/components/data-table/ReactTableWrapper";
import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { RmsFundsScreener } from "@/types/funds-detail";
import TableFundScreen from "./TableFundScreen";
import { TableAmcScreen } from "@/app/(rms)/amc/TableAmcScreen";
import { AMC } from "@/types/amc-detail";
import { TableCategories } from "@/app/(rms)/categories/TableCategories";
import { Category } from "@/types/category-detail";
import { AssetClass } from "@/types/asset-class-detail";
import { TableAssetClass } from "@/app/(rms)/assetclass/TableAssetclass"
import { Structure } from "@/types/structure-detail";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserRoles } from '@/lib/auth/getUserRoles';
import { can } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import { PerformanceFootnote } from "@/components/ui/performance-footnote";
import { TableStructure } from "../structure/TableStructure";

// Force dynamic rendering to prevent static generation issues with AMC data
export const dynamic = 'force-dynamic';

export default async function FundsPage() {
  const userRoles = await getUserRoles();
  
  // Check permission first
  if (!can(userRoles, 'rms', 'view_detailed')) {
    redirect('/uservalidation'); // or wherever you want to send them
  }

  const [funds, mfAmc, pmsAmc, globalAmc, Eqcategory, Debtcategory, Hybridcategory, Altcategory, GlobalEqcategory, GlobalDebtcategory, GlobalAltcategory, DomesticAssetClass, GlobalAssetClass, DomesticStructure, GlobalStructure] = await Promise.all([
    supabaseListRead<RmsFundsScreener>({
      table: "view_rms_funds_screener",
      columns: "fund_id,fund_name,fund_rating,fund_performance_rating,amc_name,amc_rating,asset_class_name,category_name,cat_long_name,structure_name,open_for_subscription, estate_duty_exposure,us_investors,one_yr,three_yr,five_yr,since_inception,slug",
      filters: [
        (query) => query.eq('open_for_subscription', 'Y'),
        (query) => query.gte('fund_rating', 3), 
        (query) => query.order('fund_rating', { ascending: false })
      ]
    }),
    supabaseListRead<AMC>({
      table: "rms_amc",
      columns: "id, amc_name, structure, amc_rating, amc_size_rating, amc_pedigree_rating, amc_team_rating, amc_philosophy_rating, open_for_distribution, us_investor_tagging, aum, slug ",
      filters: [
        (query) => query.eq('open_for_distribution', ['Y']),
        (query) => query.eq('structure', ['MF']),
        (query) => query.gt('amc_rating', 2),
        (query) => query.order('amc_rating', { ascending: false })
      ]
    }),
    supabaseListRead<AMC>({
      table: "rms_amc",
      columns: "id, amc_name, structure, amc_rating, amc_size_rating, amc_pedigree_rating, amc_team_rating, amc_philosophy_rating, open_for_distribution, us_investor_tagging, aum, slug ",
      filters: [
        (query) => query.eq('open_for_distribution', ['Y']),
        (query) => query.in('structure', ['PMS','AIF']),
        (query) => query.gt('amc_rating', 2),
        (query) => query.order('amc_rating', { ascending: false })
      ]
    }),
    supabaseListRead<AMC>({
      table: "rms_amc",
      columns: "id, amc_name, structure, amc_rating, amc_size_rating, amc_pedigree_rating, amc_team_rating, amc_philosophy_rating, open_for_distribution, us_investor_tagging, aum, slug ",
      filters: [
        (query) => query.eq('open_for_distribution', ['Y']),
        (query) => query.eq('structure', ['Global AMC']),
        (query) => query.gt('amc_rating', 2),
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
    }),
    supabaseListRead<Structure>({
      table: "rms_structure",
      columns: "structure_id, structure_name, structure_summary, structure_desc, structure_slug",
      filters: [(query) => query.in('structure_id', [1, 2, 3])]
    }),
    supabaseListRead<Structure>({
      table: "rms_structure",
      columns: "structure_id, structure_name, structure_summary, structure_desc, structure_slug",
      filters: [(query) => query.in('structure_id', [5])]
    })

  ]);


  return (
    <div>
      <div className="pageHeadingBox"><h1>IME RMS</h1></div>
        <Tabs defaultValue="funds" className="w-full mx-auto mt-6 text-sm">
            <TabsList className="w-full">
                <TabsTrigger value="funds">Funds</TabsTrigger>
                <TabsTrigger value="amc">AMCs</TabsTrigger>
                <TabsTrigger value="india">India</TabsTrigger>
                <TabsTrigger value="global">Global</TabsTrigger>
          </TabsList>
                <TabsContent value="funds">
                    <TableFundScreen data={funds} />
                    <PerformanceFootnote />
                </TabsContent>
                <TabsContent value="amc">
                  <Tabs defaultValue="MF" className="w-full mx-auto mt-2">
                      <TabsList className="w-full">
                          <TabsTrigger value="MF">MF</TabsTrigger>
                          <TabsTrigger value="PMS/AIF">PMS/AIF</TabsTrigger>
                          <TabsTrigger value="Global">Global</TabsTrigger>
                      </TabsList>
                      <TabsContent value="MF">
                        <TableAmcScreen data={mfAmc}/>
                      </TabsContent>
                      <TabsContent value="PMS/AIF">
                        <p className="text-sm text-gray-500 mt-0 mb-0">Note: Certain PMS AMCs also offer AIF's similar to their PMS offerings, that are managed by the same team. Prominent examples include Alfaccurate, Buoyant, Carnelian, Sameeksha, Abakkus, WhiteOak and others. </p>
                        <TableAmcScreen data={pmsAmc}/>
                      </TabsContent>
                      <TabsContent value="Global">
                        <TableAmcScreen data={globalAmc}/>
                      </TabsContent>
                  </Tabs>
                </TabsContent>
                <TabsContent value="india">
                    <Tabs defaultValue="Asset Class" className="w-full mx-auto mt-2">
                        <TabsList className="w-full">
                            <TabsTrigger value="Asset Class">Indian Assets</TabsTrigger>
                            <TabsTrigger value="Equity">Equity</TabsTrigger>
                            <TabsTrigger value="Debt">Debt</TabsTrigger>
                            <TabsTrigger value="Hybrid">Hybrid</TabsTrigger>
                            <TabsTrigger value="Alternatives">Altenatives</TabsTrigger>
                        </TabsList>
                        <TabsContent value="Asset Class">
                            <h3>Structures</h3>
                            <TableStructure data={DomesticStructure}/>
                            <h3 className="mt-6">Asset Classes</h3>
                            <TableAssetClass data={DomesticAssetClass}/>
                        </TabsContent> 
                        <TabsContent value="Equity">
                            <h3 className="ime-table-heading"> Trailing Returns </h3>
                            <TableCategories data={Eqcategory} columnType="summary"/>
                            <PerformanceFootnote />
                            <div className="hidden md:block">
                              <h3 className="ime-table-heading mt-6"> Annual Returns </h3>
                              <TableCategories data={Eqcategory} columnType="annual"/>
                            </div>
                        </TabsContent>  
                        <TabsContent value="Debt">
                            <h3 className="ime-table-heading"> Trailing Returns </h3>
                            <TableCategories data={Debtcategory} columnType="summary"/>
                            <PerformanceFootnote />
                            <div className="hidden md:block">
                              <h3 className="ime-table-heading mt-6"> Annual Returns </h3>
                              <TableCategories data={Debtcategory} columnType="annual"/>
                            </div>
                        </TabsContent>
                        <TabsContent value="Hybrid">
                            <h3 className="ime-table-heading"> Trailing Returns </h3>
                            <TableCategories data={Hybridcategory} columnType="summary"/>
                            <PerformanceFootnote />
                            <div className="hidden md:block">
                              <h3 className="ime-table-heading mt-6"> Annual Returns </h3>
                              <TableCategories data={Hybridcategory} columnType="annual"/>
                            </div>
                        </TabsContent>
                        <TabsContent value="Alternatives">
                            <h3 className="ime-table-heading"> Trailing Returns </h3>
                            <TableCategories data={Altcategory} columnType="summary"/>
                            <PerformanceFootnote />
                            <div className="hidden md:block">
                              <h3 className="ime-table-heading mt-6"> Annual Returns </h3>
                              <TableCategories data={Altcategory} columnType="annual"/>
                            </div>
                        </TabsContent>
                    </Tabs>
                </TabsContent>  
                <TabsContent value="global">
                    <Tabs defaultValue="Global-Assets" className="w-full mx-auto mt-2">
                        <TabsList className="w-full">
                          <TabsTrigger value="Global-Assets">Global Assets</TabsTrigger>
                            <TabsTrigger value="Global-Equity">Global-Equity</TabsTrigger>
                            <TabsTrigger value="Global-Others">Global-Others</TabsTrigger>
                        </TabsList>
                        <TabsContent value="Global-Assets">
                            <h3>Structures</h3>
                            <TableStructure data={GlobalStructure}/>
                            <h3 className="mt-6">Asset Classes</h3>
                            <TableAssetClass data={GlobalAssetClass}/>
                        </TabsContent>
                        <TabsContent value="Global-Equity">
                            <h3 className="ime-table-heading"> Trailing Returns </h3>
                            <TableCategories data={GlobalEqcategory} columnType="summary"/>
                            <div className="hidden md:block">
                              <h3 className="ime-table-heading mt-6"> Annual Returns </h3>
                              <TableCategories data={GlobalEqcategory} columnType="annual"/>
                            </div>
                        </TabsContent>
                        <TabsContent value="Global-Others">
                            <h3 className="text-base font-bold text-center text-gray-500 p-2">Global Debt</h3>
                            <TableCategories data={GlobalDebtcategory} columnType="summary"/>
                            <div className="hidden md:block mt-6">
                              <TableCategories data={GlobalDebtcategory} columnType="annual"/>
                            </div>
                            <h3 className="text-base font-bold text-center text-gray-500 p-2 mt-6">Global Alternatives</h3>
                            <TableCategories data={GlobalAltcategory} columnType="summary"/>
                            <PerformanceFootnote />
                            <div className="hidden md:block mt-6">
                              <TableCategories data={GlobalAltcategory} columnType="annual"/>
                            </div>
                        </TabsContent>
                    </Tabs>
                </TabsContent>
      </Tabs>





     
    </div>
  );
}

