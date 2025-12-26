import SimpleTable from "@/components/tables/singleRowTable";
import { supabaseSingleRead, fetchOptions } from "@/lib/supabase/serverQueryHelper";
import { RmsFundAmc } from "@/types/funds-detail";
import { RatingDisplay, RatingDisplayWithStar, RatingContainer, RmsFundFiveYrPerfRating, RmsFundPerfConsistencyRating, RmsAmcMaturityRating, RmsFundStrategyDefRating, RmsFundFmChurnRiskRating } from "@/components/conditional-formatting";
import { EditFundsButton } from "@/components/forms/EditFunds";
import { EditAMCButton } from "@/components/forms/EditAMC";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EditAmcDueDilButton } from "@/components/forms/EditAmcDueDil";
import { FavouriteHeart } from "@/components/ui/favourite-heart";
import { getUserRoles } from '@/lib/auth/getUserRoles';
import { can } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { UpgradeIcon } from "@/components/uiComponents/upgrade-icon";
import { FlexRms2Col } from "@/components/grids/flex-rms-2col";

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function FundPage({ params }: PageProps) {
  const { slug } = await params;
  
  // Get user roles for permission checking
  const userRoles = await getUserRoles();
  // Check permission first
  if (!can(userRoles, 'rms', 'view_detailed')) {
    redirect('/uservalidation'); // or wherever you want to send them
  }

  // Fetch fund data
  const fund = await supabaseSingleRead<RmsFundAmc>({
    table: "view_rms_funds_amc",
    columns: "*",
    filters: [
      (query) => query.eq('slug', slug)
    ]
  });

  if (!fund) {
    return <div>Fund not found</div>;
  }

  return (
    <div className="ime-funds-page">
      <div>
        <div className="flex items-center justify-center gap-4 p-4 bg-gray-100 rounded">
          <h1 className="text-2xl font-bold">{fund.fund_name}</h1>
          <FavouriteHeart 
            entityType="funds" 
            entityId={fund.fund_id} 
            size="lg"
          />
        </div>
        <div className="flex flex-wrap gap-2 justify-center mt-2 text-sm">
            <Link href={`/amc/${fund.amc_slug}`} className="whitespace-nowrap blue-hyperlink"> {fund.amc_name} |  </Link>
             {fund.structure_name} -  
            <Link href={`/assetclass/${fund.asset_class_slug}`} className="whitespace-nowrap blue-hyperlink"> {fund.asset_class_name} -  </Link>
            <Link href={`/categories/${fund.category_slug}`} className="whitespace-nowrap blue-hyperlink"> {fund.category_name} |  </Link>
            <div className="whitespace-nowrap">
              {fund.fund_aum != null && (
                <>
                  AUM: {fund.structure_id === 5 ? `$ ${fund.fund_aum} mn` : `Rs. ${fund.fund_aum} cr`}|
                </>
              )}
            </div>
            <div className="whitespace-nowrap"> Open: {fund.open_for_subscription}  | </div>
            {can(userRoles, 'rms', 'edit_rms') ? 
              <div className="whitespace-nowrap">
                <span>Edit: </span>
                <EditFundsButton 
                fundData={fund} 
                />
                {fund.amc_id && (
                  <>
                    <EditAMCButton 
                    amcData={fund} 
                    amcId={fund.amc_id}
                    />
                    <EditAmcDueDilButton amcData={fund} amcId={fund.amc_id} />
                  </>
                )}
              {can(userRoles, 'rms', 'view_all_funds') && fund.mkt_material_link && fund.mkt_material_link.trim() !== "" && (
                <>
                  <a href={fund.mkt_material_link} target="_blank" className="blue-hyperlink"> Presentations</a>
                </>
              )}
            </div>
            :
            null
            }
        </div>
      <div>
        <Tabs defaultValue="rating_snapshot" className="w-full mx-auto mt-6 text-sm">
          <TabsList className="w-full">
            <TabsTrigger value="rating_snapshot">Snapshot</TabsTrigger>
            <TabsTrigger value="rating_rationale">Rationale</TabsTrigger>
            <TabsTrigger value="investment_team">Team</TabsTrigger>
            <TabsTrigger value="fund_details">Details</TabsTrigger>
          </TabsList>
          <TabsContent value="rating_snapshot">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="text-sm">
                  <h2>How we rate the fund</h2>
                  <SimpleTable 
                  headers = {[{label:"Fund"},{label:"Strategy"},{label:"Performance"}]}
                  body = {[{value:<RatingDisplayWithStar rating={fund.fund_rating} />},{value:<RatingDisplayWithStar rating={fund.fund_strategy_rating} />},{value:<RatingDisplayWithStar rating={fund.fund_performance_rating} />} ]}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 w-full mt-4 pt-4 border-t border-gray-400"></div>
                  <div className="w-full mt-2 text-xs">
                      <FlexRms2Col label="Recommendation">
                          <RatingContainer rating={fund.fund_rating ?? 0}>{fund.recommendation_tag}</RatingContainer>
                      </FlexRms2Col>
                      <FlexRms2Col label="Strategy Definition">
                          <RmsFundStrategyDefRating rating={String(fund.strategy_tag ?? 0)} />
                      </FlexRms2Col>
                      <FlexRms2Col label="5yr Performance">
                          <RmsFundFiveYrPerfRating rating={fund.perf_tag_5yr ?? ''} />
                      </FlexRms2Col>
                      <FlexRms2Col label="LT Performance">
                          <RmsFundPerfConsistencyRating rating={fund.perf_tag_consistent ?? ''} />
                      </FlexRms2Col>
                      <FlexRms2Col label="Strategy Desc">
                          <RatingContainer rating={fund.fund_strategy_rating ?? 0}>{fund.strategy_name}</RatingContainer>
                      </FlexRms2Col>
                      <FlexRms2Col label="Strategy Desc">
                        <UpgradeIcon clickThroughPath="create-account" />
                      </FlexRms2Col>
                  </div>
                </div>
                <div className="text-sm">
                  <h2 className="text-center font-bold mb-2"> How we rate the AMC</h2>
                  <SimpleTable 
                  headers = {[{label:"AMC"},{label:"Pedigree"},{label:"Team"},{label:"Philosophy"}]}
                  body = {[{value:<RatingDisplayWithStar rating={fund.amc_rating} />},{value:<RatingDisplayWithStar rating={fund.amc_pedigree_rating} />},{value:<RatingDisplayWithStar rating={fund.amc_team_rating} />},{value:<RatingDisplayWithStar rating={fund.amc_philosophy_rating} />}]}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 w-full mt-4 pt-4 border-t border-gray-400"></div>
                  <div className="w-full mt-2 text-xs">
                      <FlexRms2Col label="AMC Pedigree">
                          <RatingContainer rating={fund.amc_rating ?? 0}>{fund.amc_pedigree}</RatingContainer>
                      </FlexRms2Col>
                      <FlexRms2Col label="Team Pedigree">
                          <RatingContainer rating={fund.amc_team_rating ?? 0}>{fund.team_pedigree}</RatingContainer>
                      </FlexRms2Col>
                      <FlexRms2Col label="FM Churn Risk">
                          <RmsFundFmChurnRiskRating rating={fund.inv_team_risk ?? ''} />
                      </FlexRms2Col>
                      <FlexRms2Col label="AMC Maturity">
                          <RmsAmcMaturityRating rating={fund.amc_maturity ?? ''} />
                      </FlexRms2Col>
                      <FlexRms2Col label="Philosphy Name">
                          <RatingContainer rating={fund.amc_philosophy_rating ?? 0}>{fund.inv_phil_name}</RatingContainer>
                      </FlexRms2Col>
                      <FlexRms2Col label="Inv Philosophy">
                          <RatingContainer rating={fund.amc_philosophy_rating ?? 0}>{fund.inv_philosophy_followed}</RatingContainer>
                      </FlexRms2Col>
                      <FlexRms2Col label="Investment Team">
                          <RatingContainer rating={fund.amc_team_rating ?? 0}>{fund.core_amc_team}</RatingContainer>
                      </FlexRms2Col>
                  </div>
                </div>
            </div>
          <div className="text-base seperator-line">
            <h2 className="ime-basic-h3 mt-4"> Trailing Performance </h2>
            {fund.trailing_perf_html && <div dangerouslySetInnerHTML={{ __html: fund.trailing_perf_html }} />}
            <h2 className="ime-basic-h3 mt-6"> Annual Performance </h2>
            {fund.ann_perf_html && <div dangerouslySetInnerHTML={{ __html: fund.ann_perf_html }} />}
            <h2 className="ime-basic-h mt-6"> Portfolio Composition </h2>
            {fund.port_comp_html && <div className="text-sm"><div dangerouslySetInnerHTML={{ __html: fund.port_comp_html }} /></div>}
          </div>
          </TabsContent>
          <TabsContent value="rating_rationale">
            <div className="text-sm">
                  <h2 className="ime-basic-h3"> Rationale behind our fund rating</h2>
                  {fund.investment_view && fund.investment_view.trim() !== "" && (
                    <FlexRms2Col label="Fund Recommendation">
                        {fund.investment_view}
                    </FlexRms2Col>
                  )}
                  {fund.strategy_view && fund.strategy_view.trim() !== "" && (
                    <FlexRms2Col label="Fund's Strategy">
                        {fund.strategy_view}
                    </FlexRms2Col>
                  )}
                  {((fund.performance_view && fund.performance_view.trim() !== "") || (fund.additional_performance_view && fund.additional_performance_view.trim() !== "")) && (
                    <FlexRms2Col label="Performance">
                        {fund.performance_view}{fund.additional_performance_view}
                    </FlexRms2Col>
                  )}
                  {fund.oth_salient_points && fund.oth_salient_points.trim() !== "" && (
                    <FlexRms2Col label="Other Salient Points">
                        {fund.oth_salient_points}
                    </FlexRms2Col>
                  )}
          </div>
          <div className="text-sm mt-6">
                  <h2 className="ime-basic-h3"> Rationale behind our AMC rating</h2>
                  {fund.amc_view && fund.amc_view.trim() !== "" && (
                    <FlexRms2Col label="View on AMC">
                        {fund.amc_view}
                    </FlexRms2Col>
                  )}
                  {fund.amc_pedigree_desc && fund.amc_pedigree_desc.trim() !== "" && (
                    <FlexRms2Col label="AMC's Pedigree">
                        {fund.amc_pedigree_desc}
                    </FlexRms2Col>
                  )}
                  {fund.team_pedigree_desc && fund.team_pedigree_desc.trim() !== "" && (
                    <FlexRms2Col label="AMC's Team">
                        {fund.team_pedigree_desc}
                    </FlexRms2Col>
                  )}
                  {fund.inv_phil_desc && fund.inv_phil_desc.trim() !== "" && (
                    <FlexRms2Col label="AMC's Philosophy">
                        {fund.inv_phil_desc}
                    </FlexRms2Col>
                  )}
                  {fund.salient_points && fund.salient_points.trim() !== "" && (
                    <FlexRms2Col label="Other Salient Points">
                        {fund.salient_points}
                    </FlexRms2Col>
                  )}
                  {fund.fund_body && (<>
                   <div className="rms-body" dangerouslySetInnerHTML={{ __html: fund.fund_body }} /></>)}
                   {fund.amc_body && <div className="rms-body" dangerouslySetInnerHTML={{ __html: fund.amc_body }} />}
            </div>
          </TabsContent>
          <TabsContent value="investment_team">
            <div className="text-base">
              <h2 className="ime-basic-h3"> Investment Team </h2>
              {fund.amc_fm_html && <div dangerouslySetInnerHTML={{ __html: fund.amc_fm_html }} />}
            </div>
          </TabsContent>
          <TabsContent value="fund_details">
            <div className="text-base">
              <h2 className="ime-basic-h3"> Fee Structure </h2>
              {fund.fee_structure_html && <div dangerouslySetInnerHTML={{ __html: fund.fee_structure_html }} />}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      </div>
    </div>
  );
}