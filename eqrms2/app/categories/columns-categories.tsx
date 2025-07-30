import { ColumnDef } from "@tanstack/react-table";  
import { Category } from "@/types/category-detail";
import Link from "next/link";
import { FavouriteHeart } from "@/components/ui/favourite-heart";

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
    accessorKey: "asset_class_name",
    header: "Asset Class",
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "one_yr",
    header: "1yr",
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return value !== null && value !== undefined ? (Math.round(value * 10) / 10).toFixed(1) : '';
    }
  },
  {
    accessorKey: "three_yr",
    header: "3yr",
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return value !== null && value !== undefined ? (Math.round(value * 10) / 10).toFixed(1) : '';
    }
  },
  {
    accessorKey: "five_yr",
    header: "5yr",
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return value !== null && value !== undefined ? (Math.round(value * 10) / 10).toFixed(1) : '';
    }
  },
  {
    accessorKey: "cat_summary",
    header: "Summary",
  },
];