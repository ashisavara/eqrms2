import { ColumnDef } from "@tanstack/react-table";  
import Link from "next/link";
import { Investments } from "@/types/investment-detail";
import { isMobileView } from "@/lib/hooks/useResponsiveColumns";
import { EditInvGoalsButton } from "@/components/forms/EditInvGoals";

export const columns: ColumnDef<Investments>[] = [
    { 
        accessorKey: "fund_name", 
        header: "Name",
        cell: ({ row, table }) => {
            if (isMobileView(table)) {
                // Mobile view - show as card
                return (
                    <div className="p-3 border rounded-lg space-y-2">
                        <div className="font-semibold text-left">
                            {row.original.fund_name}
                        </div>
                        <div className="text-sm text-gray-600">
                            Goal: {row.original.goal_name}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>Asset Class: {row.original.asset_class_name}</div>
                            <div>Current Value: {(row.original.cur_amt as number)?.toFixed(0) || ""}</div>
                            <div>Future Value: {(row.original.fv_inv as number)?.toFixed(0) || ""}</div>
                        </div>
                    </div>
                );
            } else {
                // Desktop view - show as normal table cell
                return <div className="text-left flex items-center gap-2">
                    {row.original.fund_name}
                    <EditInvGoalsButton investmentsData={row.original} investment_id={row.original.investment_id} />
                </div>;
            }
        }
    },
    { accessorKey: "goal_name", header: "Goal"},
    { accessorKey: "investor_name", header: "Investor"},
    { accessorKey: "asset_class", header: "Asset Class"},
    { accessorKey: "cur_amt", header: "Current Value", cell: ({ getValue }) => (getValue() as number)?.toFixed(0) || "" },
    { accessorKey: "fv_inv", header: "Future Value", cell: ({ getValue }) => (getValue() as number)?.toFixed(0) || "" },
];