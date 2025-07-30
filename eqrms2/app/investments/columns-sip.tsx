import { ColumnDef } from "@tanstack/react-table";  
import Link from "next/link";
import {SipDetail} from"@/types/sip-detail";

export const columns: ColumnDef<SipDetail>[] = [
    { accessorKey: "sip_fund_name", header: "Fund"},
    { accessorKey: "investor_name", header: "Investor"},
    { accessorKey: "asset_class_name", header: "Asset Class"},
    { accessorKey: "cat_name", header: "Category"},
    { accessorKey: "sip_amount", header: "Amount"},
    { accessorKey: "installment_date", header: "Installment Date"},
    { accessorKey: "months_left", header: "Months Left"},
];
