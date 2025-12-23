"use client";

import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, getSortedRowModel } from "@tanstack/react-table";
import { ReactTableWrapper } from "@/components/data-table/ReactTableWrapper";
import { columns } from "./columns-blog";
import { blogDetail } from "@/types/blog-detail";
import { useAutoSorting } from "@/lib/hooks/useAutoSorting";
import { useResponsiveColumns } from "@/lib/hooks/useResponsiveColumns";

export default function TableBlog({ data }: { data: blogDetail[] }) {
  // Use responsive columns helper
  const { responsiveColumns } = useResponsiveColumns(columns, 'title');
  
  const autoSortedColumns = useAutoSorting(data, responsiveColumns);

  const table = useReactTable({
    data,
    columns: autoSortedColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSortingRemoval: false,
    globalFilterFn: "includesString",
    filterFns: {
      // Custom filter function for multi-select
      arrIncludesSome: (row, columnId, value) => {
        const cellValue = row.getValue(columnId);
        return value.includes(String(cellValue));
      },
    },
    initialState: {
      pagination: {
        pageSize: 30, // Set default page size
      },
    },
  });

  const filters = [
    { column: "status", title: "Status", placeholder: "Status" },
    { column: "category", title: "Category", placeholder: "Category" }
  ];
  
  return <ReactTableWrapper table={table} className="text-xs text-center" filters={filters} />;
}

