import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { TableCategories } from "@/app/(rms)/categories/TableCategories";
import { Category } from "@/types/category-detail";
import { AssetClass } from "@/types/asset-class-detail";
import { TableAssetClass } from "@/app/(rms)/assetclass/TableAssetclass"
import { Structure } from "@/types/structure-detail";
import { getUserRoles } from '@/lib/auth/getUserRoles';
import { PerformanceFootnote } from "@/components/ui/performance-footnote";
import { TableStructure } from "@/app/(rms)/structure/TableStructure";
import RmsPageTitle from "@/components/uiComponents/rms-page-title";
import { LessonSheet } from "@/app/(rms)/academy/LessonSheet";
import Link from "next/link";

// Force dynamic rendering to prevent static generation issues with AMC data
export const dynamic = 'force-dynamic';

export default async function FundsPage() {
  const userRoles = await getUserRoles();

  const [Eqcategory, Debtcategory, GlobalEqcategory, DomesticAssetClass, DomesticStructure] = await Promise.all([
    supabaseListRead<Category>({
      table: "view_rms_category",
      columns: "category_id, cat_name, slug, asset_class_name, one_yr, three_yr, five_yr, cat_summary, rms_show, cy_1, cy_2, cy_3, cy_4, cy_5, cy_6, cy_7, cy_8, cy_9, cy_10, category_stance, category_risk_profile",
      filters: [
        (query) => query.eq('rms_show', true),
        (query) => query.in('category_id', [3,4,29,30]), 
        (query) => query.order('category_stance', { ascending: false }),
      ]
    }),
    supabaseListRead<Category>({
      table: "view_rms_category",
      columns: "category_id, cat_name, slug, asset_class_name, one_yr, three_yr, five_yr, cat_summary, rms_show, cy_1, cy_2, cy_3, cy_4, cy_5, cy_6, cy_7, cy_8, cy_9, cy_10, category_stance, category_risk_profile",
      filters: [
        (query) => query.eq('rms_show', true),
        (query) => query.in('category_id', [10,53,28,35]),   
        (query) => query.order('category_stance', { ascending: false }),
      ]
    }),
    supabaseListRead<Category>({
      table: "view_rms_category",
      columns: "category_id, cat_name, slug, asset_class_name, one_yr, three_yr, five_yr, cat_summary, rms_show, cy_1, cy_2, cy_3, cy_4, cy_5, cy_6, cy_7, cy_8, cy_9, cy_10, category_stance, category_risk_profile",
      filters: [
        (query) => query.eq('rms_show', true),
        (query) => query.in('category_id', [39,45,47,40,41,44,46]), 
        (query) => query.order('category_stance', { ascending: false }),
      ]
    }),
    supabaseListRead<AssetClass>({
      table: "rms_asset_class",
      columns: "asset_class_id, asset_class_name, asset_class_summary, asset_class_desc, asset_class_slug",
      filters: [(query) => query.in('asset_class_name', ['Equity', 'Debt', 'Hybrid','Alternatives','Global - Equity', 'Global - Debt','Global - Alt'])]
    }),
    supabaseListRead<Structure>({
      table: "rms_structure",
      columns: "structure_id, structure_name, structure_summary, structure_desc, structure_slug",
      filters: [(query) => query.in('structure_id', [1, 2, 3, 5,6,7,8])]
    })

  ]);


  return (
    <div>
      <RmsPageTitle 
                title="Balanced Investor Recommendations" 
                caption="Shortlisted asset classes, categories & structures for balanced investors" 
            />
        {/* ✅ Top-level filters */}
        <div className="px-4 py-0">
            <div className="border-box"><b>Shortlisted Investment Options: </b>Please note, the list of asset class, categories & structures below is a subset of the larger universe, based on the options that are the most suitable for balanced investors. Investors desiring to choose from the larger universe, can shortlist options from the <Link href="/categories" className="text-blue-600 hover:text-blue-800">Categories Page</Link>.</div>
                    <h2>Asset Classes</h2>
                    <div className="border-box">Balanced investors can invest across Equity, Debt & Hybrid asset classes (India & Global). Alternative funds that are of a lower-risk profile, can also clearly be considered. </div>
                    <TableAssetClass data={DomesticAssetClass}/>
                    <h2 className="mt-12">Equity & Hybrid Funds (Long-Term Wealth Creation)</h2>
                             <div className="border-box"><b>Flexicap</b> Equity funds that invest across large, mid & small, are an ideal option for balanced investors (since they combine the greater stability of large-caps, with the higher growth potential of mid-caps). <b>Focused</b> funds can also be considered to avoid over-diversification common with MFs.  <b>Aggressive & Dynamic Asset Allocation </b>Hybrid funds (categories of the hybrid asset class) that include exposures to debt (helping reduce volatility of pure equity funds), can also be considered by balanced investors to fund medium-term goals.<br/>
                             <LessonSheet lessonId={3} lessonName="Why risk in equity reduces over time" courseTitle="Investment Mandate" />
                             <LessonSheet lessonId={4} lessonName="Equity MF Categories" courseTitle="Investment Mandate" /> 
                             <LessonSheet lessonId={6} lessonName="Hybrid MF Categories" courseTitle="Investment Mandate" /></div>
                            <h3 className="ime-table-heading"> Trailing Returns </h3>
                            <TableCategories data={Eqcategory} columnType="summary" userRoles={userRoles} />
                            <PerformanceFootnote />
                            <div className="hidden md:block">
                              <h3 className="ime-table-heading mt-6"> Annual Returns </h3>
                              <TableCategories data={Eqcategory} columnType="annual" userRoles={userRoles} />
                            </div>
                        <h2 className="mt-12">Fixed Income (Short-Term Needs & Capital Protection)</h2>
                        <div className="border-box">For short term requirements & capital protection, we recommend <b>Arbitrage</b> funds (superior to Bank FD & Debt MF due to superior tax efficiency). <b>Equity Savings</b> Funds (a form of hybrid funds), with equity exposure limited to 1/3rd of the fund, can also be considered since these funds are designed in a manner that helps limit downsides even in weak market conditions (markets normally have to fall more than 15% in a year for them to give a negative return). Within AIFs & SIFs, investors can also consider lower-risk <b>Absolute Long-Short</b> strategies that can provide superior returns than pure arbitrage funds.<br/>
                        <LessonSheet lessonId={5} lessonName="Debt MF Categories" courseTitle="Investment Mandate" />
                        <LessonSheet lessonId={6} lessonName="Hybrid MF Categories" courseTitle="Investment Mandate" />
                        </div>
                            <h3 className="ime-table-heading"> Trailing Returns </h3>
                            <TableCategories data={Debtcategory} columnType="summary" userRoles={userRoles} />
                            <PerformanceFootnote />
                            <div className="hidden md:block">
                              <h3 className="ime-table-heading mt-6"> Annual Returns </h3>
                              <TableCategories data={Debtcategory} columnType="annual" userRoles={userRoles} />
                            </div>
                            <h2 className="mt-12">Global (Economic & Currency Diversification)</h2>
                            <div className="border-box">Global funds provide valuable diversification benefits - in terms of both economic & currency risk. Balanced investors can choose between more conservative (US Diversified, Global, US Bond) or more aggressive (US Tech, Global Thematic, Asia & European funds).<br/>
                    <LessonSheet lessonId={10} lessonName="Benefits of International Investing" courseTitle="International Investing" />
                    <LessonSheet lessonId={11} lessonName="Why 100% exposure to India is not recommended" courseTitle="International Investing" />
                    <LessonSheet lessonId={12} lessonName="International Investing - Routes" courseTitle="International Investing" />
                    </div>
                    
                            <h3 className="ime-table-heading"> Trailing Returns </h3>
                            <TableCategories data={GlobalEqcategory} columnType="summary" userRoles={userRoles} />
                            <div className="hidden md:block">
                              <h3 className="ime-table-heading mt-6"> Annual Returns </h3>
                              <TableCategories data={GlobalEqcategory} columnType="annual" userRoles={userRoles} />
                            </div>
                            
                            <h2 className="mt-12">Structures</h2>
                    <div className="border-box"><b>Structure options not impacted by Risk-Profile:</b> It is important to note that risk-profile technically has a limited impact on structure recommendations - since a structure simply reflects a vehicle for an underlying investment strategy (with all structures supporting investment strategies ranging from low to high risk).<br/><LessonSheet lessonId={7} lessonName="MF vs PMS vs AIF" courseTitle="Investment Mandate" /></div>
                    
                    <TableStructure data={DomesticStructure}/>
    </div>
     
    </div>
  );
}

