"use client";

import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, getSortedRowModel } from "@tanstack/react-table";
import { ReactTableWrapper } from "@/components/data-table/ReactTableWrapper";
import { createColumns } from "./columns-fundscreen";
import { RmsFundsScreener } from "@/types/funds-detail";
import { useAutoSorting } from "@/lib/hooks/useAutoSorting";
import { useResponsiveColumns } from "@/lib/hooks/useResponsiveColumns";
import { useMemo } from "react";
import { can } from "@/lib/permissions";

export default function TableFundScreen({ data, userRoles }: { data: RmsFundsScreener[]; userRoles: string[] | null }) {
  // ✅ Check permission once
  const hasDetailedAccess = can(userRoles, 'rms', 'view_detailed');
  
  // ✅ Create columns with permission check (runs once per render)
  const columns = useMemo(() => createColumns(userRoles), [userRoles]);
  
  // ✅ Use responsive columns helper
  const { responsiveColumns } = useResponsiveColumns(columns, 'fund_name');
  
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

    // ✅ Base filters (always shown)
    const baseFilters = [
      { column: "structure_name", title: "Structure", placeholder: "Structure" },
      { column: "asset_class_name", title: "Asset Class", placeholder: "Asset Class" },
      { column: "category_name", title: "Category", placeholder: "Category" },
      { column: "amc_name", title: "AMC", placeholder: "AMC" },
      { column: "estate_duty_exposure", title: "Estate Duty", placeholder: "Estate Duty" },
      { column: "us_investors", title: "US Investors", placeholder: "US Investors" }
    ];

    // ✅ Conditionally include rating filter based on permissions
    const filters = hasDetailedAccess
      ? [{ column: "fund_rating", title: "Rating", placeholder: "Rating" }, ...baseFilters]
      : baseFilters;
    
      return <ReactTableWrapper table={table} className="text-xs text-center" filters={filters} />;
    }