"use client";

import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, getSortedRowModel } from "@tanstack/react-table";
import { ReactTableWrapper } from "@/components/data-table/ReactTableWrapper";
import { createColumns } from "./columns-amcscreen";
import { AMC } from "@/types/amc-detail";
import { useAutoSorting } from "@/lib/hooks/useAutoSorting";
import { useResponsiveColumns } from "@/lib/hooks/useResponsiveColumns";
import { useMemo } from "react";
import { can } from "@/lib/permissions";

interface TableAmcScreenProps {
  data: AMC[];
  userRoles?: string[] | null;
}

export function TableAmcScreen({ data, userRoles = null }: TableAmcScreenProps) {
  // ✅ Check permission once
  const hasDetailedAccess = can(userRoles, 'rms', 'view_detailed');
  
  // ✅ Create columns with permission check (runs once per render)
  const columns = useMemo(() => createColumns(userRoles), [userRoles]);
  
  // ✅ Use responsive columns helper
  const { responsiveColumns } = useResponsiveColumns(columns, 'amc_name');
  
  // Auto-configure sorting for all columns
  const autoSortedColumns = useAutoSorting(data, responsiveColumns);
  
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
        return value.includes(String(cellValue));
      },
    },
    initialState: {
      pagination: {
        pageSize: 30, // Set default page size
      },
    },
  });

  // ✅ Base filters (always shown)
  const baseFilters = [
    { column: "us_investor_tagging", title: "US Investor", placeholder: "US Investor" }
  ];

  // ✅ Conditionally include rating filter based on permissions
  const filters = hasDetailedAccess
    ? [{ column: "amc_rating", title: "Rating", placeholder: "Rating" }, ...baseFilters]
    : baseFilters;

  return <ReactTableWrapper table={table} className="text-xs text-center" filters={filters} />;
}
