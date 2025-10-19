import { ColumnDef } from "@tanstack/react-table";  
import Link from "next/link";
import { SipDetail } from "@/types/sip-detail";
import { isMobileView } from "@/lib/hooks/useResponsiveColumns";
import SimpleTable from "@/components/tables/singleRowTable";

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
                    <SimpleTable 
                        headers={[{ label: "Amount" }, { label: "Installment Date" }, { label: "Months Left" }]}
                        body={[{ value: row.original.sip_amount }, { value: row.original.installment_date }, { value: row.original.months_left }]}
                    />
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
