// Basic version of TableFundScreen without filters, search or pagination for more basic tables

"use client";

import { useReactTable, getCoreRowModel, getSortedRowModel } from "@tanstack/react-table";
import { ReactTableWrapper } from "@/components/data-table/ReactTableWrapper";
import { columns } from "./columns-fundscreen";
import { RmsFundsScreener } from "@/types/funds-detail";
import { useAutoSorting } from "@/lib/hooks/useAutoSorting";
import { useResponsiveColumns } from "@/lib/hooks/useResponsiveColumns";

export default function TableFundScreen({ data }: { data: RmsFundsScreener[] }) {

  const { responsiveColumns } = useResponsiveColumns(columns, 'fund_name');
  const autoSortedColumns = useAutoSorting(data, responsiveColumns);


  const table = useReactTable({
    data,
    columns: autoSortedColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSortingRemoval: false,
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

      return <ReactTableWrapper table={table} className="text-xs text-center" showPagination={false} showSearch={false}/>;
    }