import SimpleTable from "@/components/tables/singleRowTable";
import { RmsFundAmc } from "@/types/funds-detail";
import { AMC } from "@/types/amc-detail";
import { RatingDisplayWithStar, RatingContainer, RmsFundFiveYrPerfRating, RmsFundPerfConsistencyRating, RmsAmcMaturityRating, RmsFundStrategyDefRating, RmsFundFmChurnRiskRating } from "@/components/conditional-formatting";
import { FlexRms2Col } from "@/components/grids/flex-rms-2col";
import { UpgradeIcon } from "@/components/uiComponents/upgrade-icon";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";

// Component for users WITH permissions - Rating Snapshot
export function FundRatingSnapshot({ fund }: { fund: RmsFundAmc }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
      <div className="text-sm">
        <h2>How we rate the fund</h2>
        <SimpleTable 
          headers={[{label:"Fund"},{label:"Strategy"},{label:"Performance"}]}
          body={[
            {value:<RatingDisplayWithStar rating={fund.fund_rating} />},
            {value:<RatingDisplayWithStar rating={fund.fund_strategy_rating} />},
            {value:<RatingDisplayWithStar rating={fund.fund_performance_rating} />}
          ]}
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
        </div>
      </div>
      <div className="text-sm">
        <h2 className="text-center font-bold mb-2"> How we rate the AMC</h2>
        <SimpleTable 
          headers={[{label:"AMC"},{label:"Pedigree"},{label:"Team"},{label:"Philosophy"}]}
          body={[
            {value:<RatingDisplayWithStar rating={fund.amc_rating} />},
            {value:<RatingDisplayWithStar rating={fund.amc_pedigree_rating} />},
            {value:<RatingDisplayWithStar rating={fund.amc_team_rating} />},
            {value:<RatingDisplayWithStar rating={fund.amc_philosophy_rating} />}
          ]}
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
  );
}

// Component for users WITHOUT permissions - Rating Snapshot (Upgrade version)
// See FundRatingSnapshot for the version with permissions
export function FundRatingSnapshotUpgrade() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
      <div className="text-sm">
        <h2>How we rate the fund</h2>
        <SimpleTable 
          headers={[{label:"Fund"},{label:"Strategy"},{label:"Performance"}]}
          body={[
            {value:<UpgradeIcon clickThroughPath="create-account" />},
            {value:<UpgradeIcon clickThroughPath="create-account" />},
            {value:<UpgradeIcon clickThroughPath="create-account" />}
          ]}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 w-full mt-4 pt-4 border-t border-gray-400"></div>
        <div className="w-full mt-2 text-xs">
          <FlexRms2Col label="Recommendation">
            <UpgradeIcon clickThroughPath="create-account" />
          </FlexRms2Col>
          <FlexRms2Col label="Strategy Definition">
            <UpgradeIcon clickThroughPath="create-account" />
          </FlexRms2Col>
          <FlexRms2Col label="5yr Performance">
            <UpgradeIcon clickThroughPath="create-account" />
          </FlexRms2Col>
          <FlexRms2Col label="LT Performance">
            <UpgradeIcon clickThroughPath="create-account" />
          </FlexRms2Col>
          <FlexRms2Col label="Strategy Desc">
            <UpgradeIcon clickThroughPath="create-account" />
          </FlexRms2Col>
        </div>
      </div>
      <div className="text-sm">
        <h2 className="text-center font-bold mb-2"> How we rate the AMC</h2>
        <SimpleTable 
          headers={[{label:"AMC"},{label:"Pedigree"},{label:"Team"},{label:"Philosophy"}]}
          body={[
            {value:<UpgradeIcon clickThroughPath="create-account" />},
            {value:<UpgradeIcon clickThroughPath="create-account" />},
            {value:<UpgradeIcon clickThroughPath="create-account" />},
            {value:<UpgradeIcon clickThroughPath="create-account" />}
          ]}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 w-full mt-4 pt-4 border-t border-gray-400"></div>
        <div className="w-full mt-2 text-xs">
          <FlexRms2Col label="AMC Pedigree">
            <UpgradeIcon clickThroughPath="create-account" />
          </FlexRms2Col>
          <FlexRms2Col label="Team Pedigree">
            <UpgradeIcon clickThroughPath="create-account" />
          </FlexRms2Col>
          <FlexRms2Col label="FM Churn Risk">
            <UpgradeIcon clickThroughPath="create-account" />
          </FlexRms2Col>
          <FlexRms2Col label="AMC Maturity">
            <UpgradeIcon clickThroughPath="create-account" />
          </FlexRms2Col>
          <FlexRms2Col label="Philosphy Name">
            <UpgradeIcon clickThroughPath="create-account" />
          </FlexRms2Col>
          <FlexRms2Col label="Inv Philosophy">
            <UpgradeIcon clickThroughPath="create-account" />
          </FlexRms2Col>
          <FlexRms2Col label="Investment Team">
            <UpgradeIcon clickThroughPath="create-account" />
          </FlexRms2Col>
        </div>
      </div>
    </div>
  );
}

// Component for users WITH permissions - Rating Rationale
export function FundRatingRationale({ fund }: { fund: RmsFundAmc }) {
  return (
    <>
      <div className="text-sm ime-rating-rationale">
        <h2 className="ime-basic-h3"> Rationale behind our fund rating</h2>
        {fund.investment_view && fund.investment_view.trim() !== "" && (
          <FlexRms2Col label="Fund Recommendation">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{fund.investment_view}</ReactMarkdown>
          </FlexRms2Col>
        )}
        {fund.strategy_view && fund.strategy_view.trim() !== "" && (
          <FlexRms2Col label="Fund's Strategy">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{fund.strategy_view}</ReactMarkdown>
          </FlexRms2Col>
        )}
        {((fund.performance_view && fund.performance_view.trim() !== "") || (fund.additional_performance_view && fund.additional_performance_view.trim() !== "")) && (
          <FlexRms2Col label="Performance">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{fund.performance_view}</ReactMarkdown>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{fund.additional_performance_view}</ReactMarkdown>
          </FlexRms2Col>
        )}
        {fund.oth_salient_points && fund.oth_salient_points.trim() !== "" && (
          <FlexRms2Col label="Other Salient Points">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{fund.oth_salient_points}</ReactMarkdown>
          </FlexRms2Col>
        )}
      </div>
      <div className="text-sm mt-6 ime-rating-rationale">
        <h2 className="ime-basic-h3"> Rationale behind our AMC rating</h2>
        {fund.amc_view && fund.amc_view.trim() !== "" && (
          <FlexRms2Col label="View on AMC">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{fund.amc_view}</ReactMarkdown>
          </FlexRms2Col>
        )}
        {fund.amc_pedigree_desc && fund.amc_pedigree_desc.trim() !== "" && (
          <FlexRms2Col label="AMC's Pedigree">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{fund.amc_pedigree_desc}</ReactMarkdown>
          </FlexRms2Col>
        )}
        {fund.team_pedigree_desc && fund.team_pedigree_desc.trim() !== "" && (
          <FlexRms2Col label="AMC's Team">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{fund.team_pedigree_desc}</ReactMarkdown>
          </FlexRms2Col>
        )}
        {fund.inv_phil_desc && fund.inv_phil_desc.trim() !== "" && (
          <FlexRms2Col label="AMC's Philosophy">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{fund.inv_phil_desc}</ReactMarkdown>
          </FlexRms2Col>
        )}
        {fund.salient_points && fund.salient_points.trim() !== "" && (
          <FlexRms2Col label="Other Salient Points">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{fund.salient_points}</ReactMarkdown>
          </FlexRms2Col>
        )}
        {fund.fund_body && (
          <div className="rms-body" dangerouslySetInnerHTML={{ __html: fund.fund_body }} />
        )}
        {fund.fund_private_body && (
          <div className="rms-body" dangerouslySetInnerHTML={{ __html: fund.fund_private_body }} />
        )}
        {fund.amc_body && (
          <div className="rms-body" dangerouslySetInnerHTML={{ __html: fund.amc_body }} />
        )}
        {fund.amc_private_body && (
          <div className="rms-body" dangerouslySetInnerHTML={{ __html: fund.amc_private_body }} />
        )}
      </div>
    </>
  );
}

// Component for users WITHOUT permissions - Rating Rationale (Upgrade version)
// See FundRatingRationale for the version with permissions
export function FundRatingRationaleUpgrade() {
  return (
    <>
      <div className="text-sm">
        <h2 className="ime-basic-h3"> Rationale behind our fund rating</h2>
        <FlexRms2Col label="Fund Recommendation">
          <UpgradeIcon clickThroughPath="create-account" />
        </FlexRms2Col>
        <FlexRms2Col label="Fund's Strategy">
          <UpgradeIcon clickThroughPath="create-account" />
        </FlexRms2Col>
        <FlexRms2Col label="Performance">
          <UpgradeIcon clickThroughPath="create-account" />
        </FlexRms2Col>
        <FlexRms2Col label="Other Salient Points">
          <UpgradeIcon clickThroughPath="create-account" />
        </FlexRms2Col>
      </div>
      <div className="text-sm mt-6">
        <h2 className="ime-basic-h3"> Rationale behind our AMC rating</h2>
        <FlexRms2Col label="View on AMC">
          <UpgradeIcon clickThroughPath="create-account" />
        </FlexRms2Col>
        <FlexRms2Col label="AMC's Pedigree">
          <UpgradeIcon clickThroughPath="create-account" />
        </FlexRms2Col>
        <FlexRms2Col label="AMC's Team">
          <UpgradeIcon clickThroughPath="create-account" />
        </FlexRms2Col>
        <FlexRms2Col label="AMC's Philosophy">
          <UpgradeIcon clickThroughPath="create-account" />
        </FlexRms2Col>
        <FlexRms2Col label="Other Salient Points">
          <UpgradeIcon clickThroughPath="create-account" />
        </FlexRms2Col>
      </div>
    </>
  );
}

// Component for users WITH permissions - AMC Rating Snapshot
export function AmcRatingSnapshot({ amc }: { amc: AMC }) {
  return (
    <>
      <div className="text-sm">
        <h2 className="ime-basic-h3"> IME AMC rating</h2>
        <SimpleTable 
          headers={[{label:"AMC"},{label:"Pedigree"},{label:"Team"},{label:"Philosophy"}]}
          body={[
            {value: <RatingDisplayWithStar rating={amc?.amc_rating ?? null} />},
            {value: <RatingDisplayWithStar rating={amc?.amc_pedigree_rating ?? null} />},
            {value: <RatingDisplayWithStar rating={amc?.amc_team_rating ?? null} />},
            {value: <RatingDisplayWithStar rating={amc?.amc_philosophy_rating ?? null} />}
          ]}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 w-full mt-4 pt-4 border-t border-gray-200">
          <div>
            <FlexRms2Col label="AMC Pedigree">
              <RatingContainer rating={amc.amc_rating ?? 0}>{amc.amc_pedigree}</RatingContainer>
            </FlexRms2Col>
            <FlexRms2Col label="Team Pedigree">
              <RatingContainer rating={amc.amc_team_rating ?? 0}>{amc.team_pedigree}</RatingContainer>
            </FlexRms2Col>
            <FlexRms2Col label="FM Churn Risk">
              <RmsFundFmChurnRiskRating rating={amc.inv_team_risk ?? ''} />
            </FlexRms2Col>
            <FlexRms2Col label="AMC Maturity">
              <RmsAmcMaturityRating rating={amc.amc_maturity ?? ''} />
            </FlexRms2Col>
          </div>
          <div>
            <FlexRms2Col label="Philosphy Name">
              <RatingContainer rating={amc.amc_philosophy_rating ?? 0}>{amc.inv_phil_name}</RatingContainer>
            </FlexRms2Col>
            <FlexRms2Col label="Inv Philosophy">
              <RatingContainer rating={amc.amc_philosophy_rating ?? 0}>{amc.inv_philosophy_followed}</RatingContainer>
            </FlexRms2Col>
            <FlexRms2Col label="Investment Team">
              <RatingContainer rating={amc.amc_team_rating ?? 0}>{amc.core_amc_team}</RatingContainer>
            </FlexRms2Col>
          </div>
        </div>
      </div>
    </>
  );
}

// Component for users WITHOUT permissions - AMC Rating Snapshot (Upgrade version)
// See AmcRatingSnapshot for the version with permissions
export function AmcRatingSnapshotUpgrade() {
  return (
    <>
      <div className="text-sm">
        <h2 className="ime-basic-h3"> IME AMC rating</h2>
        <SimpleTable 
          headers={[{label:"AMC"},{label:"Pedigree"},{label:"Team"},{label:"Philosophy"}]}
          body={[
            {value: <UpgradeIcon clickThroughPath="create-account" />},
            {value: <UpgradeIcon clickThroughPath="create-account" />},
            {value: <UpgradeIcon clickThroughPath="create-account" />},
            {value: <UpgradeIcon clickThroughPath="create-account" />}
          ]}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 w-full mt-4 pt-4 border-t border-gray-200">
          <div>
            <FlexRms2Col label="AMC Pedigree">
              <UpgradeIcon clickThroughPath="create-account" />
            </FlexRms2Col>
            <FlexRms2Col label="Team Pedigree">
              <UpgradeIcon clickThroughPath="create-account" />
            </FlexRms2Col>
            <FlexRms2Col label="FM Churn Risk">
              <UpgradeIcon clickThroughPath="create-account" />
            </FlexRms2Col>
            <FlexRms2Col label="AMC Maturity">
              <UpgradeIcon clickThroughPath="create-account" />
            </FlexRms2Col>
          </div>
          <div>
            <FlexRms2Col label="Philosphy Name">
              <UpgradeIcon clickThroughPath="create-account" />
            </FlexRms2Col>
            <FlexRms2Col label="Inv Philosophy">
              <UpgradeIcon clickThroughPath="create-account" />
            </FlexRms2Col>
            <FlexRms2Col label="Investment Team">
              <UpgradeIcon clickThroughPath="create-account" />
            </FlexRms2Col>
          </div>
        </div>
      </div>
    </>
  );
}

// Component for users WITH permissions - AMC Rating Rationale
export function AmcRatingRationale({ amc }: { amc: AMC }) {
  return (
    <>
      <div className="flex-col gap-y-5 text-sm ime-rating-rationale">
        <h2 className="ime-basic-h3"> Rationale behind our AMC rating</h2>
        {amc.amc_view && amc.amc_view.trim() !== "" && (
          <FlexRms2Col label="View on AMC">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{amc.amc_view}</ReactMarkdown>
          </FlexRms2Col>
        )}
        {amc.amc_pedigree_desc && amc.amc_pedigree_desc.trim() !== "" && (
          <FlexRms2Col label="AMC Pedigree">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{amc.amc_pedigree_desc}</ReactMarkdown>
          </FlexRms2Col>
        )}
        {amc.team_pedigree_desc && amc.team_pedigree_desc.trim() !== "" && (
          <FlexRms2Col label="AMC Team">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{amc.team_pedigree_desc}</ReactMarkdown>
          </FlexRms2Col>
        )}
        {amc.inv_phil_desc && amc.inv_phil_desc.trim() !== "" && (
          <FlexRms2Col label="AMC's Philosophy">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{amc.inv_phil_desc}</ReactMarkdown>
          </FlexRms2Col>
        )}
        {amc.salient_points && amc.salient_points.trim() !== "" && (
          <FlexRms2Col label="Other Salient Points">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{amc.salient_points}</ReactMarkdown>
          </FlexRms2Col>
        )}
        {amc.amc_body && (
          <div className="rms-body" dangerouslySetInnerHTML={{ __html: amc.amc_body }} />
        )}
        {amc.amc_private_body && (
          <div className="rms-body" dangerouslySetInnerHTML={{ __html: amc.amc_private_body }} />
        )}
      </div>
    </>
  );
}

// Component for users WITHOUT permissions - AMC Rating Rationale (Upgrade version)
// See AmcRatingRationale for the version with permissions
export function AmcRatingRationaleUpgrade() {
  return (
    <>
      <div className="flex-col gap-y-5 text-sm">
        <h2 className="ime-basic-h3"> Rationale behind our AMC rating</h2>
        <FlexRms2Col label="View on AMC">
          <UpgradeIcon clickThroughPath="create-account" />
        </FlexRms2Col>
        <FlexRms2Col label="AMC Pedigree">
          <UpgradeIcon clickThroughPath="create-account" />
        </FlexRms2Col>
        <FlexRms2Col label="AMC Team">
          <UpgradeIcon clickThroughPath="create-account" />
        </FlexRms2Col>
        <FlexRms2Col label="AMC's Philosophy">
          <UpgradeIcon clickThroughPath="create-account" />
        </FlexRms2Col>
        <FlexRms2Col label="Other Salient Points">
          <UpgradeIcon clickThroughPath="create-account" />
        </FlexRms2Col>
      </div>
    </>
  );
}

