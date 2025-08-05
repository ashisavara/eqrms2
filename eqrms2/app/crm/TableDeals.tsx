"use client";

import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, getSortedRowModel } from "@tanstack/react-table";
import { ReactTableWrapper } from "@/components/data-table/ReactTableWrapper";
import { createColumns } from "./columns-crm-deals";
import { Deals } from "@/types/deals";
import { useAutoSorting } from "@/lib/hooks/useAutoSorting";

export default function TableDeals({ 
  data, 
  //dealLikelihoodOptions = [], 
  dealEstClousureOptions = [], 
  dealStageOptions = [], 
  dealSegmentOptions = [] 
}: { 
  data: Deals[];
  dealEstClousureOptions?: { value: string; label: string }[];
  dealStageOptions?: { value: string; label: string }[];
  dealSegmentOptions?: { value: string; label: string }[];
}) {

  const columns = createColumns(dealEstClousureOptions, dealStageOptions,dealSegmentOptions);
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
          { id: "deal_likelihood", desc: true },
          { id: "total_deal_aum", desc: true },
        ],
      },
    });

    const filters = [
      { column: "deal_likelihood", title: "Likelihood", placeholder: "Likelihood" },
      { column: "deal_stage", title: "Stage", placeholder: "Stage" },
      { column: "deal_segment", title: "Segment", placeholder: "Segment" },
      { column: "est_closure", title: "Est. Closure", placeholder: "Est. Closure" },
    ];
    
      return <ReactTableWrapper table={table} className="text-xs text-center" filters={filters} />;
    }