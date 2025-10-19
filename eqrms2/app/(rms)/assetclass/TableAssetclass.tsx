"use client";

import { useReactTable, getCoreRowModel} from "@tanstack/react-table";
import {columns} from "./columns-assetclass";
import { AssetClass } from "@/types/asset-class-detail";
import { ReactTableWrapper } from "@/components/data-table/ReactTableWrapper";
import { useResponsiveColumns } from "@/lib/hooks/useResponsiveColumns";
import { useAutoSorting } from "@/lib/hooks/useAutoSorting";

interface TableAssetClassProps {
    data: AssetClass[];
}

export function TableAssetClass({data}: TableAssetClassProps) {
    const { responsiveColumns } = useResponsiveColumns(columns,'asset_class_name');

    const table = useReactTable({
        data,
        columns: responsiveColumns,
        getCoreRowModel: getCoreRowModel()
    });

    return <ReactTableWrapper table={table} className="text-xs text-center" showPagination={false} showSearch={false}/>
}