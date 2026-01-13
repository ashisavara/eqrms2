'use client';

import { RmsFundAmc } from "@/types/funds-detail";
import Link from 'next/link';
import SimpleTable from "@/components/tables/singleRowTable";
import { 
  RatingDisplayWithStar, 
  RatingContainer, 
  RmsFundFiveYrPerfRating, 
  RmsFundPerfConsistencyRating, 
  RmsAmcMaturityRating, 
  RmsFundStrategyDefRating, 
  RmsFundFmChurnRiskRating 
} from "@/components/conditional-formatting";
import { FlexRms2Col } from "@/components/grids/flex-rms-2col";
import { UpgradeIcon } from "@/components/uiComponents/upgrade-icon";

interface ComparisonTablesProps {
  data: RmsFundAmc[];
}

// ========== REGULAR VERSION (WITH RATINGS) ==========

// 1. Fund Ratings Comparison Table (Regular)
function FundRatingsComparisonTable({ funds }: { funds: RmsFundAmc[] }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold mb-4">How we rate the funds</h2>
      
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Fund Name</th>
              <th className="border border-gray-300 p-2 text-center">Fund</th>
              <th className="border border-gray-300 p-2 text-center">Strategy</th>
              <th className="border border-gray-300 p-2 text-center">Performance</th>
            </tr>
          </thead>
          <tbody>
            {funds.map(fund => (
              <tr key={fund.fund_id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">
                  <Link href={`/funds/${fund.slug}`} className="blue-hyperlink font-medium">
                    {fund.fund_name}
                  </Link>
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <RatingDisplayWithStar rating={fund.fund_rating} />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <RatingDisplayWithStar rating={fund.fund_strategy_rating} />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <RatingDisplayWithStar rating={fund.fund_performance_rating} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {funds.map(fund => (
          <div key={fund.fund_id} className="border rounded-lg p-4 bg-white shadow-sm">
            <h3 className="font-bold mb-3">
              <Link href={`/funds/${fund.slug}`} className="blue-hyperlink">
                {fund.fund_name}
              </Link>
            </h3>
            <SimpleTable 
              headers={[{label:"Fund"},{label:"Strategy"},{label:"Performance"}]}
              body={[
                {value:<RatingDisplayWithStar rating={fund.fund_rating} />},
                {value:<RatingDisplayWithStar rating={fund.fund_strategy_rating} />},
                {value:<RatingDisplayWithStar rating={fund.fund_performance_rating} />}
              ]}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// 2. Fund Snapshot Comparison Table (Regular)
function FundSnapshotComparisonTable({ funds }: { funds: RmsFundAmc[] }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold mb-4">Fund Rating Snapshot</h2>
      
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Fund Name</th>
              <th className="border border-gray-300 p-2 text-center">Recommendation</th>
              <th className="border border-gray-300 p-2 text-center">Strategy Definition</th>
              <th className="border border-gray-300 p-2 text-center">5yr Performance</th>
              <th className="border border-gray-300 p-2 text-center">LT Performance</th>
              <th className="border border-gray-300 p-2 text-center">Strategy Desc</th>
            </tr>
          </thead>
          <tbody>
            {funds.map(fund => (
              <tr key={fund.fund_id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">
                  <Link href={`/funds/${fund.slug}`} className="blue-hyperlink font-medium">
                    {fund.fund_name}
                  </Link>
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <RatingContainer rating={fund.fund_rating ?? 0}>{fund.recommendation_tag}</RatingContainer>
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <RmsFundStrategyDefRating rating={String(fund.strategy_tag ?? 0)} />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <RmsFundFiveYrPerfRating rating={fund.perf_tag_5yr ?? ''} />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <RmsFundPerfConsistencyRating rating={fund.perf_tag_consistent ?? ''} />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <RatingContainer rating={fund.fund_strategy_rating ?? 0}>{fund.strategy_name}</RatingContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {funds.map(fund => (
          <div key={fund.fund_id} className="border rounded-lg p-4 bg-white shadow-sm">
            <h3 className="font-bold mb-3">
              <Link href={`/funds/${fund.slug}`} className="blue-hyperlink">
                {fund.fund_name}
              </Link>
            </h3>
            <div className="text-xs space-y-2">
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
        ))}
      </div>
    </div>
  );
}

// 3. AMC Ratings Comparison Table (Regular)
function AmcRatingsComparisonTable({ funds }: { funds: RmsFundAmc[] }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold mb-4">How we rate the AMCs</h2>
      
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Fund Name</th>
              <th className="border border-gray-300 p-2 text-center">AMC</th>
              <th className="border border-gray-300 p-2 text-center">Pedigree</th>
              <th className="border border-gray-300 p-2 text-center">Team</th>
              <th className="border border-gray-300 p-2 text-center">Philosophy</th>
            </tr>
          </thead>
          <tbody>
            {funds.map(fund => (
              <tr key={fund.fund_id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">
                  <Link href={`/funds/${fund.slug}`} className="blue-hyperlink font-medium">
                    {fund.fund_name}
                  </Link>
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <RatingDisplayWithStar rating={fund.amc_rating} />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <RatingDisplayWithStar rating={fund.amc_pedigree_rating} />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <RatingDisplayWithStar rating={fund.amc_team_rating} />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <RatingDisplayWithStar rating={fund.amc_philosophy_rating} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {funds.map(fund => (
          <div key={fund.fund_id} className="border rounded-lg p-4 bg-white shadow-sm">
            <h3 className="font-bold mb-3">
              <Link href={`/funds/${fund.slug}`} className="blue-hyperlink">
                {fund.fund_name}
              </Link>
            </h3>
            <SimpleTable 
              headers={[{label:"AMC"},{label:"Pedigree"},{label:"Team"},{label:"Philosophy"}]}
              body={[
                {value:<RatingDisplayWithStar rating={fund.amc_rating} />},
                {value:<RatingDisplayWithStar rating={fund.amc_pedigree_rating} />},
                {value:<RatingDisplayWithStar rating={fund.amc_team_rating} />},
                {value:<RatingDisplayWithStar rating={fund.amc_philosophy_rating} />}
              ]}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// 4. AMC Snapshot Comparison Table (Regular)
function AmcSnapshotComparisonTable({ funds }: { funds: RmsFundAmc[] }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold mb-4">AMC Rating Snapshot</h2>
      
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Fund Name</th>
              <th className="border border-gray-300 p-2 text-center">AMC Pedigree</th>
              <th className="border border-gray-300 p-2 text-center">Team Pedigree</th>
              <th className="border border-gray-300 p-2 text-center">FM Churn Risk</th>
              <th className="border border-gray-300 p-2 text-center">AMC Maturity</th>
              <th className="border border-gray-300 p-2 text-center">Philosophy Name</th>
              <th className="border border-gray-300 p-2 text-center">Inv Philosophy</th>
              <th className="border border-gray-300 p-2 text-center">Investment Team</th>
            </tr>
          </thead>
          <tbody>
            {funds.map(fund => (
              <tr key={fund.fund_id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">
                  <Link href={`/funds/${fund.slug}`} className="blue-hyperlink font-medium">
                    {fund.fund_name}
                  </Link>
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <RatingContainer rating={fund.amc_rating ?? 0}>{fund.amc_pedigree}</RatingContainer>
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <RatingContainer rating={fund.amc_team_rating ?? 0}>{fund.team_pedigree}</RatingContainer>
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <RmsFundFmChurnRiskRating rating={fund.inv_team_risk ?? ''} />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <RmsAmcMaturityRating rating={fund.amc_maturity ?? ''} />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <RatingContainer rating={fund.amc_philosophy_rating ?? 0}>{fund.inv_phil_name}</RatingContainer>
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <RatingContainer rating={fund.amc_philosophy_rating ?? 0}>{fund.inv_philosophy_followed}</RatingContainer>
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <RatingContainer rating={fund.amc_team_rating ?? 0}>{fund.core_amc_team}</RatingContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {funds.map(fund => (
          <div key={fund.fund_id} className="border rounded-lg p-4 bg-white shadow-sm">
            <h3 className="font-bold mb-3">
              <Link href={`/funds/${fund.slug}`} className="blue-hyperlink">
                {fund.fund_name}
              </Link>
            </h3>
            <div className="text-xs space-y-2">
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
        ))}
      </div>
    </div>
  );
}

// ========== UPGRADE VERSION (WITH ICONS) ==========

// 1. Fund Ratings Comparison Table (Upgrade)
function FundRatingsComparisonTableUpgrade({ funds }: { funds: RmsFundAmc[] }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold mb-4">How we rate the funds</h2>
      
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Fund Name</th>
              <th className="border border-gray-300 p-2 text-center">Fund</th>
              <th className="border border-gray-300 p-2 text-center">Strategy</th>
              <th className="border border-gray-300 p-2 text-center">Performance</th>
            </tr>
          </thead>
          <tbody>
            {funds.map(fund => (
              <tr key={fund.fund_id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">
                  <Link href={`/funds/${fund.slug}`} className="blue-hyperlink font-medium">
                    {fund.fund_name}
                  </Link>
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <UpgradeIcon clickThroughPath="create-account" />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <UpgradeIcon clickThroughPath="create-account" />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <UpgradeIcon clickThroughPath="create-account" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {funds.map(fund => (
          <div key={fund.fund_id} className="border rounded-lg p-4 bg-white shadow-sm">
            <h3 className="font-bold mb-3">
              <Link href={`/funds/${fund.slug}`} className="blue-hyperlink">
                {fund.fund_name}
              </Link>
            </h3>
            <SimpleTable 
              headers={[{label:"Fund"},{label:"Strategy"},{label:"Performance"}]}
              body={[
                {value:<UpgradeIcon clickThroughPath="create-account" />},
                {value:<UpgradeIcon clickThroughPath="create-account" />},
                {value:<UpgradeIcon clickThroughPath="create-account" />}
              ]}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// 2. Fund Snapshot Comparison Table (Upgrade)
function FundSnapshotComparisonTableUpgrade({ funds }: { funds: RmsFundAmc[] }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold mb-4">Fund Rating Snapshot</h2>
      
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Fund Name</th>
              <th className="border border-gray-300 p-2 text-center">Recommendation</th>
              <th className="border border-gray-300 p-2 text-center">Strategy Definition</th>
              <th className="border border-gray-300 p-2 text-center">5yr Performance</th>
              <th className="border border-gray-300 p-2 text-center">LT Performance</th>
              <th className="border border-gray-300 p-2 text-center">Strategy Desc</th>
            </tr>
          </thead>
          <tbody>
            {funds.map(fund => (
              <tr key={fund.fund_id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">
                  <Link href={`/funds/${fund.slug}`} className="blue-hyperlink font-medium">
                    {fund.fund_name}
                  </Link>
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <UpgradeIcon clickThroughPath="create-account" />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <UpgradeIcon clickThroughPath="create-account" />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <UpgradeIcon clickThroughPath="create-account" />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <UpgradeIcon clickThroughPath="create-account" />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <UpgradeIcon clickThroughPath="create-account" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {funds.map(fund => (
          <div key={fund.fund_id} className="border rounded-lg p-4 bg-white shadow-sm">
            <h3 className="font-bold mb-3">
              <Link href={`/funds/${fund.slug}`} className="blue-hyperlink">
                {fund.fund_name}
              </Link>
            </h3>
            <div className="text-xs space-y-2">
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
        ))}
      </div>
    </div>
  );
}

// 3. AMC Ratings Comparison Table (Upgrade)
function AmcRatingsComparisonTableUpgrade({ funds }: { funds: RmsFundAmc[] }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold mb-4">How we rate the AMCs</h2>
      
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Fund Name</th>
              <th className="border border-gray-300 p-2 text-center">AMC</th>
              <th className="border border-gray-300 p-2 text-center">Pedigree</th>
              <th className="border border-gray-300 p-2 text-center">Team</th>
              <th className="border border-gray-300 p-2 text-center">Philosophy</th>
            </tr>
          </thead>
          <tbody>
            {funds.map(fund => (
              <tr key={fund.fund_id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">
                  <Link href={`/funds/${fund.slug}`} className="blue-hyperlink font-medium">
                    {fund.fund_name}
                  </Link>
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <UpgradeIcon clickThroughPath="create-account" />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <UpgradeIcon clickThroughPath="create-account" />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <UpgradeIcon clickThroughPath="create-account" />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <UpgradeIcon clickThroughPath="create-account" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {funds.map(fund => (
          <div key={fund.fund_id} className="border rounded-lg p-4 bg-white shadow-sm">
            <h3 className="font-bold mb-3">
              <Link href={`/funds/${fund.slug}`} className="blue-hyperlink">
                {fund.fund_name}
              </Link>
            </h3>
            <SimpleTable 
              headers={[{label:"AMC"},{label:"Pedigree"},{label:"Team"},{label:"Philosophy"}]}
              body={[
                {value:<UpgradeIcon clickThroughPath="create-account" />},
                {value:<UpgradeIcon clickThroughPath="create-account" />},
                {value:<UpgradeIcon clickThroughPath="create-account" />},
                {value:<UpgradeIcon clickThroughPath="create-account" />}
              ]}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// 4. AMC Snapshot Comparison Table (Upgrade)
function AmcSnapshotComparisonTableUpgrade({ funds }: { funds: RmsFundAmc[] }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold mb-4">AMC Rating Snapshot</h2>
      
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Fund Name</th>
              <th className="border border-gray-300 p-2 text-center">AMC Pedigree</th>
              <th className="border border-gray-300 p-2 text-center">Team Pedigree</th>
              <th className="border border-gray-300 p-2 text-center">FM Churn Risk</th>
              <th className="border border-gray-300 p-2 text-center">AMC Maturity</th>
              <th className="border border-gray-300 p-2 text-center">Philosophy Name</th>
              <th className="border border-gray-300 p-2 text-center">Inv Philosophy</th>
              <th className="border border-gray-300 p-2 text-center">Investment Team</th>
            </tr>
          </thead>
          <tbody>
            {funds.map(fund => (
              <tr key={fund.fund_id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">
                  <Link href={`/funds/${fund.slug}`} className="blue-hyperlink font-medium">
                    {fund.fund_name}
                  </Link>
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <UpgradeIcon clickThroughPath="create-account" />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <UpgradeIcon clickThroughPath="create-account" />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <UpgradeIcon clickThroughPath="create-account" />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <UpgradeIcon clickThroughPath="create-account" />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <UpgradeIcon clickThroughPath="create-account" />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <UpgradeIcon clickThroughPath="create-account" />
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <UpgradeIcon clickThroughPath="create-account" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {funds.map(fund => (
          <div key={fund.fund_id} className="border rounded-lg p-4 bg-white shadow-sm">
            <h3 className="font-bold mb-3">
              <Link href={`/funds/${fund.slug}`} className="blue-hyperlink">
                {fund.fund_name}
              </Link>
            </h3>
            <div className="text-xs space-y-2">
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
        ))}
      </div>
    </div>
  );
}

// ========== WRAPPER COMPONENTS ==========

// Main wrapper with actual data (for users with permissions)
export function FundAmcComparisonTables({ data }: ComparisonTablesProps) {
  return (
    <div className="space-y-6">
      <FundRatingsComparisonTable funds={data} />
      <FundSnapshotComparisonTable funds={data} />
      <AmcRatingsComparisonTable funds={data} />
      <AmcSnapshotComparisonTable funds={data} />
    </div>
  );
}

// Upgrade wrapper with upgrade icons (for users without permissions)
export function FundAmcComparisonTablesUpgrade({ data }: ComparisonTablesProps) {
  return (
    <div className="space-y-6">
      <FundRatingsComparisonTableUpgrade funds={data} />
      <FundSnapshotComparisonTableUpgrade funds={data} />
      <AmcRatingsComparisonTableUpgrade funds={data} />
      <AmcSnapshotComparisonTableUpgrade funds={data} />
    </div>
  );
}
