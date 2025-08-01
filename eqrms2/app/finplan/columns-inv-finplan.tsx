import { ColumnDef } from "@tanstack/react-table";  
import Link from "next/link";
import {Investments} from"@/types/investment-detail";

export const columns: ColumnDef<Investments>[] = [
    { accessorKey: "fund_name", header: "Name"},
    { accessorKey: "goal_name", header: "Goal"},
    { accessorKey: "investor_name", header: "Investor"},
    { accessorKey: "asset_class", header: "Asset Class"},
    { accessorKey: "cur_amt", header: "Current Value"},
    { accessorKey: "fv_inv", header: "Future Value"},
];