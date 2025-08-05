import { ColumnDef } from "@tanstack/react-table";  
import { Category } from "@/types/category-detail";
import Link from "next/link";
import { FavouriteHeart } from "@/components/ui/favourite-heart";
import { ComGrowthNumberRating } from "@/components/conditional-formatting";

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
      <FavouriteHeart 
        entityType="categories" 
        entityId={row.original.category_id} 
        size="sm"
      />
    ),
    enableSorting: true,
    meta: { isFilterOnly: false }
  },
  {
    accessorKey: "cat_name",
    header: () => <div className="text-left">Category</div>,
    cell: ({ row }) => {
      const categorySlug = row.original.slug;
      const categoryName = row.original.cat_name;

      return (
        <div className="text-left">
          <Link href={`/categories/${categorySlug}`} className="text-blue-600 font-bold hover:underline">
            {categoryName}
          </Link>
        </div>
      );
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