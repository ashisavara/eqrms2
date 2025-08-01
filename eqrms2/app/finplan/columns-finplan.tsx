import { ColumnDef } from "@tanstack/react-table";  
import Link from "next/link";
import { FinGoalsDetail } from "@/types/fin-goals-detail";

export const columns: ColumnDef<FinGoalsDetail>[] = [
    { accessorKey: "goal_name", header: "Goal Name"},
    { accessorKey: "goal_ach", header: "Achieved"},
    { accessorKey: "yrs_to_goal", header: "Yrs to Goal"},
    { accessorKey: "pv_goal", header: "PV Goal"},
    { accessorKey: "fv_goals", header: "FV Goal"},
    { accessorKey: "pv_inv", header: "PV Inv"},
    { accessorKey: "fv_inv", header: "FV Inv"},
    { accessorKey: "pending_amt", header: "Pending Amt"},
    { accessorKey: "lumpsum_req", header: "Lumpsum Req"},
    { accessorKey: "sip_req", header: "SIP Req"}
];




