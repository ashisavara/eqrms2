// This component displays a table of fund data using the columns and data provided as props.
// It uses TanStack Table's useReactTable hook to create a table instance, which manages the table's state and logic.
// The table instance is then passed to a generic DataTable component for rendering.
// This component is required to separate the table logic for funds from the rest of the app, making it reusable and easier to maintain.

"use client";

import * as React from "react";
import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shadcnTable/data-table";
import { Fund } from "./columns";

type Props = {
  data: Fund[];
  columns: ColumnDef<Fund, any>[];
};

export function FundsDataTable({ data, columns }: Props) {
  // State for the global filter (used for searching across all rows, e.g., fund name)
  const [globalFilter, setGlobalFilter] = React.useState("");

  // State for column-specific filters.
  // TanStack Table expects columnFilters to be an array of filter objects,
  // where each object has at least an 'id' (column key) and a 'value' (filter value).
  // Example: [{ id: "fund_rating", value: [3, 4, 5] }]
  // It should NOT be an object/dictionary mapping column keys to values.
  const [columnFilters, setColumnFilters] = React.useState<any[]>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      columnFilters,
      pagination: React.useState({ pageIndex: 0, pageSize: 10 })[0],
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div>
      {/* Search input for fund name */}
      <input
        type="text"
        placeholder="Search fund name..."
        value={globalFilter ?? ""}
        onChange={e => setGlobalFilter(e.target.value)}
        className="mb-4 p-2 border rounded"
      />

      {/* Multi-select for rating */}
      <select
        multiple
        value={
          columnFilters.find(f => f.id === "fund_rating")?.value ?? []
        }
        onChange={e => {
          const values = Array.from(e.target.selectedOptions, option => option.value);
          setColumnFilters((prev) => [
            ...prev.filter(f => f.id !== "fund_rating"),
            ...(values.length ? [{ id: "fund_rating", value: values }] : []),
          ]);
        }}
        className="mb-4 p-2 border rounded"
      >
        {[...new Set(data.map(f => f.fund_rating))].map(rating => (
          <option key={rating} value={rating}>{rating}</option>
        ))}
      </select>

      {/* Multi-select for open_for_subscription */}
      <select
        multiple
        value={
          columnFilters.find(f => f.id === "open_for_subscription")?.value ?? []
        }
        onChange={e => {
          const values = Array.from(e.target.selectedOptions, option => option.value);
          setColumnFilters((prev) => [
            ...prev.filter(f => f.id !== "open_for_subscription"),
            ...(values.length ? [{ id: "open_for_subscription", value: values }] : []),
          ]);
        }}
        className="mb-4 p-2 border rounded"
      >
        {[...new Set(data.map(f => f.open_for_subscription))].map(val => (
          <option key={val} value={val}>{val}</option>
        ))}
      </select>

      <DataTable table={table} />
    </div>
  );
}
