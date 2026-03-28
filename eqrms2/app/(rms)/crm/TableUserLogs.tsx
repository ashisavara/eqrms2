"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ColumnDef, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { MultiSelectFilter } from "@/components/data-table/MultiSelectFilter";
import { ReactTableWrapper } from "@/components/data-table/ReactTableWrapper";
import { formatDatetime } from "@/lib/utils";
import { UserLogDetail } from "@/types/user-log";
import { UserLogRating } from "@/components/conditional-formatting";

const searchEntityTitleFilter = (row: any, _columnId: string, filterValue: string) => {
  if (!filterValue?.trim()) return true;
  const term = String(filterValue).toLowerCase();
  const title = String(row.original.entity_title ?? "").toLowerCase();
  return title.includes(term);
};

const columns: ColumnDef<UserLogDetail>[] = [
  {
    accessorKey: "event_timestamp",
    header: "Time",
    size: 150,
    cell: ({ getValue }) => (
      <p className="text-left">{formatDatetime(getValue() as string)}</p>
    ),
  },
  {
    accessorKey: "segment",
    header: "Segment",
    size: 120,
    filterFn: "arrIncludesSome",
    cell: ({ row }) => {
      const segment = row.original.segment;
      return <UserLogRating rating={segment as string}>{segment as string}</UserLogRating>;
    },
  },
  {
    accessorKey: "entity_title",
    header: "Entity",
    size: 260,
    cell: ({ row, getValue }) => {
      const entityTitle = getValue() as string | null;
      const pagePath = row.original.page_path;
      if (!entityTitle) return <p className="text-left text-muted-foreground">-</p>;
      if (!pagePath) return <p className="text-left">{entityTitle}</p>;
      return (
        <div className="text-left">
          <Link href={pagePath} className="blue-hyperlink hover:underline" target="_blank" rel="noopener noreferrer">
            {entityTitle}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "entity_slug",
    header: "Slug",
    size: 220,
    cell: ({ getValue }) => (
      <p className="text-left">{(getValue() as string | null) || "-"}</p>
    ),
  },
  {
    accessorKey: "entity_id",
    header: "Entity Id",
    size: 110,
    cell: ({ getValue }) => (
      <p className="text-left">{String(getValue() ?? "-")}</p>
    ),
  },
  {
    accessorKey: "group_name",
    header: "Group Name",
    size: 110,
    cell: ({ getValue }) => (
      <p className="text-left">{String(getValue() ?? "-")}</p>
    ),
  },
  {
    accessorKey: "user_name",
    header: "User Name",
    size: 110,
    cell: ({ getValue }) => (
      <p className="text-left">{String(getValue() ?? "-")}</p>
    ),
  },
];

export default function TableUserLogs({ data }: { data: UserLogDetail[] }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: searchEntityTitleFilter,
    enableSortingRemoval: false,
    filterFns: {
      arrIncludesSome: (row, columnId, value) => {
        const cellValue = row.getValue(columnId);
        return value.includes(String(cellValue));
      },
    },
    initialState: {
      pagination: {
        pageSize: 30,
      },
      sorting: [{ id: "event_timestamp", desc: true }],
    },
  });

  const segmentOptions = useMemo(() => {
    const set = new Set<string>();
    table.getCoreRowModel().rows.forEach((row) => {
      const v = row.getValue("segment");
      if (v != null && v !== "") set.add(String(v));
    });
    return Array.from(set).sort();
  }, [table.getCoreRowModel().rows]);

  const handleSegmentChange = (values: string[]) => {
    table.getColumn("segment")?.setFilterValue(values.length > 0 ? values : undefined);
  };

  const selectedSegments = () => {
    const v = table.getColumn("segment")?.getFilterValue();
    return Array.isArray(v) ? v : [];
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <div className="min-w-[180px]">
          <MultiSelectFilter
            title="Segment"
            options={segmentOptions}
            selectedValues={selectedSegments()}
            onSelectionChange={handleSegmentChange}
            placeholder="Filter by segment..."
          />
        </div>
      </div>

      <ReactTableWrapper
        table={table}
        className="text-xs text-center"
        filters={[]}
        showSearch={true}
        searchPlaceholder="Search entity title..."
      />
    </div>
  );
}
