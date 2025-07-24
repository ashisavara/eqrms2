import SimpleTable from "@/components/tables/singleRowTable";
import { supabaseSingleRead, fetchOptions } from "@/lib/supabase/serverQueryHelper";
import { RmsFundAmc } from "@/types/funds-detail";
import { RatingDisplay } from "@/components/conditional-formatting";
import { EditFundsButton } from "@/components/forms/EditFunds";
import { EditAMCButton } from "@/components/forms/EditAMC";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EditAmcDueDilButton } from "@/components/forms/EditAmcDueDil";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function FundPage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch options and fund data in parallel
  const [openSubsOptions, strategyTagOptions, amcPedigreeOptions, amcTeamPedigreeOptions, amcTeamChurnOptions, amcMaturityOptions, amcInvPhilosophyDefOptions, fund] = await Promise.all([
    fetchOptions<string, string>("master", "open_for_subscription_tag", "open_for_subscription_tag"),
    fetchOptions<string, string>("master", "fund_strategy_def_tag", "fund_strategy_def_tag"),

    fetchOptions<string, string>("master", "amc_pedigree_tag", "amc_pedigree_tag"),
    fetchOptions<string, string>("master", "amc_team_pedigree_tag", "amc_team_pedigree_tag"),
    fetchOptions<string, string>("master", "amc_team_churn_tag", "amc_team_churn_tag"),
    fetchOptions<string, string>("master", "amc_maturity_tag", "amc_maturity_tag"),
    fetchOptions<string, string>("master", "amc_inv_philosophy_def_tag", "amc_inv_philosophy_def_tag"),

    supabaseSingleRead<RmsFundAmc>({
      table: "view_rms_funds_amc",
      columns: "*",
      filters: [
        (query) => query.eq('slug', slug)
      ]
    }), 
  ]);

  if (!fund) {
    return <div>Fund not found</div>;
  }

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold p-4 bg-gray-100 rounded text-center">{fund.fund_name}</h1>
        <div className="flex flex-row gap-2 justify-center">
            <div> {fund.amc_name} |  </div>
            <div> {fund.structure_name} -  </div>
            <div> {fund.asset_class_name} -  </div>
            <div> {fund.category_name} |  </div>
            <div> AUM: {fund.fund_aum} cr |  </div>
            <div> Open for Subscription: {fund.open_for_subscription}  | </div>
            <div>
              <span>Edit: </span>
              <EditFundsButton 
              fundData={fund} 
              openSubsOptions={openSubsOptions}
              strategyTagOptions={strategyTagOptions}
              />
              {fund.amc_id && (
                <>
                  <EditAMCButton 
                  amcData={fund} 
                  amcId={fund.amc_id}
                  amcPedigreeOptions={amcPedigreeOptions}
                  amcTeamPedigreeOptions={amcTeamPedigreeOptions}
                  amcTeamChurnOptions={amcTeamChurnOptions}
                  amcMaturityOptions={amcMaturityOptions}
                  amcInvPhilosophyDefOptions={amcInvPhilosophyDefOptions}
                  />
                  <EditAmcDueDilButton amcData={fund} amcId={fund.amc_id} />
                </>
              )}
        </div>
        </div>
      <div>
        <Tabs defaultValue="rating_snapshot" className="w-full mx-auto mt-6">
          <TabsList className="w-full">
            <TabsTrigger value="rating_snapshot">Rating Snapshot</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="rating_rationale">Rating Rationale</TabsTrigger>
            <TabsTrigger value="investment_team">Team</TabsTrigger>
            <TabsTrigger value="fees">Fees</TabsTrigger>
          </TabsList>
          <TabsContent value="rating_snapshot">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="border-2 border-gray-300 rounded-md m-2 p-2 text-sm">
                  <h3 className="text-center font-bold mb-2">How we rate the fund</h3>
                  <SimpleTable 
                  headers = {[{label:"Fund"},{label:"Strategy"},{label:"Performance"}]}
                  body = {[{value:<RatingDisplay rating={fund.fund_rating} />},{value:<RatingDisplay rating={fund.fund_strategy_rating} />},{value:<RatingDisplay rating={fund.fund_performance_rating} />} ]}
                  />
                  <div className="w-full mt-2 text-base">
                      <div className="flex mb-2">
                          <div className="w-45 min-w-[180px] flex-shrink-0"><span className="font-bold">Recommendation</span></div>
                          <div className="flex-1 min-w-0">{fund.recommendation_tag}</div>
                      </div>
                      <div className="flex mb-2">
                          <div className="w-45 min-w-[180px] flex-shrink-0"><span className="font-bold">Strategy Definition</span></div>
                          <div className="flex-1 min-w-0">{fund.strategy_tag}</div>
                      </div>
                      <div className="flex mb-2">
                          <div className="w-45 min-w-[180px] flex-shrink-0"><span className="font-bold">5yr Performance</span></div>
                          <div className="flex-1 min-w-0">{fund.perf_tag_5yr}</div>
                      </div>
                      <div className="flex mb-2">
                          <div className="w-45 min-w-[180px] flex-shrink-0"><span className="font-bold">LT Performance</span></div>
                          <div className="flex-1 min-w-0">{fund.perf_tag_consistent}</div>
                      </div>
                      <div className="flex mb-2">
                          <div className="w-45 min-w-[180px] flex-shrink-0"><span className="font-bold">Strategy Desc</span></div>
                          <div className="flex-1 min-w-0">{fund.strategy_name}</div>
                      </div>
                  </div>
                </div>
                <div className="border-2 border-gray-300 rounded-md m-2 p-2 text-sm">
                  <h3 className="text-center font-bold mb-2"> How we rate the AMC</h3>
                  <SimpleTable 
                  headers = {[{label:"AMC"},{label:"Team"},{label:"Philosophy"}]}
                  body = {[{value:<RatingDisplay rating={fund.amc_rating} />},{value:<RatingDisplay rating={fund.amc_team_rating} />},{value:<RatingDisplay rating={fund.amc_philosophy_rating} />}]}
                  />
                  <div className="w-full mt-2 text-base">
                      <div className="flex mb-2">
                          <div className="w-45 min-w-[180px] flex-shrink-0"><span className="font-bold">AMC Pedigree</span></div>
                          <div className="flex-1 min-w-0">{fund.amc_pedigree}</div>
                      </div>
                      <div className="flex mb-2">
                          <div className="w-45 min-w-[180px] flex-shrink-0"><span className="font-bold">Team Pedigree</span></div>
                          <div className="flex-1 min-w-0">{fund.team_pedigree}</div>
                      </div>
                      <div className="flex mb-2">
                          <div className="w-45 min-w-[180px] flex-shrink-0"><span className="font-bold">FM Churn Risk</span></div>
                          <div className="flex-1 min-w-0">{fund.inv_team_risk}</div>
                      </div>
                      <div className="flex mb-2">
                          <div className="w-45 min-w-[180px] flex-shrink-0"><span className="font-bold">AMC Maturity</span></div>
                          <div className="flex-1 min-w-0">{fund.amc_maturity}</div>
                      </div>
                      <div className="flex mb-2">
                          <div className="w-45 min-w-[180px] flex-shrink-0"><span className="font-bold">Philosphy Name</span></div>
                          <div className="flex-1 min-w-0">{fund.inv_phil_name}</div>
                      </div>
                      <div className="flex mb-2">
                          <div className="w-45 min-w-[180px] flex-shrink-0"><span className="font-bold">Inv Philosophy</span></div>
                          <div className="flex-1 min-w-0">{fund.inv_philosophy_followed}</div>
                      </div>
                      <div className="flex mb-2">
                          <div className="w-45 min-w-[180px] flex-shrink-0"><span className="font-bold">Investment Team</span></div>
                          <div className="flex-1 min-w-0">{fund.core_amc_team}</div>
                      </div>
                  </div>
                </div>
            </div>
          </TabsContent>
          <TabsContent value="performance">
          <div className="border-2 border-gray-300 rounded-md m-4 p-2 text-base">
            <h3 className="ime-basic-h3"> Fund Trailing Performance </h3>
            {fund.trailing_perf_html && <div dangerouslySetInnerHTML={{ __html: fund.trailing_perf_html }} />}
            <h3 className="ime-basic-h3"> Fund Annual Performance </h3>
            {fund.ann_perf_html && <div dangerouslySetInnerHTML={{ __html: fund.ann_perf_html }} />}
            <h3 className="ime-basic-h3"> Portfolio Composition </h3>
            {fund.port_comp_html && <div dangerouslySetInnerHTML={{ __html: fund.port_comp_html }} />}
          </div>
          </TabsContent>
          <TabsContent value="rating_rationale">
            <div className="border-2 border-gray-300 rounded-md m-4 p-2 text-base">
                  <h3 className="ime-basic-h3"> Rationale behind our fund rating</h3>
                  <div className="flex mb-4">
                      <div className="w-45 min-w-[200px] flex-shrink-0"><span className="font-bold">Fund Recommendation</span></div>
                      <div className="flex-1 min-w-0">{fund.investment_view}</div>
                  </div>
                  <div className="flex mb-4">
                      <div className="w-45 min-w-[200px] flex-shrink-0"><span className="font-bold">Fund's Strategy</span></div>
                      <div className="flex-1 min-w-0">{fund.strategy_view}</div>
                  </div>
                  <div className="flex mb-4">
                      <div className="w-45 min-w-[200px] flex-shrink-0"><span className="font-bold">Performance</span></div>
                      <div className="flex-1 min-w-0">{fund.performance_view}{fund.additional_performance_view}</div>
                  </div>
                  <div className="flex mb-4">
                      <div className="w-45 min-w-[200px] flex-shrink-0"><span className="font-bold">Other Salient Points</span></div>
                      <div className="flex-1 min-w-0">{fund.oth_salient_points}</div>
                  </div>
          </div>
          <div className="border-2 border-gray-300 rounded-md m-4 p-2 text-base">
                  <h3 className="ime-basic-h3"> Rationale behind our AMC rating</h3>
                  <div className="flex mb-4">
                      <div className="w-45 min-w-[200px] flex-shrink-0"><span className="font-bold">View on AMC</span></div>
                      <div className="flex-1 min-w-0">{fund.amc_view}</div>
                  </div>
                  <div className="flex mb-4">
                      <div className="w-45 min-w-[200px] flex-shrink-0"><span className="font-bold">AMC's Pedigree</span></div>
                      <div className="flex-1 min-w-0">{fund.amc_pedigree_desc}</div>
                  </div>
                  <div className="flex mb-4">
                      <div className="w-45 min-w-[200px] flex-shrink-0"><span className="font-bold">AMC's Team</span></div>
                      <div className="flex-1 min-w-0">{fund.team_pedigree_desc}</div>
                  </div>
                  <div className="flex mb-4">
                      <div className="w-45 min-w-[200px] flex-shrink-0"><span className="font-bold">AMC's Philosophy</span></div>
                      <div className="flex-1 min-w-0">{fund.inv_phil_desc}</div>
                  </div>
                  <div className="flex mb-4">
                      <div className="w-45 min-w-[200px] flex-shrink-0"><span className="font-bold">Other Salient Points</span></div>
                      <div className="flex-1 min-w-0">{fund.salient_points}</div>
                  </div>
            </div>
          </TabsContent>
          <TabsContent value="investment_team">
            <div className="border-2 border-gray-300 rounded-md m-4 p-2 text-base">
              <h3 className="ime-basic-h3"> Investment Team </h3>
              {fund.amc_fm_html && <div dangerouslySetInnerHTML={{ __html: fund.amc_fm_html }} />}
            </div>
          </TabsContent>
          <TabsContent value="fees">
            <div className="border-2 border-gray-300 rounded-md m-4 p-2 text-base">
              <h3 className="ime-basic-h3"> Fee Structure </h3>
              {fund.fee_structure_html && <div dangerouslySetInnerHTML={{ __html: fund.fee_structure_html }} />}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      </div>
    </div>
  );
}