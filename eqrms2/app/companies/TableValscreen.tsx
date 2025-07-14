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
    initialState: {
      pagination: {
        pageSize: 30, // Set default page size
      },
    },
  });

  return <ReactTableWrapper table={table} />;
}
