import { ColumnDef } from "@tanstack/react-table";  
import { RmsFundsScreener } from "@/types/funds-detail";
import Link from "next/link";
import { ComGrowthNumberRating } from "@/components/conditional-formatting";
import { isMobileView } from "@/lib/hooks/useResponsiveColumns";
import SimpleTable from "@/components/tables/singleRowTable";

// Simplified columns for public blog posts - no ratings, no authentication required
export const createPublicColumns = (): ColumnDef<RmsFundsScreener>[] => {
  return [
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
            </div>
            <SimpleTable 
              headers={[{ label: "1yr" }, { label: "3yr" }, { label: "5yr" }]}
              body={[
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
    accessorKey: "structure_name",
    header: "Structure",
    size: 120,
  },
  {
    accessorKey: "cat_long_name",
    header: "Category",
    size: 180,
  },
  {
    accessorKey: "one_yr",
    header: "1 Year",
    size: 120,
    cell: ({ getValue }) => <ComGrowthNumberRating rating={getValue() as number} />
  },
  {
    accessorKey: "three_yr",
    header: "3 Year",
    size: 120,
    cell: ({ getValue }) => <ComGrowthNumberRating rating={getValue() as number} />
  },
  {
    accessorKey: "five_yr",
    header: "5 Year",
    size: 120,
    cell: ({ getValue }) => <ComGrowthNumberRating rating={getValue() as number} />
  },
  ];
};
