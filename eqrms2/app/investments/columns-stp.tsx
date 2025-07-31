import { ColumnDef } from "@tanstack/react-table";  
import Link from "next/link";
import {StpDetails} from"@/types/stp-detail";

export const columns: ColumnDef<StpDetails>[] = [
    { accessorKey: "scheme_from", header: "Scheme From"},
    { accessorKey: "scheme_to", header: "Scheme To"},
    { accessorKey: "stp_amt", header: "Amount",size:80,aggregationFn: 'sum',},
    { accessorKey: "installment_day", header: "Installment Day",size:40},
    { accessorKey: "frequency", header: "Frequency",size:80},
    { accessorKey: "pending_installments", header: "Pending Inst",size:40},
    { accessorKey: "total_instalments", header: "Total Inst",size:40},
];

