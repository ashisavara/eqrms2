import { ColumnDef } from "@tanstack/react-table";  
import Link from "next/link";
import { SipDetail } from "@/types/sip-detail";
import { isMobileView } from "@/lib/hooks/useResponsiveColumns";

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
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>Amount: {row.original.sip_amount}</div>
                            <div>Installment Date: {row.original.installment_date}</div>
                            <div>Months Left: {row.original.months_left}</div>
                        </div>
                    </div>
                );
            } else {
                // Desktop view - show as normal table cell
                return <div className="text-left">{row.original.sip_fund_name}</div>;
            }
        }
    },
    { accessorKey: "investor_name", header: "Investor"},
    { accessorKey: "asset_class_name", header: "Asset Class"},
    { accessorKey: "cat_name", header: "Category"},
    { accessorKey: "sip_amount", 
        header: "Amount",
        aggregationFn: 'sum',
    },
    { accessorKey: "installment_date", header: "Installment Date"},
    { accessorKey: "months_left", header: "Months Left"},
];
