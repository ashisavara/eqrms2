// eqrms2/app/companies/TableValscreen.tsx
"use client";

import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, getSortedRowModel } from "@tanstack/react-table";
import { ReactTableWrapper } from "@/components/data-table/ReactTableWrapper";
import { columns } from "./columns-valscreen";
import { Company } from "@/types/company-detail";
import { useAutoSorting } from "@/lib/hooks/useAutoSorting";
import { useResponsiveColumns } from "@/lib/hooks/useResponsiveColumns";

interface TableValscreenProps {
  data: Company[];
}

export function TableValscreen({ data }: TableValscreenProps) {
  // ✅ Use responsive columns helper
  const { responsiveColumns } = useResponsiveColumns(columns, 'ime_name');
  
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
        pageSize: 50, // Set default page size
      },
      sorting: [
        {
          id: "upside", // Column accessor key
          desc: true, // true = descending, false = ascending
        }
      ],
    },
  });



  const filters = [
    { column: "stock_score", title: "Rating", placeholder: "Rating" },
    { column: "sector_name", title: "Sector", placeholder: "Sectors" },
    { column: "industry", title: "Industry", placeholder: "Industry" },
    { column: "quality", title: "Quality", placeholder: "Quality" },
    { column: "mt_growth", title: "Growth", placeholder: "Growth" },
    { column: "market_momentum", title: "Momentum", placeholder: "Momentum" },
    { column: "coverage", title: "Coverage", placeholder: "Coverage" },
    { column: "mkt_cap_cat", title: "Market Cap", placeholder: "Market Cap" },
  ];

  return <ReactTableWrapper table={table} className="text-xs text-center" filters={filters} />;
}
