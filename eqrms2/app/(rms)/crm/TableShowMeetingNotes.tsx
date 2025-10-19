"use client";

import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, getSortedRowModel } from "@tanstack/react-table";
import { ReactTableWrapper } from "@/components/data-table/ReactTableWrapper";
import { columns } from "./columns-client-meeting";
import { InteractionDetail } from "@/types/interaction-detail";
import { useAutoSorting } from "@/lib/hooks/useAutoSorting";
import { useResponsiveColumns } from "@/lib/hooks/useResponsiveColumns";

export default function TableShowMeetingNotes({ 
  data
}: { 
  data: InteractionDetail[];
}) {
  
  // Use responsive columns helper
  const { responsiveColumns } = useResponsiveColumns(columns, 'meeting_name');
  const autoSortedColumns = useAutoSorting(data, responsiveColumns);

  const table = useReactTable({
    data,
    columns: autoSortedColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSortingRemoval: false,
    globalFilterFn: "includesString",
    autoResetPageIndex: false,
    initialState: {
      pagination: {
        pageSize: 30,
        pageIndex: 0,
      },
      sorting: [
        { id: "created_at", desc: true },
      ],
    },
  });
    
  return (
    <div className="space-y-4">
      <h3>Meeting Notes</h3>
      
      <ReactTableWrapper 
        table={table} 
        className="text-xs text-center" 
        filters={[]} 
        showSearch={true}
      />
    </div>
  );
}