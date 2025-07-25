"use client";

import { useReactTable, getCoreRowModel, getSortedRowModel } from "@tanstack/react-table";
import { ReactTableWrapper } from "@/components/data-table/ReactTableWrapper";
import { Category } from "@/types/category-detail";
import { useAutoSorting } from "@/lib/hooks/useAutoSorting";

// Import all column types
import { columns as summaryColumns } from "./columns-categories";
import { annualColumns } from "./columns-catannual";
// import { performanceColumns } from "./columns-catperformance";
// import { detailColumns } from "./columns-catdetail";

// Create a mapping object
const columnTypes = {
  summary: summaryColumns,
  annual: annualColumns,
  // performance: performanceColumns,
  // detail: detailColumns,
} as const;

type ColumnType = keyof typeof columnTypes;

interface TableCategoryProps {
  data: Category[];
  columnType?: ColumnType; // Now supports multiple types
}

export function TableCategories({ data, columnType = "summary" }: TableCategoryProps) {
  // Select the appropriate column set from the mapping
  const selectedColumns = columnTypes[columnType];
  
  const autoSortedColumns = useAutoSorting(data, selectedColumns);
  
  const table = useReactTable({
    data,
    columns: autoSortedColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSortingRemoval: false,
  });

  return <ReactTableWrapper table={table} className="text-xs text-center" showPagination={false} showSearch={false}/>;
}
