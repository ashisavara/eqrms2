import { ColumnDef } from "@tanstack/react-table";
import { LeadsTagging } from "@/types/lead-detail";
import Link from "next/link";

export const columns: ColumnDef<LeadsTagging>[] = [
    {
        accessorKey: "lead_name",
        header: "Lead Name",
    }, 
    {
        accessorKey: "days_followup",
        header: "Followup"   
    },
    {
        accessorKey: "days_since_last_contact",
        header: "Last Contact"   
    },
    {
        accessorKey: "importance",
        header: "Importance",
        filterFn: "arrIncludesSome",
    },
    {
        accessorKey: "wealth_level",
        header: "Wealth",
        filterFn: "arrIncludesSome",
    },
    {
        accessorKey: "lead_progression",
        header: "Lead Progression",
        filterFn: "arrIncludesSome",
    },
    {
        accessorKey: "lead_summary",
        header: "Summary"
    },
    {
        accessorKey: "lead_source",
        header: "Source", 
        meta: { isFilterOnly: true },
        filterFn: "arrIncludesSome",
    },
    {
        accessorKey: "lead_type",
        header: "Type", 
        meta: { isFilterOnly: true },
        filterFn: "arrIncludesSome",
    },
    {
        accessorKey: "primary_rm",
        header: "RM",
        meta: { isFilterOnly: true },
        filterFn: "arrIncludesSome",
    },
]