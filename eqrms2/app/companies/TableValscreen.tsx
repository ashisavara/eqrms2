// eqrms2/app/companies/TableValscreen.tsx
"use client";

import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel } from "@tanstack/react-table";
import { ReactTableWrapper } from "@/components/data-table/ReactTableWrapper";
import { columns } from "./columns-valscreen";
import { Company } from "@/types/company-detail";

interface TableValscreenProps {
  data: Company[];
}

export function TableValscreen({ data }: TableValscreenProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // Enable pagination
    getFilteredRowModel: getFilteredRowModel(), // Enable filtering
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
    { column: "sector_name", title: "Sector", placeholder: "Sectors" },
    { column: "industry", title: "Industry", placeholder: "Industry" },
    { column: "quality", title: "Quality", placeholder: "Quality" },
    { column: "mt_growth", title: "Growth", placeholder: "Growth" },
    { column: "market_momentum", title: "Momentum", placeholder: "Momentum" },
  ];

  return <ReactTableWrapper table={table} className="text-xs text-center" filters={filters} />;
}
