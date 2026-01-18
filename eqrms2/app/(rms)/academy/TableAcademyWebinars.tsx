"use client";

import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, getSortedRowModel } from "@tanstack/react-table";
import { ReactTableWrapper } from "@/components/data-table/ReactTableWrapper";
import { getWebinarColumns } from "./columns-academy-webinars";
import { AcademyWebinarDetail } from "@/types/academy-webinar-detail";
import { useAutoSorting } from "@/lib/hooks/useAutoSorting";

export default function TableAcademyWebinars({ 
  data, 
  canEdit 
}: { 
  data: AcademyWebinarDetail[];
  canEdit: boolean;
}) {
  const columns = getWebinarColumns(canEdit);
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

  return <ReactTableWrapper table={table}/>;
}
