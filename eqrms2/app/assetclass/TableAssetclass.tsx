"use client";

import { useReactTable, getCoreRowModel} from "@tanstack/react-table";
import {columns} from "./columns-assetclass";
import { AssetClass } from "@/types/asset-class-detail";
import { ReactTableWrapper } from "@/components/data-table/ReactTableWrapper";

interface TableAssetClassProps {
    data: AssetClass[];
}

export function TableAssetClass({data}: TableAssetClassProps) {

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel()
    });

    return <ReactTableWrapper table={table} className="text-xs text-center" showPagination={false} showSearch={false}/>
}