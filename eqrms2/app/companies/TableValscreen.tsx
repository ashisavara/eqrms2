// This component displays a table of fund data using the columns and data provided as props.
// It uses TanStack Table's useReactTable hook to create a table instance, which manages the table's state and logic.
// The table instance is then passed to a generic DataTable component for rendering.
// This component is required to separate the table logic for funds from the rest of the app, making it reusable and easier to maintain.

"use client";

import * as React from "react";
import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shadcnTable/data-table";
import { Company } from "./columns-valscreen";

type Props = {
  data: Company[];
  columns: ColumnDef<Company, any>[];
};

export function ValScreenDataTable({ data, columns }: Props) {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState<any[]>([]);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      columnFilters,
      pagination, // use the state variable here
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination, // add this line
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div>
      <DataTable table={table} />
    </div>
  );
}
