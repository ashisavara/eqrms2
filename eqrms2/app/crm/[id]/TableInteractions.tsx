"use client";

import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, getSortedRowModel } from "@tanstack/react-table";
import { ReactTableWrapper } from "@/components/data-table/ReactTableWrapper";
import { columns } from "./columns-interation";
import { InteractionDetail } from "@/types/interaction-detail";
import { useAutoSorting } from "@/lib/hooks/useAutoSorting";

export default function TableInteractions({ data }: { data: InteractionDetail[] }) {

  const autoSortedColumns = useAutoSorting(data, columns);

  const table = useReactTable({
    data,
    columns: autoSortedColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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
          pageSize: 10, // Set default page size
        },
        sorting: [
          { id: "meeting_date", desc: true },
        ],
      },
    });
    
      return <ReactTableWrapper table={table} className="text-sm text-center" />;
    }