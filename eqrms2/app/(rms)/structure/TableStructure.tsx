"use client";

import { useReactTable, getCoreRowModel} from "@tanstack/react-table";
import {columns} from "./columns-structure";
import { Structure } from "@/types/structure-detail";
import { ReactTableWrapper } from "@/components/data-table/ReactTableWrapper";
import { useResponsiveColumns } from "@/lib/hooks/useResponsiveColumns";
import { useAutoSorting } from "@/lib/hooks/useAutoSorting";

interface TableStructureProps {
    data: Structure[];
}

export function TableStructure({data}: TableStructureProps) {
    const { responsiveColumns } = useResponsiveColumns(columns,'structure_name');

    const table = useReactTable({
        data,
        columns: responsiveColumns,
        getCoreRowModel: getCoreRowModel()
    });

    return <ReactTableWrapper table={table} className="text-xs text-center" showPagination={false} showSearch={false}/>
}

