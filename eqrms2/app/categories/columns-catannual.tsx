import { ColumnDef } from "@tanstack/react-table";  
import { Category } from "@/types/category-detail";
import Link from "next/link";

export const annualColumns: ColumnDef<Category>[] = [
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
    accessorKey: "cy_1",
    header: "2024",
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return value !== null && value !== undefined ? (Math.round(value * 10) / 10).toFixed(1) : '';
    }
  },
  {
    accessorKey: "cy_2",
    header: "2023",
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return value !== null && value !== undefined ? (Math.round(value * 10) / 10).toFixed(1) : '';
    }
  },
  {
    accessorKey: "cy_3",
    header: "2022",
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return value !== null && value !== undefined ? (Math.round(value * 10) / 10).toFixed(1) : '';
    }
  },
  {
    accessorKey: "cy_4",
    header: "2021",
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return value !== null && value !== undefined ? (Math.round(value * 10) / 10).toFixed(1) : '';
    }
  },
  {
    accessorKey: "cy_5",
    header: "2020",
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return value !== null && value !== undefined ? (Math.round(value * 10) / 10).toFixed(1) : '';
    }
  },
  {
    accessorKey: "cy_6",
    header: "2019",
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return value !== null && value !== undefined ? (Math.round(value * 10) / 10).toFixed(1) : '';
    }
  },
  {
    accessorKey: "cy_7",
    header: "2018",
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return value !== null && value !== undefined ? (Math.round(value * 10) / 10).toFixed(1) : '';
    }
  },
  {
    accessorKey: "cy_8",
    header: "2017",
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return value !== null && value !== undefined ? (Math.round(value * 10) / 10).toFixed(1) : '';
    }
  },
  {
    accessorKey: "cy_9",
    header: "2016",
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return value !== null && value !== undefined ? (Math.round(value * 10) / 10).toFixed(1) : '';
    }
  },
  {
    accessorKey: "cy_10",
    header: "2015",
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return value !== null && value !== undefined ? (Math.round(value * 10) / 10).toFixed(1) : '';
    }
  },
];