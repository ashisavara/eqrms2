import { ColumnDef } from "@tanstack/react-table";  
import Link from "next/link";
import { FinGoalsDetail } from "@/types/fin-goals-detail";
import { isMobileView } from "@/lib/hooks/useResponsiveColumns";
import { EditFinGoalsButton } from "@/components/forms/EditFinancialGoals";
import { PencilIcon } from "lucide-react";

export const columns: ColumnDef<FinGoalsDetail>[] = [
    { 
        accessorKey: "goal_name", 
        header: "Goal Name",
        size:150,
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
                            <div>Goal Description: {row.original.goal_description}</div>
                        </div>
                    </div>
                );
            } else {
                // Desktop view - show as normal table cell
                return (
                    <div className="text-left">
                        <EditFinGoalsButton goalData={row.original} goalId={row.original.goal_id}>
                            <span className="blue-hyperlink">
                                {row.original.goal_name}
                            </span>
                        </EditFinGoalsButton>
                    </div>
                );
            }
        }
    },
    { 
        accessorKey: "goal_description", 
        header: "Goal Description", 
        size:500, 
        cell: ({ getValue }) => (getValue() as string) || "" 
    },
];




