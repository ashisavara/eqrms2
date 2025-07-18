import SimpleTable from "@/components/tables/singleRowTable";
import { supabaseSingleRead } from "@/lib/supabase/serverQueryHelper";
import { RmsFundAmc } from "@/types/funds-detail";
import { RatingDisplay } from "@/components/conditional-formatting";

export default async function FundPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
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
    <div>
      <div className="bg-gray-100 p-4 rounded-md text-center">
        <h1 className="text-2xl font-bold pb-4">{fund.fund_name}</h1>
        <div className="flex flex-row gap-2 justify-center">
            <div> {fund.amc_name} |  </div>
            <div> {fund.structure_name} -  </div>
            <div> {fund.asset_class_name} -  </div>
            <div> {fund.category_name} |  </div>
            <div> AUM: {fund.fund_aum} cr |  </div>
            <div> Open for Subscription: {fund.open_for_subscription} </div>
        </div>
      </div>
      <div>
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
        <div className="border-2 border-gray-300 rounded-md m-4 p-2 text-base">
                <h3 className="text-center font-bold mb-2"> Rationale behind our fund rating</h3>
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
        <div className="border-2 border-gray-300 rounded-md m-8 p-2 text-base">
                <h3 className="text-center font-bold mb-2"> Rationale behind our AMC rating</h3>
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
        </div>
        <div className="border-2 border-gray-300 rounded-md m-8 p-2 text-base">
        <h3 className="text-center font-bold mb-2"> Investment Team </h3>
            {fund.amc_fm_html && <div dangerouslySetInnerHTML={{ __html: fund.amc_fm_html }} />}
        </div>
        <div className="border-2 border-gray-300 rounded-md m-8 p-2 text-base">
            <h3 className="ime-basic-h3"> Fund Trailing Performance </h3>
            {fund.trailing_perf_html && <div dangerouslySetInnerHTML={{ __html: fund.trailing_perf_html }} />}
            <h3 className="ime-basic-h3"> Fund Annual Performance </h3>
            {fund.ann_perf_html && <div dangerouslySetInnerHTML={{ __html: fund.ann_perf_html }} />}
            <h3 className="ime-basic-h3"> Portfolio Composition </h3>
            {fund.port_comp_html && <div dangerouslySetInnerHTML={{ __html: fund.port_comp_html }} />}
        </div>
        <div className="border-2 border-gray-300 rounded-md m-8 p-2 text-base">
            <h3 className="ime-basic-h3"> Fee Structure </h3>
            {fund.fee_structure_html && <div dangerouslySetInnerHTML={{ __html: fund.fee_structure_html }} />}
        </div>
      </div>
    </div>
  );
}