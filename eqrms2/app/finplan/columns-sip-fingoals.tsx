import { ColumnDef } from "@tanstack/react-table";  
import Link from "next/link";
import {SipDetail} from"@/types/sip-detail";

export const columns: ColumnDef<SipDetail>[] = [
    { accessorKey: "sip_fund_name", header: "Fund"},
    { accessorKey: "goal_name", header: "Goal"},
    { accessorKey: "investor_name", header: "Investor"},
    { accessorKey: "sip_amt", header: "SIP"},
    { accessorKey: "months_left", header: "Months Left"},  
    { accessorKey: "sip_fv", header: "SIP Future Value"},    
];