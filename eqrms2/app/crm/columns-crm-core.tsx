import { ColumnDef } from "@tanstack/react-table";
import { LeadsTagging } from "@/types/lead-detail";
import Link from "next/link";
import { CrmImportanceRating, CrmWealthRating, CrmProgressionRating, CrmLeadSourceRating } from "@/components/conditional-formatting";

export const columns: ColumnDef<LeadsTagging>[] = [
    {
        accessorKey: "lead_name",
        header: "Lead Name",
        cell: ({ row }) => {
            return <Link href={`/crm/${row.original.lead_id}`} className="text-blue-700 underline">{row.original.lead_name}</Link>
        }
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
        cell: ({ row }) => {
            return <CrmImportanceRating rating={row.original.importance ?? ""} />
        }
    },
    {
        accessorKey: "wealth_level",
        header: "Wealth",
        filterFn: "arrIncludesSome",
        cell: ({ row }) => {
            return <CrmWealthRating rating={row.original.wealth_level ?? ""} />
        }
    },
    {
        accessorKey: "lead_progression",
        header: "Lead Progression",
        filterFn: "arrIncludesSome",
        cell: ({ row }) => {
            return <CrmProgressionRating rating={row.original.lead_progression ?? ""} />
        }
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
        cell: ({ row }) => {
            return <CrmLeadSourceRating rating={row.original.lead_source ?? ""} />
        }
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