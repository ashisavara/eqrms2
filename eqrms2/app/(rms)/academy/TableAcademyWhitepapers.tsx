"use client";

import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, getSortedRowModel } from "@tanstack/react-table";
import { ReactTableWrapper } from "@/components/data-table/ReactTableWrapper";
import { getWhitepaperColumns } from "./columns-academy-whitepapers";
import { AcademyWhitepaperDetail } from "@/types/academy-whitepaper-detail";
import { useAutoSorting } from "@/lib/hooks/useAutoSorting";

export default function TableAcademyWhitepapers({ 
  data, 
  canEdit 
}: { 
  data: AcademyWhitepaperDetail[];
  canEdit: boolean;
}) {
  const columns = getWhitepaperColumns(canEdit);
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
      arrIncludesSome: (row, columnId, value) => {
        const cellValue = row.getValue(columnId);
        return value.includes(cellValue);
      },
    },
    initialState: {
      pagination: {
        pageSize: 30,
      },
    },
  });

  return <ReactTableWrapper table={table} />;
}
