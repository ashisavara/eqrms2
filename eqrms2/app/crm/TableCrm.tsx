"use client";

import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, getSortedRowModel } from "@tanstack/react-table";
import { ReactTableWrapper } from "@/components/data-table/ReactTableWrapper";
import { createColumns } from "./columns-crm-core";
import { LeadsTagging } from "@/types/lead-detail";
import { useAutoSorting } from "@/lib/hooks/useAutoSorting";
import { LeadsTaggingValues } from "@/types/forms";

export default function TableCrm({ 
  data, 
  importanceOptions = [], 
  leadProgressionOptions = [], 
  wealthLevelOptions = [],
  dealEstClosureOptions = [],
  dealStageOptions = [],
  dealSegmentOptions = [],
  interactionTypeOptions = [],
  interactionTagOptions = [],
  interactionChannelOptions = [],
  customTagOptions = [],
  leadRoleOptions = [],
  digitalAdOptions = [],
  leadSourceOptions = [],
  leadTypeOptions = [],
  primaryRmOptions = [],
  referralPartnerOptions = [],
}: { 
  data: LeadsTagging[];
  importanceOptions?: { value: string; label: string }[];
  leadProgressionOptions?: { value: string; label: string }[];
  wealthLevelOptions?: { value: string; label: string }[];  
  dealEstClosureOptions?: { value: string; label: string }[];
  dealStageOptions?: { value: string; label: string }[];
  dealSegmentOptions?: { value: string; label: string }[];
  interactionTypeOptions?: { value: string; label: string }[];
  interactionTagOptions?: { value: string; label: string }[];
  interactionChannelOptions?: { value: string; label: string }[];
  customTagOptions?: { value: string; label: string }[];
  leadRoleOptions?: { value: string; label: string }[];
  digitalAdOptions?: { value: string; label: string }[];
  leadSourceOptions?: { value: string; label: string }[];
  leadTypeOptions?: { value: string; label: string }[];
  primaryRmOptions?: { value: string; label: string }[];
  referralPartnerOptions?: { value: string; label: string }[];
}) {

  const columns = createColumns(importanceOptions, leadProgressionOptions, wealthLevelOptions, dealEstClosureOptions, dealStageOptions, dealSegmentOptions, interactionTypeOptions, interactionTagOptions, interactionChannelOptions, customTagOptions, leadRoleOptions, digitalAdOptions, leadSourceOptions, leadTypeOptions, primaryRmOptions, referralPartnerOptions);
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
          { id: "days_followup", desc: false },
        ],
      },
    });

    const filters = [
        { column: "importance", title: "Importance", placeholder: "Importance" },
        { column: "lead_progression", title: "Lead Stage", placeholder: "Lead Stage" },
        { column: "lead_source", title: "Lead Source", placeholder: "Lead Source" },
        { column: "lead_type", title: "Lead Type", placeholder: "Lead Type" },
        { column: "wealth_level", title: "Wealth Level", placeholder: "Wealth Level" },
        { column: "rm_name", title: "RM", placeholder: "RM" }
    ];
    
      return <ReactTableWrapper table={table} className="text-xs text-center" filters={filters} />;
    }