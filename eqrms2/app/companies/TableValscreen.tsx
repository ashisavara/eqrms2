// eqrms2/app/companies/TableValscreen.tsx
"use client";

import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
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
  });

  return <ReactTableWrapper table={table} />;
}
