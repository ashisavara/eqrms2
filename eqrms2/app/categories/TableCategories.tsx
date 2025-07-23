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
    getSortedRowModel: getSortedRowModel(), // Enable sorting
    enableSortingRemoval: false, // Disable sort clearing - only toggle between asc/desc
  });

  return <ReactTableWrapper table={table} className="text-xs text-center"/>;
}
