// This component displays a table of fund data using the columns and data provided as props.
// It uses TanStack Table's useReactTable hook to create a table instance, which manages the table's state and logic.
// The table instance is then passed to a generic DataTable component for rendering.
// This component is required to separate the table logic for funds from the rest of the app, making it reusable and easier to maintain.

"use client";

import * as React from "react";
import { useReactTable, getCoreRowModel, getPaginationRowModel, ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shadcnTable/data-table";
import { Fund } from "./columns";

type Props = {
  data: Fund[];
  columns: ColumnDef<Fund, any>[];
};

export function FundsDataTable({ data, columns }: Props) {
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Create a table instance with the provided data and columns.
  const table = useReactTable({
    data,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false, // client-side pagination
    pageCount: Math.ceil(data.length / pagination.pageSize),
  });

  // Render the DataTable component with the table instance.
  return <DataTable table={table} />;
}
