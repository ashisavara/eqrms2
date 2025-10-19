"use client";

import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, getSortedRowModel } from "@tanstack/react-table";
import { ReactTableWrapper } from "@/components/data-table/ReactTableWrapper";
import { columns } from "./columns-tickets";
import { Ticket } from "@/types/tickets-detail";
import { useAutoSorting } from "@/lib/hooks/useAutoSorting";

export default function TableTickets({ data }: { data: Ticket[] }) {

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
          pageSize: 30, // Set default page size
        },
      },
    });

    const filters = [
        { column: "creator_name", title: "Created By", placeholder: "Created By" },
        { column: "assignee_name", title: "Assignee", placeholder: "Assignee" },
        { column: "importance", title: "Importance", placeholder: "Importance" },
        { column: "segment_name", title: "Segment", placeholder: "Segment" },
      ];
    
      return <ReactTableWrapper table={table} className="text-xs text-center" filters={filters} />;
    }