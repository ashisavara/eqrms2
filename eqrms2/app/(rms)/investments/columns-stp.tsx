import { ColumnDef } from "@tanstack/react-table";  
import Link from "next/link";
import { StpDetails } from "@/types/stp-detail";
import { isMobileView } from "@/lib/hooks/useResponsiveColumns";

export const columns: ColumnDef<StpDetails>[] = [
    { 
        accessorKey: "scheme_from", 
        header: "Scheme From",
        cell: ({ row, table }) => {
            if (isMobileView(table)) {
                // Mobile view - show as card
                return (
                    <div className="p-3 border rounded-lg space-y-2">
                        <div className="font-semibold text-left">
                            {row.original.scheme_from}
                        </div>
                        <div className="text-sm text-gray-600">To: {row.original.scheme_to}</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>Amount: {row.original.stp_amt}</div>
                            <div>Installment Day: {row.original.installment_day}</div>
                            <div>Frequency: {row.original.frequency}</div>
                            <div>Pending: {row.original.pending_installments}</div>
                        </div>
                    </div>
                );
            } else {
                // Desktop view - show as normal table cell
                return <div className="text-left">{row.original.scheme_from}</div>;
            }
        }
    },
    { accessorKey: "scheme_to", header: "Scheme To"},
    { accessorKey: "stp_amt", header: "Amount",size:80,aggregationFn: 'sum',},
    { accessorKey: "installment_day", header: "Installment Day",size:40},
    { accessorKey: "frequency", header: "Frequency",size:80},
    { accessorKey: "pending_installments", header: "Pending Inst",size:40},
    { accessorKey: "total_instalments", header: "Total Inst",size:40},
];

