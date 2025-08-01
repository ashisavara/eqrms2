import { ColumnDef } from "@tanstack/react-table";  
import Link from "next/link";
import { FinGoalsDetail } from "@/types/fin-goals-detail";

export const columns: ColumnDef<FinGoalsDetail>[] = [
    { accessorKey: "goal_name", header: "Goal Name"},
    { accessorKey: "goal_ach", header: "Achieved", cell: ({ getValue }) => (getValue() as number)?.toFixed(0) || "" },
    { 
        accessorKey: "yrs_to_goal", 
        header: "Yrs to Goal", 
        cell: ({ getValue }) => (getValue() as number)?.toFixed(1) || "" 
    },
    { accessorKey: "pv_goal", header: "PV Goal", cell: ({ getValue }) => (getValue() as number)?.toFixed(0) || "" },
    { accessorKey: "fv_goals", header: "FV Goal"},
    { accessorKey: "pv_inv", header: "PV Inv", cell: ({ getValue }) => (getValue() as number)?.toFixed(0) || "" },
    { accessorKey: "fv_inv", header: "FV Inv", cell: ({ getValue }) => (getValue() as number)?.toFixed(0) || "" },
    { accessorKey: "pending_amt", header: "Pending Amt", cell: ({ getValue }) => (getValue() as number)?.toFixed(0) || "" },
    { accessorKey: "lumpsum_req", header: "Lumpsum Req", cell: ({ getValue }) => (getValue() as number)?.toFixed(0) || "" },
    { accessorKey: "sip_req", header: "SIP Req", cell: ({ getValue }) => (getValue() as number)?.toFixed(0) || "" }
];




