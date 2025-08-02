import { ColumnDef } from "@tanstack/react-table";  
import { RmsFundsScreener } from "@/types/funds-detail";
import Link from "next/link";
import { ComGrowthNumberRating, RatingDisplay } from "@/components/conditional-formatting";
import { FavouriteHeart } from "@/components/ui/favourite-heart";

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
    cell: ({ row }) => {
      const fundSlug = row.original.slug;
      const fundName = row.original.fund_name;

      return (
        <div className="text-left">
          <Link href={`/funds/${fundSlug}`} className="text-blue-600 font-bold hover:underline">
            {fundName}
          </Link>
        </div>
      );
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