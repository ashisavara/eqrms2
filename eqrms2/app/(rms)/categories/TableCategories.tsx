"use client";

import { useReactTable, getCoreRowModel, getSortedRowModel } from "@tanstack/react-table";
import { ReactTableWrapper } from "@/components/data-table/ReactTableWrapper";
import { Category } from "@/types/category-detail";
import { useAutoSorting } from "@/lib/hooks/useAutoSorting";
import { useResponsiveColumns } from "@/lib/hooks/useResponsiveColumns";
import { useMemo } from "react";

// Import all column types
import { createColumns } from "./columns-categories";
import { annualColumns } from "./columns-catannual";
// import { performanceColumns } from "./columns-catperformance";
// import { detailColumns } from "./columns-catdetail";

type ColumnType = "summary" | "annual";

interface TableCategoryProps {
  data: Category[];
  columnType?: ColumnType; // Now supports multiple types
  userRoles?: string | null;
}

export function TableCategories({ data, columnType = "summary", userRoles = null }: TableCategoryProps) {
  // ✅ Create columns with permission check (runs once per render)
  const summaryColumns = useMemo(() => createColumns(userRoles), [userRoles]);
  
  // Create a mapping object
  const columnTypes = useMemo(() => ({
    summary: summaryColumns,
    annual: annualColumns,
    // performance: performanceColumns,
    // detail: detailColumns,
  }), [summaryColumns]);
  
  // Select the appropriate column set from the mapping
  const selectedColumns = columnTypes[columnType];
  const { responsiveColumns } = useResponsiveColumns(selectedColumns, 'cat_name');
  
  const autoSortedColumns = useAutoSorting(data, responsiveColumns);
  
  const table = useReactTable({
    data,
    columns: autoSortedColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSortingRemoval: false,
  });

  return <ReactTableWrapper table={table} className="text-xs text-center" showPagination={false} showSearch={false}/>;
}
