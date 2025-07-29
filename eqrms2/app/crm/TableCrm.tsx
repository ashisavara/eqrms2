"use client";

import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, getSortedRowModel } from "@tanstack/react-table";
import { ReactTableWrapper } from "@/components/data-table/ReactTableWrapper";
import { LeadsTagging } from "@/types/lead-detail";
import { useAutoSorting } from "@/lib/hooks/useAutoSorting";

// Import all column types
import { columns as coreColumns } from "./columns-crm-core";
// import { detailColumns } from "./columns-crm-detail";
// import { contactColumns } from "./columns-crm-contact";
// import { analysisColumns } from "./columns-crm-analysis";

// Create a mapping object
const columnTypes = {
  core: coreColumns,
  // detail: detailColumns,
  // contact: contactColumns,
  // analysis: analysisColumns,
} as const;

type ColumnType = keyof typeof columnTypes;

interface TableCrmProps {
  data: LeadsTagging[];
  columnType?: ColumnType;
}

export function TableCrm({ data, columnType = "core" }: TableCrmProps) {
  // Select the appropriate column set from the mapping
  const selectedColumns = columnTypes[columnType];
  
  const autoSortedColumns = useAutoSorting(data, selectedColumns);

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
          {
            id: "days_followup", // Column accessor key
            desc: false, // true = descending, false = ascending
          }
        ],
      },
    });

    const filters = [
        { column: "importance", title: "Importance", placeholder: "Importance" },
        { column: "lead_progression", title: "Lead Stage", placeholder: "Lead Stage" },
        { column: "lead_source", title: "Lead Source", placeholder: "Lead Source" },
        { column: "lead_type", title: "Lead Type", placeholder: "Lead Type" },
        { column: "wealth_level", title: "Wealth Level", placeholder: "Wealth Level" },
        { column: "primary_rm", title: "Primary RM", placeholder: "Primary RM" }
      ];
    
      return <ReactTableWrapper table={table} className="text-xs text-center" filters={filters} />;
    }