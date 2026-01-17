'use client';

import { RmsFundAmc } from "@/types/funds-detail";
import Link from 'next/link';
import { useReactTable, getCoreRowModel, getSortedRowModel, ColumnDef } from "@tanstack/react-table";
import { ReactTableWrapper } from "@/components/data-table/ReactTableWrapper";
import { useMemo } from "react";
import { useResponsiveColumns } from "@/lib/hooks/useResponsiveColumns";
import { 
  RatingDisplayWithStar, 
  RatingContainer, 
  RmsFundFiveYrPerfRating, 
  RmsFundPerfConsistencyRating, 
  RmsAmcMaturityRating, 
  RmsFundStrategyDefRating, 
  RmsFundFmChurnRiskRating,
  ComGrowthNumberRating
} from "@/components/conditional-formatting";
import { UpgradeIcon } from "@/components/uiComponents/upgrade-icon";
import SimpleTable from "@/components/tables/singleRowTable";
import { FlexRms2Col } from "@/components/grids/flex-rms-2col";
import { isMobileView } from "@/lib/hooks/useResponsiveColumns";
import { FavouriteHeart } from "@/components/ui/favourite-heart";
import { AddToComparison } from "@/components/ui/add-to-comparison";

interface ComparisonTablesProps {
  data: RmsFundAmc[];
}

// ========== COLUMN DEFINITIONS (EMBEDDED) ==========

// 1. Fund Ratings Columns (Regular)
const createFundRatingsColumns = (): ColumnDef<RmsFundAmc>[] => [
  {
    id: "is_favourite",
    header: "♥",
    size: 60,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <FavouriteHeart 
          entityType="funds" 
          entityId={row.original.fund_id} 
          size="sm"
        />
        <AddToComparison 
          fundId={row.original.fund_id} 
          size="sm"
        />
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "fund_name",
    header: () => <div className="text-left">Fund Name</div>,
    cell: ({ row, table }) => {
      const fund = row.original;
      if (isMobileView(table)) {
        return (
          <div className="mobile-card">
            <div className="flex flex-row flex-wrap justify-between mb-2">
              <div className="font-semibold text-left shrink">
                <Link href={`/funds/${fund.slug}`} className="blue-hyperlink font-bold">
                  {fund.fund_name}
                </Link>
              </div>
              <div className="flex gap-2">
                <FavouriteHeart 
                  entityType="funds" 
                  entityId={fund.fund_id} 
                  size="sm"
                />
                <AddToComparison 
                  fundId={fund.fund_id} 
                  size="sm"
                />
              </div>
            </div>
            <div className="text-xs text-gray-600 mb-2">
              {fund.structure_name} - {fund.category_long_name}
            </div>
            <SimpleTable 
              headers={[{label:"Fund"},{label:"Strategy"},{label:"Performance"}]}
              body={[
                {value:<RatingDisplayWithStar rating={fund.fund_rating} />},
                {value:<RatingDisplayWithStar rating={fund.fund_strategy_rating} />},
                {value:<RatingDisplayWithStar rating={fund.fund_performance_rating} />}
              ]}
            />
          </div>
        );
      }
      return (
        <Link href={`/funds/${fund.slug}`} className="blue-hyperlink font-medium">
          {fund.fund_name}
        </Link>
      );
    },
    enableSorting: false,
  }, 
  {
    accessorKey: "fund_rating",
    header: () => <div className="text-center">Fund</div>,
    size: 60,
    cell: ({ row }) => <div className="text-center"><RatingDisplayWithStar rating={row.original.fund_rating} /></div>,
    enableSorting: false,
  },
  {
    accessorKey: "fund_strategy_rating",
    header: () => <div className="text-center">Strategy</div>,
    size: 60,
    cell: ({ row }) => <div className="text-center"><RatingDisplayWithStar rating={row.original.fund_strategy_rating} /></div>,
    enableSorting: false,
  },
  {
    accessorKey: "fund_performance_rating",
    header: () => <div className="text-center">Performance</div>,
    size: 60,
    cell: ({ row }) => <div className="text-center"><RatingDisplayWithStar rating={row.original.fund_performance_rating} /></div>,
    enableSorting: false,
  }, 
  {
    accessorKey: "recommendation_tag",
    header: () => <div className="text-center">Recommendation</div>,
    size: 240,
    cell: ({ row }) => <div className="text-center"><RatingContainer rating={row.original.fund_rating ?? 0}>{row.original.recommendation_tag}</RatingContainer></div>,
    enableSorting: false,
  },
  {
    accessorKey: "category_long_name",
    header: () => <div className="text-center">Category</div>,
    size: 120,
    cell: ({ row }) => <div className="text-center">{row.original.structure_name} - {row.original.category_long_name}</div>,
    enableSorting: false,
  },
];

// 2. Fund Snapshot Columns (Regular)
const createFundSnapshotColumns = (): ColumnDef<RmsFundAmc>[] => [
  {
    accessorKey: "fund_name",
    header: () => <div className="text-left">Fund Name</div>,
    size: 200,
    cell: ({ row, table }) => {
      const fund = row.original;
      if (isMobileView(table)) {
        return (
          <div className="mobile-card">
            <div className="font-semibold text-left mb-3">
              <Link href={`/funds/${fund.slug}`} className="blue-hyperlink font-bold">
                {fund.fund_name}
              </Link>
            </div>
            <div className="text-xs space-y-2">
              <FlexRms2Col label="Recommendation">
                <RatingContainer rating={fund.fund_rating ?? 0}>{fund.recommendation_tag}</RatingContainer>
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
        );
      }
      return (
        <Link href={`/funds/${fund.slug}`} className="blue-hyperlink font-medium">
          {fund.fund_name}
        </Link>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "strategy_name",
    header: () => <div className="text-center">Strategy Desc</div>,
    size: 180,
    cell: ({ row }) => <div className="text-center"><RatingContainer rating={row.original.fund_strategy_rating ?? 0}>{row.original.strategy_name}</RatingContainer></div>,
    enableSorting: false,
  },
  {
    accessorKey: "perf_tag_5yr",
    header: () => <div className="text-center">5yr Performance</div>,
    size: 140,
    cell: ({ row }) => <div className="text-center"><RmsFundFiveYrPerfRating rating={row.original.perf_tag_5yr ?? ''} /></div>,
    enableSorting: false,
  },
  {
    accessorKey: "perf_tag_consistent",
    header: () => <div className="text-center">LT Performance</div>,
    size: 140,
    cell: ({ row }) => <div className="text-center"><RmsFundPerfConsistencyRating rating={row.original.perf_tag_consistent ?? ''} /></div>,
    enableSorting: false,
  },
];

// 3. AMC Ratings Columns (Regular)
const createAmcRatingsColumns = (): ColumnDef<RmsFundAmc>[] => [
  {
    accessorKey: "amc_name",
    header: () => <div className="text-left">AMC Name</div>,
    size: 200,
    cell: ({ row, table }) => {
      const fund = row.original;
      if (isMobileView(table)) {
        return (
          <div className="mobile-card">
            <div className="font-semibold text-left mb-2">
              <Link href={`/funds/${fund.slug}`} className="blue-hyperlink font-bold">
                {fund.amc_name}
              </Link>
            </div>
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
        );
      }
      return (
        <Link href={`/funds/${fund.slug}`} className="blue-hyperlink font-medium">
          {fund.amc_name}
        </Link>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "amc_rating",
    header: () => <div className="text-center">AMC</div>,
    size: 120,
    cell: ({ row }) => <div className="text-center"><RatingDisplayWithStar rating={row.original.amc_rating} /></div>,
    enableSorting: false,
  },
  {
    accessorKey: "amc_pedigree_rating",
    header: () => <div className="text-center">Pedigree</div>,
    size: 120,
    cell: ({ row }) => <div className="text-center"><RatingDisplayWithStar rating={row.original.amc_pedigree_rating} /></div>,
    enableSorting: false,
  },
  {
    accessorKey: "amc_team_rating",
    header: () => <div className="text-center">Team</div>,
    size: 120,
    cell: ({ row }) => <div className="text-center"><RatingDisplayWithStar rating={row.original.amc_team_rating} /></div>,
    enableSorting: false,
  },
  {
    accessorKey: "amc_philosophy_rating",
    header: () => <div className="text-center">Philosophy</div>,
    size: 120,
    cell: ({ row }) => <div className="text-center"><RatingDisplayWithStar rating={row.original.amc_philosophy_rating} /></div>,
    enableSorting: false,
  },
];

// 4a. AMC Snapshot Columns Part 1 (Regular) - AMC Info & Philosophy
const createAmcSnapshotColumns1 = (): ColumnDef<RmsFundAmc>[] => [
  {
    accessorKey: "amc_name",
    header: () => <div className="text-left">AMC Name</div>,
    size: 200,
    cell: ({ row, table }) => {
      const fund = row.original;
      if (isMobileView(table)) {
        return (
          <div className="mobile-card">
            <div className="font-semibold text-left mb-3">
              <Link href={fund.amc_slug ? `/amc/${fund.amc_slug}` : '#'} className="blue-hyperlink font-bold">
                {fund.amc_name}
              </Link>
            </div>
            <div className="text-xs space-y-2">
              <FlexRms2Col label="AMC Pedigree">
                <RatingContainer rating={fund.amc_rating ?? 0}>{fund.amc_pedigree}</RatingContainer>
              </FlexRms2Col>
              <FlexRms2Col label="Philosphy Name">
                <RatingContainer rating={fund.amc_philosophy_rating ?? 0}>{fund.inv_phil_name}</RatingContainer>
              </FlexRms2Col>
              <FlexRms2Col label="Inv Philosophy">
                <RatingContainer rating={fund.amc_philosophy_rating ?? 0}>{fund.inv_philosophy_followed}</RatingContainer>
              </FlexRms2Col>
              <FlexRms2Col label="AMC Maturity">
                <RmsAmcMaturityRating rating={fund.amc_maturity ?? ''} />
              </FlexRms2Col>
            </div>
          </div>
        );
      }
      return (
        <Link href={fund.amc_slug ? `/amc/${fund.amc_slug}` : '#'} className="blue-hyperlink font-medium">
          {fund.amc_name}
        </Link>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "amc_pedigree",
    header: () => <div className="text-center">AMC Pedigree</div>,
    size: 140,
    cell: ({ row }) => <div className="text-center"><RatingContainer rating={row.original.amc_rating ?? 0}>{row.original.amc_pedigree}</RatingContainer></div>,
    enableSorting: false,
  },
  {
    accessorKey: "inv_phil_name",
    header: () => <div className="text-center">Philosophy Name</div>,
    size: 160,
    cell: ({ row }) => <div className="text-center"><RatingContainer rating={row.original.amc_philosophy_rating ?? 0}>{row.original.inv_phil_name}</RatingContainer></div>,
    enableSorting: false,
  },
  {
    accessorKey: "inv_philosophy_followed",
    header: () => <div className="text-center">Inv Philosophy</div>,
    size: 160,
    cell: ({ row }) => <div className="text-center"><RatingContainer rating={row.original.amc_philosophy_rating ?? 0}>{row.original.inv_philosophy_followed}</RatingContainer></div>,
    enableSorting: false,
  },
  {
    accessorKey: "amc_maturity",
    header: () => <div className="text-center">AMC Maturity</div>,
    size: 140,
    cell: ({ row }) => <div className="text-center"><RmsAmcMaturityRating rating={row.original.amc_maturity ?? ''} /></div>,
    enableSorting: false,
  },
];

// 4b. AMC Snapshot Columns Part 2 (Regular) - Team Info
const createAmcSnapshotColumns2 = (): ColumnDef<RmsFundAmc>[] => [
  {
    accessorKey: "amc_name",
    header: () => <div className="text-left">AMC Name</div>,
    size: 200,
    cell: ({ row, table }) => {
      const fund = row.original;
      if (isMobileView(table)) {
        return (
          <div className="mobile-card">
            <div className="font-semibold text-left mb-3">
              <Link href={fund.amc_slug ? `/amc/${fund.amc_slug}` : '#'} className="blue-hyperlink font-bold">
                {fund.amc_name}
              </Link>
            </div>
            <div className="text-xs space-y-2">
              <FlexRms2Col label="Investment Team">
                <RatingContainer rating={fund.amc_team_rating ?? 0}>{fund.core_amc_team}</RatingContainer>
              </FlexRms2Col>
              <FlexRms2Col label="Team Pedigree">
                <RatingContainer rating={fund.amc_team_rating ?? 0}>{fund.team_pedigree}</RatingContainer>
              </FlexRms2Col>
              <FlexRms2Col label="FM Churn Risk">
                <RmsFundFmChurnRiskRating rating={fund.inv_team_risk ?? ''} />
              </FlexRms2Col>
            </div>
          </div>
        );
      }
      return (
        <Link href={fund.amc_slug ? `/amc/${fund.amc_slug}` : '#'} className="blue-hyperlink font-medium">
          {fund.amc_name}
        </Link>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "core_amc_team",
    header: () => <div className="text-center">Investment Team</div>,
    size: 180,
    cell: ({ row }) => <div className="text-center"><RatingContainer rating={row.original.amc_team_rating ?? 0}>{row.original.core_amc_team}</RatingContainer></div>,
    enableSorting: false,
  },
  {
    accessorKey: "team_pedigree",
    header: () => <div className="text-center">Team Pedigree</div>,
    size: 140,
    cell: ({ row }) => <div className="text-center"><RatingContainer rating={row.original.amc_team_rating ?? 0}>{row.original.team_pedigree}</RatingContainer></div>,
    enableSorting: false,
  },
  {
    accessorKey: "inv_team_risk",
    header: () => <div className="text-center">FM Churn Risk</div>,
    size: 140,
    cell: ({ row }) => <div className="text-center"><RmsFundFmChurnRiskRating rating={row.original.inv_team_risk ?? ''} /></div>,
    enableSorting: false,
  },
];

// ========== UPGRADE COLUMN DEFINITIONS ==========

// 1. Fund Ratings Columns (Upgrade)
const createFundRatingsColumnsUpgrade = (): ColumnDef<RmsFundAmc>[] => [
  {
    id: "is_favourite",
    header: "♥",
    size: 80,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <FavouriteHeart 
          entityType="funds" 
          entityId={row.original.fund_id} 
          size="sm"
        />
        <AddToComparison 
          fundId={row.original.fund_id} 
          size="sm"
        />
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "fund_name",
    header: () => <div className="text-left">Fund Name</div>,
    size: 200,
    cell: ({ row, table }) => {
      const fund = row.original;
      if (isMobileView(table)) {
        return (
          <div className="mobile-card">
            <div className="flex flex-row flex-wrap justify-between mb-2">
              <div className="font-semibold text-left shrink">
                <Link href={`/funds/${fund.slug}`} className="blue-hyperlink font-bold">
                  {fund.fund_name}
                </Link>
              </div>
              <div className="flex gap-2">
                <FavouriteHeart 
                  entityType="funds" 
                  entityId={fund.fund_id} 
                  size="sm"
                />
                <AddToComparison 
                  fundId={fund.fund_id} 
                  size="sm"
                />
              </div>
            </div>
            <div className="text-xs text-gray-600 mb-2">
              {fund.structure_name} - {fund.category_long_name}
            </div>
            <SimpleTable 
              headers={[{label:"Fund"},{label:"Strategy"},{label:"Performance"}]}
              body={[
                {value:<UpgradeIcon clickThroughPath="create-account" />},
                {value:<UpgradeIcon clickThroughPath="create-account" />},
                {value:<UpgradeIcon clickThroughPath="create-account" />}
              ]}
            />
          </div>
        );
      }
      return (
        <Link href={`/funds/${fund.slug}`} className="blue-hyperlink font-medium">
          {fund.fund_name}
        </Link>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "structure_name",
    header: () => <div className="text-center">Structure</div>,
    size: 120,
    cell: ({ row }) => <div className="text-center">{row.original.structure_name}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "category_long_name",
    header: () => <div className="text-center">Category</div>,
    size: 180,
    cell: ({ row }) => <div className="text-center">{row.original.category_long_name}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "fund_rating",
    header: () => <div className="text-center">Fund</div>,
    size: 120,
    cell: () => <div className="text-center"><UpgradeIcon clickThroughPath="create-account" /></div>,
    enableSorting: false,
  },
  {
    accessorKey: "fund_strategy_rating",
    header: () => <div className="text-center">Strategy</div>,
    size: 120,
    cell: () => <div className="text-center"><UpgradeIcon clickThroughPath="create-account" /></div>,
    enableSorting: false,
  },
  {
    accessorKey: "fund_performance_rating",
    header: () => <div className="text-center">Performance</div>,
    size: 120,
    cell: () => <div className="text-center"><UpgradeIcon clickThroughPath="create-account" /></div>,
    enableSorting: false,
  },
];

// 2. Fund Snapshot Columns (Upgrade)
const createFundSnapshotColumnsUpgrade = (): ColumnDef<RmsFundAmc>[] => [
  {
    accessorKey: "fund_name",
    header: () => <div className="text-left">Fund Name</div>,
    size: 200,
    cell: ({ row, table }) => {
      const fund = row.original;
      if (isMobileView(table)) {
        return (
          <div className="mobile-card">
            <div className="font-semibold text-left mb-3">
              <Link href={`/funds/${fund.slug}`} className="blue-hyperlink font-bold">
                {fund.fund_name}
              </Link>
            </div>
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
        );
      }
      return (
        <Link href={`/funds/${fund.slug}`} className="blue-hyperlink font-medium">
          {fund.fund_name}
        </Link>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "recommendation_tag",
    header: () => <div className="text-center">Recommendation</div>,
    size: 140,
    cell: () => <div className="text-center"><UpgradeIcon clickThroughPath="create-account" /></div>,
    enableSorting: false,
  },
  {
    accessorKey: "strategy_tag",
    header: () => <div className="text-center">Strategy Definition</div>,
    size: 160,
    cell: () => <div className="text-center"><UpgradeIcon clickThroughPath="create-account" /></div>,
    enableSorting: false,
  },
  {
    accessorKey: "perf_tag_5yr",
    header: () => <div className="text-center">5yr Performance</div>,
    size: 140,
    cell: () => <div className="text-center"><UpgradeIcon clickThroughPath="create-account" /></div>,
    enableSorting: false,
  },
  {
    accessorKey: "perf_tag_consistent",
    header: () => <div className="text-center">LT Performance</div>,
    size: 140,
    cell: () => <div className="text-center"><UpgradeIcon clickThroughPath="create-account" /></div>,
    enableSorting: false,
  },
  {
    accessorKey: "strategy_name",
    header: () => <div className="text-center">Strategy Desc</div>,
    size: 180,
    cell: () => <div className="text-center"><UpgradeIcon clickThroughPath="create-account" /></div>,
    enableSorting: false,
  },
];

// 3. AMC Ratings Columns (Upgrade)
const createAmcRatingsColumnsUpgrade = (): ColumnDef<RmsFundAmc>[] => [
  {
    accessorKey: "fund_name",
    header: () => <div className="text-left">Fund Name</div>,
    size: 200,
    cell: ({ row, table }) => {
      const fund = row.original;
      if (isMobileView(table)) {
        return (
          <div className="mobile-card">
            <div className="font-semibold text-left mb-2">
              <Link href={`/funds/${fund.slug}`} className="blue-hyperlink font-bold">
                {fund.fund_name}
              </Link>
            </div>
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
        );
      }
      return (
        <Link href={`/funds/${fund.slug}`} className="blue-hyperlink font-medium">
          {fund.fund_name}
        </Link>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "amc_rating",
    header: () => <div className="text-center">AMC</div>,
    size: 120,
    cell: () => <div className="text-center"><UpgradeIcon clickThroughPath="create-account" /></div>,
    enableSorting: false,
  },
  {
    accessorKey: "amc_pedigree_rating",
    header: () => <div className="text-center">Pedigree</div>,
    size: 120,
    cell: () => <div className="text-center"><UpgradeIcon clickThroughPath="create-account" /></div>,
    enableSorting: false,
  },
  {
    accessorKey: "amc_team_rating",
    header: () => <div className="text-center">Team</div>,
    size: 120,
    cell: () => <div className="text-center"><UpgradeIcon clickThroughPath="create-account" /></div>,
    enableSorting: false,
  },
  {
    accessorKey: "amc_philosophy_rating",
    header: () => <div className="text-center">Philosophy</div>,
    size: 120,
    cell: () => <div className="text-center"><UpgradeIcon clickThroughPath="create-account" /></div>,
    enableSorting: false,
  },
];

// 4a. AMC Snapshot Columns Part 1 (Upgrade) - AMC Info & Philosophy
const createAmcSnapshotColumnsUpgrade1 = (): ColumnDef<RmsFundAmc>[] => [
  {
    accessorKey: "amc_name",
    header: () => <div className="text-left">AMC Name</div>,
    size: 200,
    cell: ({ row, table }) => {
      const fund = row.original;
      if (isMobileView(table)) {
        return (
          <div className="mobile-card">
            <div className="font-semibold text-left mb-3">
              <Link href={fund.amc_slug ? `/amc/${fund.amc_slug}` : '#'} className="blue-hyperlink font-bold">
                {fund.amc_name}
              </Link>
            </div>
            <div className="text-xs space-y-2">
              <FlexRms2Col label="AMC Pedigree">
                <UpgradeIcon clickThroughPath="create-account" />
              </FlexRms2Col>
              <FlexRms2Col label="Philosphy Name">
                <UpgradeIcon clickThroughPath="create-account" />
              </FlexRms2Col>
              <FlexRms2Col label="Inv Philosophy">
                <UpgradeIcon clickThroughPath="create-account" />
              </FlexRms2Col>
              <FlexRms2Col label="AMC Maturity">
                <UpgradeIcon clickThroughPath="create-account" />
              </FlexRms2Col>
            </div>
          </div>
        );
      }
      return (
        <Link href={fund.amc_slug ? `/amc/${fund.amc_slug}` : '#'} className="blue-hyperlink font-medium">
          {fund.amc_name}
        </Link>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "amc_pedigree",
    header: () => <div className="text-center">AMC Pedigree</div>,
    size: 140,
    cell: () => <div className="text-center"><UpgradeIcon clickThroughPath="create-account" /></div>,
    enableSorting: false,
  },
  {
    accessorKey: "inv_phil_name",
    header: () => <div className="text-center">Philosophy Name</div>,
    size: 160,
    cell: () => <div className="text-center"><UpgradeIcon clickThroughPath="create-account" /></div>,
    enableSorting: false,
  },
  {
    accessorKey: "inv_philosophy_followed",
    header: () => <div className="text-center">Inv Philosophy</div>,
    size: 160,
    cell: () => <div className="text-center"><UpgradeIcon clickThroughPath="create-account" /></div>,
    enableSorting: false,
  },
  {
    accessorKey: "amc_maturity",
    header: () => <div className="text-center">AMC Maturity</div>,
    size: 140,
    cell: () => <div className="text-center"><UpgradeIcon clickThroughPath="create-account" /></div>,
    enableSorting: false,
  },
];

// 4b. AMC Snapshot Columns Part 2 (Upgrade) - Team Info
const createAmcSnapshotColumnsUpgrade2 = (): ColumnDef<RmsFundAmc>[] => [
  {
    accessorKey: "amc_name",
    header: () => <div className="text-left">AMC Name</div>,
    size: 200,
    cell: ({ row, table }) => {
      const fund = row.original;
      if (isMobileView(table)) {
        return (
          <div className="mobile-card">
            <div className="font-semibold text-left mb-3">
              <Link href={fund.amc_slug ? `/amc/${fund.amc_slug}` : '#'} className="blue-hyperlink font-bold">
                {fund.amc_name}
              </Link>
            </div>
            <div className="text-xs space-y-2">
              <FlexRms2Col label="Investment Team">
                <UpgradeIcon clickThroughPath="create-account" />
              </FlexRms2Col>
              <FlexRms2Col label="Team Pedigree">
                <UpgradeIcon clickThroughPath="create-account" />
              </FlexRms2Col>
              <FlexRms2Col label="FM Churn Risk">
                <UpgradeIcon clickThroughPath="create-account" />
              </FlexRms2Col>
            </div>
          </div>
        );
      }
      return (
        <Link href={fund.amc_slug ? `/amc/${fund.amc_slug}` : '#'} className="blue-hyperlink font-medium">
          {fund.amc_name}
        </Link>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "core_amc_team",
    header: () => <div className="text-center">Investment Team</div>,
    size: 180,
    cell: () => <div className="text-center"><UpgradeIcon clickThroughPath="create-account" /></div>,
    enableSorting: false,
  },
  {
    accessorKey: "team_pedigree",
    header: () => <div className="text-center">Team Pedigree</div>,
    size: 140,
    cell: () => <div className="text-center"><UpgradeIcon clickThroughPath="create-account" /></div>,
    enableSorting: false,
  },
  {
    accessorKey: "inv_team_risk",
    header: () => <div className="text-center">FM Churn Risk</div>,
    size: 140,
    cell: () => <div className="text-center"><UpgradeIcon clickThroughPath="create-account" /></div>,
    enableSorting: false,
  },
];

// ========== HELPER FUNCTIONS ==========

// Get unique AMCs from funds array (deduplicate by amc_id)
const getUniqueAmcs = (funds: RmsFundAmc[]): RmsFundAmc[] => {
  const seenAmcIds = new Set<number | null>();
  return funds.filter(fund => {
    if (fund.amc_id === null || fund.amc_id === undefined) {
      return false; // Skip funds without AMC
    }
    if (seenAmcIds.has(fund.amc_id)) {
      return false; // Skip duplicate AMC
    }
    seenAmcIds.add(fund.amc_id);
    return true; // Keep first occurrence of this AMC
  });
};

// ========== TABLE COMPONENTS ==========

// 1. Fund Ratings Comparison Table (Regular)
function FundRatingsComparisonTable({ funds }: { funds: RmsFundAmc[] }) {
  const columns = useMemo(() => createFundRatingsColumns(), []);
  const { responsiveColumns } = useResponsiveColumns(columns, 'fund_name');

  const table = useReactTable({
    data: funds,
    columns: responsiveColumns,
    getCoreRowModel: getCoreRowModel(),
    enableSorting: false,
  });

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold mb-4">How we rate the funds</h2>
      <ReactTableWrapper table={table} className="text-xs text-center" showPagination={false} showSearch={false} />
    </div>
  );
}

// 2. Fund Snapshot Comparison Table (Regular)
function FundSnapshotComparisonTable({ funds }: { funds: RmsFundAmc[] }) {
  const columns = useMemo(() => createFundSnapshotColumns(), []);
  const { responsiveColumns } = useResponsiveColumns(columns, 'fund_name');

  const table = useReactTable({
    data: funds,
    columns: responsiveColumns,
    getCoreRowModel: getCoreRowModel(),
    enableSorting: false,
  });

  return (
    <div className="mb-8">
      <h3>Fund Rating Snapshot</h3>
      <ReactTableWrapper table={table} className="text-xs text-center" showPagination={false} showSearch={false} />
    </div>
  );
}

// 3. AMC Ratings Comparison Table (Regular)
function AmcRatingsComparisonTable({ funds }: { funds: RmsFundAmc[] }) {
  // Get unique AMCs only
  const uniqueAmcs = useMemo(() => getUniqueAmcs(funds), [funds]);
  
  const columns = useMemo(() => createAmcRatingsColumns(), []);
  const { responsiveColumns } = useResponsiveColumns(columns, 'amc_name');

  const table = useReactTable({
    data: uniqueAmcs,
    columns: responsiveColumns,
    getCoreRowModel: getCoreRowModel(),
    enableSorting: false,
  });

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold mb-4">How we rate the AMCs</h2>
      <ReactTableWrapper table={table} className="text-xs text-center" showPagination={false} showSearch={false} />
    </div>
  );
}

// 4a. AMC Snapshot Comparison Table Part 1 (Regular) - AMC Info & Philosophy
function AmcSnapshotComparisonTable1({ funds }: { funds: RmsFundAmc[] }) {
  // Get unique AMCs only
  const uniqueAmcs = useMemo(() => getUniqueAmcs(funds), [funds]);
  
  const columns = useMemo(() => createAmcSnapshotColumns1(), []);
  const { responsiveColumns } = useResponsiveColumns(columns, 'amc_name');

  const table = useReactTable({
    data: uniqueAmcs,
    columns: responsiveColumns,
    getCoreRowModel: getCoreRowModel(),
    enableSorting: false,
  });

  return (
    <div className="mb-8">
      <h3>AMC Rating Snapshot</h3>
      <ReactTableWrapper table={table} className="text-xs text-center" showPagination={false} showSearch={false} />
    </div>
  );
}

// 4b. AMC Snapshot Comparison Table Part 2 (Regular) - Team Info
function AmcSnapshotComparisonTable2({ funds }: { funds: RmsFundAmc[] }) {
  // Get unique AMCs only
  const uniqueAmcs = useMemo(() => getUniqueAmcs(funds), [funds]);
  
  const columns = useMemo(() => createAmcSnapshotColumns2(), []);
  const { responsiveColumns } = useResponsiveColumns(columns, 'amc_name');

  const table = useReactTable({
    data: uniqueAmcs,
    columns: responsiveColumns,
    getCoreRowModel: getCoreRowModel(),
    enableSorting: false,
  });

  return (
    <div className="mb-8">
      <h3>Invesmtent Team's Pedigree</h3>
      <ReactTableWrapper table={table} className="text-xs text-center" showPagination={false} showSearch={false} />
    </div>
  );
}

// ========== UPGRADE VERSION TABLES ==========

// 1. Fund Ratings Comparison Table (Upgrade)
function FundRatingsComparisonTableUpgrade({ funds }: { funds: RmsFundAmc[] }) {
  const columns = useMemo(() => createFundRatingsColumnsUpgrade(), []);
  const { responsiveColumns } = useResponsiveColumns(columns, 'fund_name');

  const table = useReactTable({
    data: funds,
    columns: responsiveColumns,
    getCoreRowModel: getCoreRowModel(),
    enableSorting: false,
  });

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold mb-4">How we rate the funds</h2>
      <ReactTableWrapper table={table} className="text-xs text-center" showPagination={false} showSearch={false} />
    </div>
  );
}

// 2. Fund Snapshot Comparison Table (Upgrade)
function FundSnapshotComparisonTableUpgrade({ funds }: { funds: RmsFundAmc[] }) {
  const columns = useMemo(() => createFundSnapshotColumnsUpgrade(), []);
  const { responsiveColumns } = useResponsiveColumns(columns, 'fund_name');

  const table = useReactTable({
    data: funds,
    columns: responsiveColumns,
    getCoreRowModel: getCoreRowModel(),
    enableSorting: false,
  });

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold mb-4">Fund Rating Snapshot</h2>
      <ReactTableWrapper table={table} className="text-xs text-center" showPagination={false} showSearch={false} />
    </div>
  );
}

// 3. AMC Ratings Comparison Table (Upgrade)
function AmcRatingsComparisonTableUpgrade({ funds }: { funds: RmsFundAmc[] }) {
  // Get unique AMCs only
  const uniqueAmcs = useMemo(() => getUniqueAmcs(funds), [funds]);
  
  const columns = useMemo(() => createAmcRatingsColumnsUpgrade(), []);
  const { responsiveColumns } = useResponsiveColumns(columns, 'amc_name');

  const table = useReactTable({
    data: uniqueAmcs,
    columns: responsiveColumns,
    getCoreRowModel: getCoreRowModel(),
    enableSorting: false,
  });

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold mb-4">How we rate the AMCs</h2>
      <ReactTableWrapper table={table} className="text-xs text-center" showPagination={false} showSearch={false} />
    </div>
  );
}

// 4a. AMC Snapshot Comparison Table Part 1 (Upgrade) - AMC Info & Philosophy
function AmcSnapshotComparisonTableUpgrade1({ funds }: { funds: RmsFundAmc[] }) {
  // Get unique AMCs only
  const uniqueAmcs = useMemo(() => getUniqueAmcs(funds), [funds]);
  
  const columns = useMemo(() => createAmcSnapshotColumnsUpgrade1(), []);
  const { responsiveColumns } = useResponsiveColumns(columns, 'amc_name');

  const table = useReactTable({
    data: uniqueAmcs,
    columns: responsiveColumns,
    getCoreRowModel: getCoreRowModel(),
    enableSorting: false,
  });

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold mb-4">AMC Rating Snapshot</h2>
      <ReactTableWrapper table={table} className="text-xs text-center" showPagination={false} showSearch={false} />
    </div>
  );
}

// 4b. AMC Snapshot Comparison Table Part 2 (Upgrade) - Team Info
function AmcSnapshotComparisonTableUpgrade2({ funds }: { funds: RmsFundAmc[] }) {
  // Get unique AMCs only
  const uniqueAmcs = useMemo(() => getUniqueAmcs(funds), [funds]);
  
  const columns = useMemo(() => createAmcSnapshotColumnsUpgrade2(), []);
  const { responsiveColumns } = useResponsiveColumns(columns, 'amc_name');

  const table = useReactTable({
    data: uniqueAmcs,
    columns: responsiveColumns,
    getCoreRowModel: getCoreRowModel(),
    enableSorting: false,
  });

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold mb-4">AMC Team Snapshot</h2>
      <ReactTableWrapper table={table} className="text-xs text-center" showPagination={false} showSearch={false} />
    </div>
  );
}

// 5. Performance Comparison Table (Regular)
function PerformanceComparisonTable({ funds }: { funds: RmsFundAmc[] }) {
  const columns = useMemo(() => createPerformanceComparisonColumns(), []);
  const { responsiveColumns } = useResponsiveColumns(columns, 'fund_name');

  const table = useReactTable({
    data: funds,
    columns: responsiveColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSortingRemoval: false,
  });

  return (
    <div className="mb-8">
      <h3>Performance Comparison</h3>
      <ReactTableWrapper table={table} className="text-xs text-center" showPagination={false} showSearch={false} />
    </div>
  );
}

// 5. Performance Comparison Table (Upgrade)
function PerformanceComparisonTableUpgrade({ funds }: { funds: RmsFundAmc[] }) {
  const columns = useMemo(() => createPerformanceComparisonColumnsUpgrade(), []);
  const { responsiveColumns } = useResponsiveColumns(columns, 'fund_name');

  const table = useReactTable({
    data: funds,
    columns: responsiveColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSortingRemoval: false,
  });

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold mb-4">Performance Comparison</h2>
      <ReactTableWrapper table={table} className="text-xs text-center" showPagination={false} showSearch={false} />
    </div>
  );
}

// ========== PERFORMANCE COMPARISON COLUMNS ==========

// Performance Comparison Columns (Regular)
const createPerformanceComparisonColumns = (): ColumnDef<RmsFundAmc>[] => [
  {
    accessorKey: "fund_name",
    header: () => <div className="text-left">Fund Name</div>,
    size: 200,
    cell: ({ row, table }) => {
      const fund = row.original;
      if (isMobileView(table)) {
        return (
          <div className="mobile-card">
            <div className="font-semibold text-left mb-2">
              <Link href={`/funds/${fund.slug}`} className="blue-hyperlink font-bold">
                {fund.fund_name}
              </Link>
            </div>
            <SimpleTable 
              headers={[{label:"Rating"},{label:"1yr"},{label:"3yr"},{label:"5yr"}]}
              body={[
                {value:<RatingDisplayWithStar rating={fund.fund_rating} />},
                {value:<ComGrowthNumberRating rating={fund.one_yr as number} />},
                {value:<ComGrowthNumberRating rating={fund.three_yr as number} />},
                {value:<ComGrowthNumberRating rating={fund.five_yr as number} />}
              ]}
            />
          </div>
        );
      }
      return (
        <Link href={`/funds/${fund.slug}`} className="blue-hyperlink font-medium">
          {fund.fund_name}
        </Link>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "fund_rating",
    header: () => <div className="text-center">Fund Rating</div>,
    size: 120,
    cell: ({ row }) => <div className="text-center"><RatingDisplayWithStar rating={row.original.fund_rating} /></div>,
    enableSorting: true,
  },
  {
    accessorKey: "one_yr",
    header: () => <div className="text-center">1 Year</div>,
    size: 120,
    cell: ({ row }) => <div className="text-center"><ComGrowthNumberRating rating={row.original.one_yr as number} /></div>,
    enableSorting: true,
  },
  {
    accessorKey: "three_yr",
    header: () => <div className="text-center">3 Year</div>,
    size: 120,
    cell: ({ row }) => <div className="text-center"><ComGrowthNumberRating rating={row.original.three_yr as number} /></div>,
    enableSorting: true,
  },
  {
    accessorKey: "five_yr",
    header: () => <div className="text-center">5 Year</div>,
    size: 120,
    cell: ({ row }) => <div className="text-center"><ComGrowthNumberRating rating={row.original.five_yr as number} /></div>,
    enableSorting: true,
  },
];

// Performance Comparison Columns (Upgrade)
const createPerformanceComparisonColumnsUpgrade = (): ColumnDef<RmsFundAmc>[] => [
  {
    accessorKey: "fund_name",
    header: () => <div className="text-left">Fund Name</div>,
    size: 200,
    cell: ({ row, table }) => {
      const fund = row.original;
      if (isMobileView(table)) {
        return (
          <div className="mobile-card">
            <div className="font-semibold text-left mb-2">
              <Link href={`/funds/${fund.slug}`} className="blue-hyperlink font-bold">
                {fund.fund_name}
              </Link>
            </div>
            <SimpleTable 
              headers={[{label:"Rating"},{label:"1yr"},{label:"3yr"},{label:"5yr"}]}
              body={[
                {value:<UpgradeIcon clickThroughPath="create-account" />},
                {value:<UpgradeIcon clickThroughPath="create-account" />},
                {value:<UpgradeIcon clickThroughPath="create-account" />},
                {value:<UpgradeIcon clickThroughPath="create-account" />}
              ]}
            />
          </div>
        );
      }
      return (
        <Link href={`/funds/${fund.slug}`} className="blue-hyperlink font-medium">
          {fund.fund_name}
        </Link>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "fund_rating",
    header: () => <div className="text-center">Fund Rating</div>,
    size: 120,
    cell: () => <div className="text-center"><UpgradeIcon clickThroughPath="create-account" /></div>,
    enableSorting: true,
  },
  {
    accessorKey: "one_yr",
    header: () => <div className="text-center">1 Year</div>,
    size: 120,
    cell: () => <div className="text-center"><UpgradeIcon clickThroughPath="create-account" /></div>,
    enableSorting: true,
  },
  {
    accessorKey: "three_yr",
    header: () => <div className="text-center">3 Year</div>,
    size: 120,
    cell: () => <div className="text-center"><UpgradeIcon clickThroughPath="create-account" /></div>,
    enableSorting: true,
  },
  {
    accessorKey: "five_yr",
    header: () => <div className="text-center">5 Year</div>,
    size: 120,
    cell: () => <div className="text-center"><UpgradeIcon clickThroughPath="create-account" /></div>,
    enableSorting: true,
  },
];

// ========== WRAPPER COMPONENTS ==========

// Main wrapper with actual data (for users with permissions)
export function FundAmcComparisonTables({ data }: ComparisonTablesProps) {
  return (
    <div className="space-y-16">
      <FundRatingsComparisonTable funds={data} />
      <PerformanceComparisonTable funds={data} />
      <FundSnapshotComparisonTable funds={data} />
      <AmcRatingsComparisonTable funds={data} />
      <AmcSnapshotComparisonTable1 funds={data} />
      <AmcSnapshotComparisonTable2 funds={data} />
      
    </div>
  );
}

// Upgrade wrapper with upgrade icons (for users without permissions)
export function FundAmcComparisonTablesUpgrade({ data }: ComparisonTablesProps) {
  return (
    <div className="space-y-6">
      <FundRatingsComparisonTableUpgrade funds={data} />
      <PerformanceComparisonTableUpgrade funds={data} />
      <FundSnapshotComparisonTableUpgrade funds={data} />
      <AmcRatingsComparisonTableUpgrade funds={data} />
      <AmcSnapshotComparisonTableUpgrade1 funds={data} />
      <AmcSnapshotComparisonTableUpgrade2 funds={data} />
      
    </div>
  );
}
