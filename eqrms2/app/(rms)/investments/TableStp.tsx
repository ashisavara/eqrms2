"use client";

import { useReactTable, getCoreRowModel, getSortedRowModel} from "@tanstack/react-table";
import { ReactTableWrapper } from "@/components/data-table/ReactTableWrapper";
import { columns } from "./columns-stp";
import { StpDetails } from "@/types/stp-detail";
import { useAutoSorting } from "@/lib/hooks/useAutoSorting";
import { useResponsiveColumns } from "@/lib/hooks/useResponsiveColumns";

export default function TableInvestments({ data }: { data: StpDetails[] }) {
  // ✅ Use responsive columns helper
  const { responsiveColumns } = useResponsiveColumns(columns, 'scheme_from');
  
  const autoSortedColumns = useAutoSorting(data, responsiveColumns);

  const table = useReactTable({
    data,
    columns: autoSortedColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSortingRemoval: false,
    });

      return <ReactTableWrapper table={table} className="text-xs text-center" aggregations={['stp_amt']} showPagination={false} showSearch={false} />;
    }