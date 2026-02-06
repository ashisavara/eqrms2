"use client";

import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, getSortedRowModel } from "@tanstack/react-table";
import { ReactTableWrapper } from "@/components/data-table/ReactTableWrapper";
import { MultiSelectFilter } from "@/components/data-table/MultiSelectFilter";
import { createColumns } from "./columns-calls";
import { CallsDetail } from "@/types/calls-detail";
import { useMemo } from "react";

const searchCandidateFilter = (row: any, _columnId: string, filterValue: string) => {
  if (!filterValue?.trim()) return true;
  const term = String(filterValue).toLowerCase();
  const name = String(row.original.candidate_name ?? "").toLowerCase();
  const number = String(row.original.candidate_number ?? "").toLowerCase();
  return name.includes(term) || number.includes(term);
};

export default function TableCalls({ data }: { data: CallsDetail[] }) {
  const columns = createColumns();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: searchCandidateFilter,
    filterFns: {
      arrIncludesSome: (row, columnId, value) => {
        const cellValue = row.getValue(columnId);
        return value.includes(String(cellValue));
      },
    },
    initialState: {
      pagination: { pageSize: 30, pageIndex: 0 },
      sorting: [{ id: "call_start_time", desc: true }],
    },
  });

  const statusOptions = useMemo(() => {
    const set = new Set<string>();
    table.getCoreRowModel().rows.forEach((row) => {
      const v = row.getValue("status");
      if (v != null && v !== "") set.add(String(v));
    });
    return Array.from(set).sort();
  }, [table.getCoreRowModel().rows]);

  const handleStatusChange = (values: string[]) => {
    table.getColumn("status")?.setFilterValue(values.length > 0 ? values : undefined);
  };

  const statusFilterValues = (): string[] => {
    const v = table.getColumn("status")?.getFilterValue();
    return Array.isArray(v) ? v : [];
  };

  return (
    <div className="space-y-4">
      <div className="pageHeadingBox">
        <h1 className="text-gray-50">Call Logs</h1>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="min-w-[180px]">
          <MultiSelectFilter
            title="Status"
            options={statusOptions}
            selectedValues={statusFilterValues()}
            onSelectionChange={handleStatusChange}
            placeholder="Filter by status..."
          />
        </div>
      </div>

      <ReactTableWrapper
        table={table}
        className="text-xs text-center"
        filters={[]}
        showSearch={true}
        searchPlaceholder="Search by name or phone..."
      />
    </div>
  );
}
