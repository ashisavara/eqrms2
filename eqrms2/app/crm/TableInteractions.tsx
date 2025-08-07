"use client";

import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, getSortedRowModel } from "@tanstack/react-table";
import { ReactTableWrapper } from "@/components/data-table/ReactTableWrapper";
import { createColumns } from "./columns-interation";
import { InteractionDetail } from "@/types/interaction-detail";
import { useAutoSorting } from "@/lib/hooks/useAutoSorting";
import { LeadsTagging } from "@/types/lead-detail";

export default function TableInteractions({ 
  data, 
  interactionTypeOptions = [], 
  interactionTagOptions = [], 
  interactionChannelOptions = [],
  leadsData = [],
  importanceOptions = [],
  leadProgressionOptions = [],
  wealthLevelOptions = []
}: { 
  data: InteractionDetail[];
  interactionTypeOptions?: { value: string; label: string }[];
  interactionTagOptions?: { value: string; label: string }[];
  interactionChannelOptions?: { value: string; label: string }[];
  leadsData?: LeadsTagging[];
  importanceOptions?: { value: string; label: string }[];
  leadProgressionOptions?: { value: string; label: string }[];
  wealthLevelOptions?: { value: string; label: string }[];
}) {

  const columns = createColumns(interactionTypeOptions, interactionTagOptions, interactionChannelOptions, leadsData, importanceOptions, leadProgressionOptions, wealthLevelOptions);
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
        sorting: [
          { id: "created_at", desc: true },
        ],
      },
    });

    const filters = [
      { column: "interaction_type", title: "Interaction Type", placeholder: "Interaction Type" },
    ];
    
      return <ReactTableWrapper table={table} className="text-xs text-center" filters={filters} />;
    }