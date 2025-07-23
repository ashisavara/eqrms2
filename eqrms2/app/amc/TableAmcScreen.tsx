"use client";

import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, getSortedRowModel } from "@tanstack/react-table";
import { ReactTableWrapper } from "@/components/data-table/ReactTableWrapper";
import { columns } from "./columns-amcscreen";
import { AMC } from "@/types/amc-detail";
import { useAutoSorting } from "@/lib/hooks/useAutoSorting";

interface TableAmcScreenProps {
  data: AMC[];
}

export function TableAmcScreen({ data }: TableAmcScreenProps) {
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
        pageSize: 30, // Set default page size
      },
    },
  });

  const filters = [
    { column: "structure", title: "Structure", placeholder: "Structure" },
    { column: "amc_rating", title: "Rating", placeholder: "Rating" },
    { column: "us_investor_tagging", title: "US Investor", placeholder: "US Investor" }
  ];

  return <ReactTableWrapper table={table} className="text-xs text-center" filters={filters} />;
}
