import { ColumnDef } from "@tanstack/react-table";  
import { RmsFundsScreener } from "@/types/funds-detail";
import Link from "next/link";
import { ComGrowthNumberRating, RatingDisplay, RatingDisplayWithStar } from "@/components/conditional-formatting";
import { FavouriteHeart } from "@/components/ui/favourite-heart";
import { AddToComparison } from "@/components/ui/add-to-comparison";
import { isMobileView } from "@/lib/hooks/useResponsiveColumns";
import SimpleTable from "@/components/tables/singleRowTable";
import { UpgradeIcon } from "@/components/uiComponents/upgrade-icon";
import { can } from "@/lib/permissions";

// Create columns with permission-based rendering
// Permission is checked ONCE when columns are created, not per cell
export const createColumns = (userRoles: string | null): ColumnDef<RmsFundsScreener>[] => {
  // ✅ Check permission ONCE at the top
  const hasDetailedAccess = can(userRoles, 'rms', 'view_detailed');

  return [
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
    enableSorting: true,
    meta: { isFilterOnly: false }
  },
  {
    accessorKey: "fund_name",
    header: () => <div className="text-left hidden md:block">Fund Name</div>,
    size: 275,
    cell: ({ row, table }) => {
      const fundSlug = row.original.slug;
      const fundName = row.original.fund_name;

      if (isMobileView(table)) {
        // Mobile view - show as card
        return (
          <div className="mobile-card">
            <div className="flex flex-row flex-wrap justify-between">
              <div className="font-semibold text-left shrink">
                <Link href={`/funds/${fundSlug}`} className="text-blue-600 font-bold text-sm">
                  {fundName}
                </Link>
                <div className="text-xs text-gray-600">{row.original.structure_name} - {row.original.cat_long_name}</div>
              </div>
              
              <div className="flex gap-2">
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
            </div>
            <SimpleTable 
              headers={[{ label: "Rating" }, { label: "1yr" }, { label: "3yr" }, { label: "5yr" }]}
              body={[
                { value: hasDetailedAccess ? <RatingDisplay rating={row.original.fund_rating} /> : <UpgradeIcon clickThroughPath="create-account" /> }, 
                { value: <ComGrowthNumberRating rating={row.original.one_yr as number} /> }, 
                { value: <ComGrowthNumberRating rating={row.original.three_yr as number} /> }, 
                { value: <ComGrowthNumberRating rating={row.original.five_yr as number} /> }
              ]}
            />
          </div>
        );
      } else {
        // Desktop view - show as normal table cell
        return (
          <div className="text-left">
            <Link href={`/funds/${fundSlug}`} className="text-blue-600 font-bold hover:underline">
              {fundName}
            </Link>
          </div>
        );
      }
    }
  },    
  {
    accessorKey: "fund_rating",
    header: "Fund",
    filterFn: "arrIncludesSome",
    size: 100,
    cell: ({ getValue }) => 
      hasDetailedAccess 
        ? <RatingDisplayWithStar rating={getValue() as number} />
        : <UpgradeIcon clickThroughPath="create-account" />
  },
  {
    accessorKey: "fund_performance_rating",
    header: "Perf",
    size: 100,
    cell: ({ getValue }) => 
      hasDetailedAccess 
        ? <RatingDisplay rating={getValue() as number} />
        : <UpgradeIcon clickThroughPath="create-account" />
  },
  {
    accessorKey: "amc_name",
    header: "AMC Name",
    filterFn: "arrIncludesSome",
    meta: { isFilterOnly: true },
  },
  {
    accessorKey: "amc_rating",
    header: "AMC",
    size: 100,
    cell: ({ getValue }) => 
      hasDetailedAccess 
        ? <RatingDisplay rating={getValue() as number} />
        : <UpgradeIcon clickThroughPath="create-account" />
  },
  {
    accessorKey: "asset_class_name",
    header: "Asset Class",
    meta: { isFilterOnly: true },
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "structure_name",
    header: "Structure",
    size: 100,
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "category_name",
    header: "Category",
    meta: { isFilterOnly: true },
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "cat_long_name",
    header: "Category",
  },
  {
    accessorKey: "open_for_subscription",
    header: "Open for Subscription",
    meta: { isFilterOnly: true },
  },
  {
    accessorKey: "estate_duty_exposure",
    header: "Estate Duty Exposure",
    meta: { isFilterOnly: true },
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "us_investors",
    header: "US Investors",
    meta: { isFilterOnly: true },
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "one_yr",
    header: "1 Year",
    size: 100,
    cell: ({ getValue }) => <ComGrowthNumberRating rating={getValue() as number} />
  },
  {
    accessorKey: "three_yr",
    header: "3 Year",
    size: 100,
    cell: ({ getValue }) => <ComGrowthNumberRating rating={getValue() as number} />
  },
  {
    accessorKey: "five_yr",
    header: "5 Year",
    size: 100,
    cell: ({ getValue }) => <ComGrowthNumberRating rating={getValue() as number} />
  },
  {
    accessorKey: "since_inception",
    header: "Since Inception",
    size: 100,
    cell: ({ getValue }) => <ComGrowthNumberRating rating={getValue() as number} />
  },
  ];
};