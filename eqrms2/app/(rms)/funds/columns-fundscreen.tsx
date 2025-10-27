import { ColumnDef } from "@tanstack/react-table";  
import { RmsFundsScreener } from "@/types/funds-detail";
import Link from "next/link";
import { ComGrowthNumberRating, RatingDisplay, RatingDisplayWithStar } from "@/components/conditional-formatting";
import { FavouriteHeart } from "@/components/ui/favourite-heart";
import { isMobileView } from "@/lib/hooks/useResponsiveColumns";
import SimpleTable from "@/components/tables/singleRowTable";

export const columns: ColumnDef<RmsFundsScreener>[] = [
  {
    id: "is_favourite",
    header: "♥",
    size: 40,
    cell: ({ row }) => (
      <FavouriteHeart 
        entityType="funds" 
        entityId={row.original.fund_id} 
        size="sm"
      />
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
              
              <FavouriteHeart 
                entityType="funds" 
                entityId={row.original.fund_id} 
                size="sm"
              />
            </div>
            <SimpleTable 
              headers={[{ label: "Rating" }, { label: "1yr" }, { label: "3yr" }, { label: "5yr" }]}
              body={[{ value: <RatingDisplay rating={row.original.fund_rating} /> }, { value: <ComGrowthNumberRating rating={row.original.one_yr as number} /> }, { value: <ComGrowthNumberRating rating={row.original.three_yr as number} /> }, { value: <ComGrowthNumberRating rating={row.original.five_yr as number} /> }]}
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
    cell: ({ getValue }) => <RatingDisplayWithStar rating={getValue() as number} />
  },
  {
    accessorKey: "fund_performance_rating",
    header: "Perf",
    size: 100,
    cell: ({ getValue }) => <RatingDisplay rating={getValue() as number} />
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
    cell: ({ getValue }) => <RatingDisplay rating={getValue() as number} />
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