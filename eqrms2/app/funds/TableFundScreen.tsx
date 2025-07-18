"use client";

import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, getSortedRowModel } from "@tanstack/react-table";
import { ReactTableWrapper } from "@/components/data-table/ReactTableWrapper";
import { columns } from "./columns-fundscreen";
import { RmsFundsScreener } from "@/types/funds-detail";
import { useAutoSorting } from "@/lib/hooks/useAutoSorting";

export default function TableFundScreen({ data }: { data: RmsFundsScreener[] }) {

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
        { column: "fund_rating", title: "Rating", placeholder: "Rating" },
        { column: "structure_name", title: "Structure", placeholder: "Structure" },
        { column: "amc_name", title: "AMC", placeholder: "AMC" },
        { column: "category_name", title: "Category", placeholder: "Category" },
        { column: "estate_duty_exposure", title: "Estate Duty Exposure", placeholder: "Estate Duty Exposure" },
        { column: "us_investors", title: "US Investors", placeholder: "US Investors" }
      ];
    
      return <ReactTableWrapper table={table} className="text-xs text-center" filters={filters} />;
    }