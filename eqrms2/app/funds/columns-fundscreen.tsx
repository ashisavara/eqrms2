import { ColumnDef } from "@tanstack/react-table";  
import { RmsFundsScreener } from "@/types/funds-detail";
import Link from "next/link";
import { ComGrowthNumberRating, RatingDisplay } from "@/components/conditional-formatting";

export const columns: ColumnDef<RmsFundsScreener>[] = [
  {
    accessorKey: "fund_name",
    header: () => <div className="text-left">Fund Name</div>,
    cell: ({ getValue }) => <div className="text-left"> {getValue() as string} </div>
  },    
  {
    accessorKey: "fund_rating",
    header: "Fund",
    cell: ({ getValue }) => <RatingDisplay rating={getValue() as number} />
  },
  {
    accessorKey: "fund_performance_rating",
    header: "Perf",
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
    cell: ({ getValue }) => <ComGrowthNumberRating rating={getValue() as number} />
  },
  {
    accessorKey: "three_yr",
    header: "3 Year",
    cell: ({ getValue }) => <ComGrowthNumberRating rating={getValue() as number} />
  },
  {
    accessorKey: "five_yr",
    header: "5 Year",
    cell: ({ getValue }) => <ComGrowthNumberRating rating={getValue() as number} />
  },
  {
    accessorKey: "since_inception",
    header: "Since Inception",
    cell: ({ getValue }) => <ComGrowthNumberRating rating={getValue() as number} />
  },
];