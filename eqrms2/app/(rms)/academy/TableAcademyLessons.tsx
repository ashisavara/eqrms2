"use client";

import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, getSortedRowModel } from "@tanstack/react-table";
import { ReactTableWrapper } from "@/components/data-table/ReactTableWrapper";
import { getColumns } from "./columns-academy-lessons";
import { AcademyLessonDetail } from "@/types/academy-lesson-detail";
import { useAutoSorting } from "@/lib/hooks/useAutoSorting";

export default function TableAcademyLessons({ 
  data, 
  canEdit 
}: { 
  data: AcademyLessonDetail[];
  canEdit: boolean;
}) {
  const columns = getColumns(canEdit);
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
      arrIncludesSome: (row, columnId, value) => {
        const cellValue = row.getValue(columnId);
        return value.includes(cellValue);
      },
    },
    initialState: {
      pagination: {
        pageSize: 30,
      },
    },
  });

  const filters = [
    { column: "course", title: "Course", placeholder: "Course" },
    { column: "difficulty", title: "Difficulty", placeholder: "Difficulty" },
  ];

  return <ReactTableWrapper table={table} filters={filters} />;
}
