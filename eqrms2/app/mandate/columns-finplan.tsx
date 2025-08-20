import { ColumnDef } from "@tanstack/react-table";  
import Link from "next/link";
import { FinGoalsDetail } from "@/types/fin-goals-detail";
import { isMobileView } from "@/lib/hooks/useResponsiveColumns";
import { EditFinGoalsButton } from "@/components/forms/EditFinancialGoals";

export const columns: ColumnDef<FinGoalsDetail>[] = [
    { 
        accessorKey: "goal_name", 
        header: "Goal Name",
        cell: ({ row, table }) => {
            if (isMobileView(table)) {
                // Mobile view - show as card
                return (
                    <div className="p-3 border rounded-lg space-y-2">
                        <div className="font-semibold text-left">
                            {row.original.goal_name}
                        </div>
                        <div className="text-sm text-gray-600">
                            Achieved: {(row.original.goal_ach as number)?.toFixed(0) || ""}%
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>Years to Goal: {(row.original.yrs_to_goal as number)?.toFixed(1) || ""}</div>
                            <div>FV Goal: {row.original.fv_goals}</div>
                            <div>FV Investment: {(row.original.fv_inv as number)?.toFixed(0) || ""}</div>
                            <div>Pending Amount: {(row.original.pending_amt as number)?.toFixed(0) || ""}</div>
                            <div>Lumpsum Required: {(row.original.lumpsum_req as number)?.toFixed(0) || ""}</div>
                            <div>SIP Required: {(row.original.sip_req as number)?.toFixed(0) || ""}</div>
                        </div>
                    </div>
                );
            } else {
                // Desktop view - show as normal table cell
                return (
                    <div className="text-left">
                        {row.original.goal_name}
                        <EditFinGoalsButton goalData={row.original} goalId={row.original.goal_id} />
                    </div>
                );
            }
        }
    },
    { accessorKey: "goal_ach", header: "Achieved", cell: ({ getValue }) => (getValue() as number)?.toFixed(0) || "" },
    { 
        accessorKey: "yrs_to_goal", 
        header: "Yrs to Goal", 
        size:80,
        cell: ({ getValue }) => (getValue() as number)?.toFixed(1) || "" 
    },
    { accessorKey: "pv_goal", header: "PV Goal", size:80, cell: ({ getValue }) => (getValue() as number)?.toFixed(0) || "" },
    { accessorKey: "fv_goals", header: "FV Goal", size:80},
    { accessorKey: "pv_inv", header: "PV Inv", size:80, cell: ({ getValue }) => (getValue() as number)?.toFixed(0) || "" },
    { accessorKey: "fv_inv", header: "FV Inv", size:80, cell: ({ getValue }) => (getValue() as number)?.toFixed(0) || "" },
    { accessorKey: "pending_amt", header: "Pending Amt", size:80, cell: ({ getValue }) => (getValue() as number)?.toFixed(0) || "" },
    { accessorKey: "lumpsum_req", header: "Lumpsum Req", size:80, cell: ({ getValue }) => (getValue() as number)?.toFixed(0) || "" },
    { accessorKey: "sip_req", header: "SIP Req", size:80, cell: ({ getValue }) => (getValue() as number)?.toFixed(0) || "" }
];




