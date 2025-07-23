"use client";

import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, getSortedRowModel } from "@tanstack/react-table";
import { ReactTableWrapper } from "@/components/data-table/ReactTableWrapper";
import { columns } from "./columns-categories";
import { Category } from "@/types/category-detail";
import { useAutoSorting } from "@/lib/hooks/useAutoSorting";

interface TableCategoryProps {
  data: Category[];
}

export function TableCategories({ data }: TableCategoryProps) {
  // Auto-configure sorting for all columns
  const autoSortedColumns = useAutoSorting(data, columns);
  
  const table = useReactTable({
    data,
    columns: autoSortedColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // Enable pagination
    getFilteredRowModel: getFilteredRowModel(), // Enable filtering
    getSortedRowModel: getSortedRowModel(), // Enable sorting
    enableSortingRemoval: false, // Disable sort clearing - only toggle between asc/desc
    globalFilterFn: 'includesString', // Global filter function
    filterFns: {
      // Custom filter function for multi-select
      arrIncludesSome: (row, columnId, value) => {
        const cellValue = row.getValue(columnId);
        return value.includes(cellValue);
      },
    },
    initialState: {
      pagination: {
        pageSize: 50, // Set default page size
      },
    },
  });

  const filters = [
    { column: "asset_class_name", title: "Asset Class", placeholder: "Asset Class" }
  ];

  return <ReactTableWrapper table={table} className="text-xs text-center" filters={filters} />;
}
