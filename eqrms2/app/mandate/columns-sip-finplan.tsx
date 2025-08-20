import { ColumnDef } from "@tanstack/react-table";  
import Link from "next/link";
import { SipDetail } from "@/types/sip-detail";
import { isMobileView } from "@/lib/hooks/useResponsiveColumns";
import { EditSipGoalsButton } from "@/components/forms/EditSipGoals";

export const columns: ColumnDef<SipDetail>[] = [
    { 
        accessorKey: "sip_fund_name", 
        header: "Fund",
        cell: ({ row, table }) => {
            if (isMobileView(table)) {
                // Mobile view - show as card
                return (
                    <div className="p-3 border rounded-lg space-y-2">
                        <div className="font-semibold text-left">
                            {row.original.sip_fund_name}
                        </div>
                        <div className="text-sm text-gray-600">
                            Goal: {row.original.goal_name}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>Amount: {row.original.sip_amount}</div>
                            <div>Months Left: {row.original.months_left}</div>
                            <div>Future Value: {(row.original.sip_fv as number)?.toFixed(0) || ""}</div>
                        </div>
                    </div>
                );
            } else {
                // Desktop view - show as normal table cell
                return <div className="text-left flex items-center gap-2">
                    <EditSipGoalsButton sipData={row.original} sip_id={row.original.sip_id}>
                        <span className="blue-hyperlink">
                            {row.original.sip_fund_name}
                        </span>
                    </EditSipGoalsButton>
                    </div>;
            }
        }
    },
    { accessorKey: "goal_name", header: "Goal"},
    { accessorKey: "investor_name", header: "Investor"},
    { accessorKey: "sip_amount", header: "Amount"},
    { accessorKey: "months_left", header: "Months Left"},  
    { accessorKey: "sip_fv", header: "SIP Future Value", cell: ({ getValue }) => (getValue() as number)?.toFixed(0) || "" },    
];