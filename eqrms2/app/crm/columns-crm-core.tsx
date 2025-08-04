import { ColumnDef } from "@tanstack/react-table";
import { LeadsTagging } from "@/types/lead-detail";
import Link from "next/link";
import { CrmImportanceRating, CrmWealthRating, CrmProgressionRating, CrmLeadSourceRating } from "@/components/conditional-formatting";
import { EditLeadTagsButton } from "@/components/forms/EditLeadTags";

export const createColumns = (
    importanceOptions: { value: string; label: string }[],
    leadProgressionOptions: { value: string; label: string }[],
    wealthLevelOptions: { value: string; label: string }[],
): ColumnDef<LeadsTagging>[] => [
    {
        accessorKey: "lead_name",
        header: () => <div className="!text-left">Lead Name</div>,
        size: 200,
        cell: ({ row }) => {
            return <div className="text-left">
                <Link href={`/crm/${row.original.lead_id}`} className="text-blue-700 font-bold !text-left">{row.original.lead_name}</Link> |  
                <EditLeadTagsButton
  leadData={row.original}
  leadId={row.original.lead_id}
  importanceOptions={importanceOptions}
  leadProgressionOptions={leadProgressionOptions}
  wealthLevelOptions={wealthLevelOptions}
  leadName={row.original.lead_name ?? 'Unknown Lead'}
  country_code={row.original.country_code ?? ''}
  phone_number={row.original.phone_number ?? ''}
/>
                </div>
        }
    }, 
        {
        accessorKey: "days_followup",
        header: "Followup",
        size: 80
    },
    {
        accessorKey: "days_since_last_contact",  
        header: "Last Contact",
        size: 80, 
    },
    {
        accessorKey: "importance",
        header: "Importance",
        filterFn: "arrIncludesSome",
        cell: ({ row }) => {
            return <CrmImportanceRating rating={row.original.importance ?? ""} />
        },
        size:150
    },
    {
        accessorKey: "wealth_level",
        header: "Wealth",
        filterFn: "arrIncludesSome",
        cell: ({ row }) => {
            return <CrmWealthRating rating={row.original.wealth_level ?? ""} />
        },
        size:150
    },
    {
        accessorKey: "lead_progression",
        header: "Lead Progression", 
        filterFn: "arrIncludesSome",
        cell: ({ row }) => {
            return <CrmProgressionRating rating={row.original.lead_progression ?? ""} />
        },
        size: 150  // ✅ More realistic for badge content
    },
    {
        accessorKey: "lead_summary",
        header: "Summary", 
        size: 600, // ✅ Set a large size to claim remaining space
        cell: ({ row }) => {
            return <div className="!text-left">{row.original.lead_summary}</div>
        }
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
        accessorKey: "rm_name",
        header: "RM",
        meta: { isFilterOnly: true },
        filterFn: "arrIncludesSome",
    },
]