import { ColumnDef } from "@tanstack/react-table";
import { LeadsTagging } from "@/types/lead-detail";
import Link from "next/link";
import { CrmImportanceRating, CrmWealthRating, CrmProgressionRating, CrmLeadSourceRating, CrmFollowupNumberRating, CrmInterestRating } from "@/components/conditional-formatting";
import { EditLeadsButton } from "@/components/forms/EditLeads";
import { AddDealButton } from "@/components/forms/AddDeals";
import { AddInteractionButton } from "@/components/forms/AddInteractions";
import { AddFollowUpButton } from "@/components/forms/AddFollowUp";
import ToggleVisibility from "@/components/uiComponents/toggle-visibility";
import { AddMeetingNoteButton } from "@/components/forms/AddMeetingNote";

export const createColumns = (): ColumnDef<LeadsTagging>[] => [
    {
        accessorKey: "lead_name",
        header: () => <div className="!text-left">Lead Name</div>,
        size: 150,
        cell: ({ row }) => {
            return <div className="text-left">
                <Link href={`/crm/${row.original.lead_id}`} className="blue-hyperlink">{row.original.lead_name} </Link> 
                <ToggleVisibility toggleText="Edit" className="text-xs text-green-700 hover:underline hover:font-bold">
                    <EditLeadsButton leadData={row.original} leadId={row.original.lead_id} />
                    <AddDealButton relLeadId={row.original.lead_id} initialLeadData={row.original} />
                    <AddFollowUpButton relLeadId={row.original.lead_id} initialLeadData={row.original} />
                    <AddInteractionButton relLeadId={row.original.lead_id} initialLeadData={row.original} />
                    <AddMeetingNoteButton relLeadId={row.original.lead_id} initialLeadData={row.original} />
                </ToggleVisibility>
                </div>
        }
    }, 
    {
        accessorKey: "followup_overdue",
        header: "Overdue",
        filterFn: "arrIncludesSome",
        size: 80,
        cell: ({ row }) => {
            const val = row.original.followup_overdue;
            const isOverdue = val === true;
            return (
                <div className="text-xs">
                    {isOverdue ? <span className="text-red-800 bg-red-200 px-2 py-1 rounded-md font-semibold">Overdue</span> : ""}
                </div>
            );
        },
    },
    {
        accessorKey: "phone_e164",
        header: "Phone",
        size: 180,
        cell: ({ row }) => {
            return <div> {row.original.phone_e164} </div>
        },
    },
        {
        accessorKey: "days_followup",
        header: "Followup",
        size: 80,
        cell: ({ row }) => {
            return <div className="text-xs"><CrmFollowupNumberRating rating={row.original.days_followup as number} /></div>
        },
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
            return <div className="text-xs"><CrmImportanceRating rating={row.original.importance ?? ""} /></div>
        },
        size:80
    },
    {
        accessorKey: "interest",
        header: "Interest",
        filterFn: "arrIncludesSome",
        cell: ({ row }) => {
            return <div className="text-xs"><CrmInterestRating rating={row.original.interest ?? ""} /></div>
        },
        size: 80
    },
    {
        accessorKey: "wealth_level",
        header: "Wealth",
        filterFn: "arrIncludesSome",
        cell: ({ row }) => {
            return <div className="text-xs"><CrmWealthRating rating={row.original.wealth_level ?? ""} /></div>
        },
        size:100
    },
    {
        accessorKey: "lead_progression",
        header: "Lead Progression", 
        filterFn: "arrIncludesSome",
        cell: ({ row }) => {
            return <div className="text-xs"><CrmProgressionRating rating={row.original.lead_progression ?? ""} /></div>
        },
        size: 150  // ✅ More realistic for badge content
    },
    {
        accessorKey: "lead_summary",
        header: "Summary", 
        size: 500, // ✅ Set a large size to claim remaining space
        cell: ({ row }) => {
            return <div className="!text-left text-xs">{row.original.lead_summary}</div>
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
    {
        accessorKey: "created_at",
        header: "Created at",
        meta: { isFilterOnly: true },
        filterFn: "arrIncludesSome",
    },
]