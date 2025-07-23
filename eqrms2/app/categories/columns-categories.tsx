import { ColumnDef } from "@tanstack/react-table";  
import { Category } from "@/types/category-detail";
import Link from "next/link";

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "cat_name",
    header: () => <div className="text-left">Category</div>,
    cell: ({ row }) => {
      const categorySlug = row.original.slug;
      const categoryName = row.original.cat_name;

      return (
        <div className="text-left">
          <Link href={`/funds/${categorySlug}`} className="text-blue-600 font-bold hover:underline">
            {categoryName}
          </Link>
        </div>
      );
    }
  },    
  {
    accessorKey: "asset_class_name",
    header: "Asset Class",
  },
  {
    accessorKey: "one_yr",
    header: "1yr",
    cell: ({ getValue }) => (Math.round((getValue() as number) * 10) / 10).toFixed(1)
  },
  {
    accessorKey: "three_yr",
    header: "3yr",
    cell: ({ getValue }) => (Math.round((getValue() as number) * 10) / 10).toFixed(1)
  },
  {
    accessorKey: "five_yr",
    header: "5yr",
    cell: ({ getValue }) => (Math.round((getValue() as number) * 10) / 10).toFixed(1)
  },
  {
    accessorKey: "cat_summary",
    header: "Summary",
  },
];