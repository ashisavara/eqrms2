"use client";

import { useReactTable, getCoreRowModel, getSortedRowModel } from "@tanstack/react-table";
import { ReactTableWrapper } from "@/components/data-table/ReactTableWrapper";
import { columns } from "./columns-sip-finplan";
import { SipDetail } from "@/types/sip-detail";
import { useAutoSorting } from "@/lib/hooks/useAutoSorting";

export default function TableSipFinPlan({ data }: { data: SipDetail[] }) {

  const autoSortedColumns = useAutoSorting(data, columns);

  const table = useReactTable({
    data,
    columns: autoSortedColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSortingRemoval: false,
    });

      return <ReactTableWrapper table={table} className="text-xs text-center" showPagination={false} showSearch={false} />;
    }