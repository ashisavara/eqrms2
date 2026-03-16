"use client";

import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, getSortedRowModel } from "@tanstack/react-table";
import { ReactTableWrapper } from "@/components/data-table/ReactTableWrapper";
import { columns } from "./columns-kyc";
import { GroupInvestorDetail } from "@/types/group-investor-detail";
import { useAutoSorting } from "@/lib/hooks/useAutoSorting";

export default function TableKyc({ data }: { data: GroupInvestorDetail[] }) {
  const autoSortedColumns = useAutoSorting(data, columns);

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
        return value.includes(cellValue);
      },
    },
    initialState: {
      pagination: {
        pageSize: 30,
      },
      sorting: [
        { id: "investor_name", desc: false },
      ],
    },
  });

  const filters = [
    { column: "investor_type", title: "Type", placeholder: "Type" },
    { column: "mf_ready", title: "MF Ready", placeholder: "MF Ready" },
    { column: "pms_ready", title: "PMS Ready", placeholder: "PMS Ready" },
    { column: "kristal_ready", title: "Kristal Ready", placeholder: "Kristal Ready" },
  ];

  return <ReactTableWrapper table={table} className="text-xs text-center" filters={filters} />;
}

