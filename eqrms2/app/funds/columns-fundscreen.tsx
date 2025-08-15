import { ColumnDef } from "@tanstack/react-table";  
import { RmsFundsScreener } from "@/types/funds-detail";
import Link from "next/link";
import { ComGrowthNumberRating, RatingDisplay } from "@/components/conditional-formatting";
import { FavouriteHeart } from "@/components/ui/favourite-heart";
import { isMobileView } from "@/lib/hooks/useResponsiveColumns";

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
    header: () => <div className="text-left">Fund Name</div>,
    size: 275,
    cell: ({ row, table }) => {
      const fundSlug = row.original.slug;
      const fundName = row.original.fund_name;

      if (isMobileView(table)) {
        // Mobile view - show as card
        return (
          <div className="p-3 border rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-left flex-1">
                <Link href={`/funds/${fundSlug}`} className="text-blue-600 font-bold">
                  {fundName}
                </Link>
              </div>
              <FavouriteHeart 
                entityType="funds" 
                entityId={row.original.fund_id} 
                size="sm"
              />
            </div>
            <div className="text-sm text-gray-600">{row.original.cat_long_name}</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>Fund Rating: <RatingDisplay rating={row.original.fund_rating} /></div>
              {row.original.one_yr && <div>1 Year: <ComGrowthNumberRating rating={row.original.one_yr} /></div>}
              {row.original.three_yr && <div>3 Year: <ComGrowthNumberRating rating={row.original.three_yr} /></div>}
              {row.original.five_yr && <div>5 Year: <ComGrowthNumberRating rating={row.original.five_yr} /></div>}
            </div>
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
    size: 100,
    cell: ({ getValue }) => <RatingDisplay rating={getValue() as number} />
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
    meta: { isFilterOnly: true }
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
  },
  {
    accessorKey: "structure_name",
    header: "Structure",
    size: 100,
  },
  {
    accessorKey: "category_name",
    header: "Category",
    meta: { isFilterOnly: true },
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
  },
  {
    accessorKey: "us_investors",
    header: "US Investors",
    meta: { isFilterOnly: true },
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