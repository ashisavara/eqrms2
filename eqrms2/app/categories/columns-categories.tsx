import { ColumnDef } from "@tanstack/react-table";  
import { Category } from "@/types/category-detail";
import Link from "next/link";
import { FavouriteHeart } from "@/components/ui/favourite-heart";
import { ComGrowthNumberRating } from "@/components/conditional-formatting";
import { isMobileView } from "@/lib/hooks/useResponsiveColumns";
import SimpleTable from "@/components/tables/singleRowTable";

export const columns: ColumnDef<Category>[] = [
  {
    id: "is_favourite",
    header: "♥",
    size: 40,
    accessorFn: (row) => {
      // This enables sorting - favourites will sort to top (1) vs bottom (0)
      // Note: This requires the favourites context to be available
      // We'll implement this in the table wrapper component
      return 0; // Placeholder - actual sorting handled by useAutoSorting
    },
    cell: ({ row }) => (
      <FavouriteHeart entityType="categories" entityId={row.original.category_id} size="sm" />
    ),
    enableSorting: true,
    meta: { isFilterOnly: false }
  },
  {
    accessorKey: "cat_name",
    header: () => <div className="text-left">Category</div>,
    cell: ({ row, table }) => {
      if (isMobileView(table)) {
        return (
          <div className="mobile-card">
            <div className="flex flex-row justify-between">
              <Link href={`/categories/${row.original.slug}`} className="text-blue-600 font-bold hover:underline text-sm">{row.original.cat_name}</Link>
              <FavouriteHeart entityType="categories" entityId={row.original.category_id} size="sm" />
            </div>
            <div className="text-left text-xs text-gray-600">{row.original.cat_summary}</div>
            <SimpleTable 
              headers={[{ label: "1yr" }, { label: "3yr" }, { label: "5yr" }]}
              body={[{ value: <ComGrowthNumberRating rating={Number(row.original.one_yr.toFixed(1))} /> }, { value: <ComGrowthNumberRating rating={Number(row.original.three_yr.toFixed(1))} /> }, { value: <ComGrowthNumberRating rating={Number(row.original.five_yr.toFixed(1))} /> }]}
            />
          </div>
        );
      } else {
        return (
          <div className="text-left">
            <Link href={`/categories/${row.original.slug}`} className="text-blue-600 font-bold hover:underline">
              {row.original.cat_name}
            </Link>
          </div>
        );
      }
    }
  },    
  {
    accessorKey: "one_yr",
    header: "1yr",
    cell: ({ getValue }) => {
      const value = getValue();
      if (value == null) return null;
      const num = Number(value);
      return <ComGrowthNumberRating rating={Number(num.toFixed(1))} />;
    },
    size: 100,
  },
  {
    accessorKey: "three_yr",
    header: "3yr",
    cell: ({ getValue }) => {
      const value = getValue();
      if (value == null) return null;
      const num = Number(value);
      return <ComGrowthNumberRating rating={Number(num.toFixed(1))} />;
    },
    size: 100,
  },
  {
    accessorKey: "five_yr",
    header: "5yr",
    cell: ({ getValue }) => {
      const value = getValue();
      if (value == null) return null;
      const num = Number(value);
      return <ComGrowthNumberRating rating={Number(num.toFixed(1))} />;
    },
    size: 100,
  },
  {
    accessorKey: "cat_summary",
    header: "Summary",  
    size: 800,
  },
];