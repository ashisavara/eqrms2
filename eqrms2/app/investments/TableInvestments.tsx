"use client";

import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, getSortedRowModel } from "@tanstack/react-table";
import { ReactTableWrapper } from "@/components/data-table/ReactTableWrapper";
import { columns } from "./columns-investments";
import { Investments } from "@/types/investment-detail";
import { useAutoSorting } from "@/lib/hooks/useAutoSorting";

export default function TableInvestments({ data }: { data: Investments[] }) {

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
    autoResetPageIndex: false, // ✅ Prevent auto page reset
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
          pageIndex: 0,
        },
        sorting: [
          { id: "cur_amt", desc: true },
        ],
      },
    });

    const filters = [
        { column: "asset_class_name", title: "Asset Class", placeholder: "Asset Class" },
        { column: "cat_name", title: "Category", placeholder: "Category" },
        { column: "structure_name", title: "Structure", placeholder: "Structure" },
        { column: "fund_rating", title: "Rating", placeholder: "Rating" },
        { column: "investor_name", title: "Investor", placeholder: "Investor" },
        { column: "advisor_name", title: "Advisor", placeholder: "Advisor" },
      ];
    
      return <ReactTableWrapper table={table} className="text-xs text-center" filters={filters} aggregations={['pur_amt', 'cur_amt', 'gain_loss']} />;
    }