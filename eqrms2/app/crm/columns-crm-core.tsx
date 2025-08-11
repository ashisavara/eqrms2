import { ColumnDef } from "@tanstack/react-table";
import { LeadsTagging } from "@/types/lead-detail";
import Link from "next/link";
import { CrmImportanceRating, CrmWealthRating, CrmProgressionRating, CrmLeadSourceRating, CrmFollowupNumberRating } from "@/components/conditional-formatting";
import { EditLeadsButton } from "@/components/forms/EditLeads";
import { AddDealButton } from "@/components/forms/AddDeals";
import { AddInteractionButton } from "@/components/forms/AddInteractions";
import { AddCustomTag } from "@/components/forms/AddCustomTag";
import { AddDigitalAd } from "@/components/forms/AddDigitalAd";
import { LeadsTaggingValues } from "@/types/forms";
import ToggleVisibility from "@/components/uiComponents/toggle-visibility";
import { AddLeadRole } from "@/components/forms/AddLeadRole";

export const createColumns = (
    importanceOptions: { value: string; label: string }[],
    leadProgressionOptions: { value: string; label: string }[],
    wealthLevelOptions: { value: string; label: string }[],
    dealEstClosureOptions: { value: string; label: string }[],
    dealStageOptions: { value: string; label: string }[],
    dealSegmentOptions: { value: string; label: string }[],
    interactionTypeOptions: { value: string; label: string }[],
    interactionTagOptions: { value: string; label: string }[],
    interactionChannelOptions: { value: string; label: string }[],
    customTagOptions: { value: string; label: string }[],
    leadRoleOptions: { value: string; label: string }[],
    digitalAdOptions: { value: string; label: string }[],
    leadSourceOptions: { value: string; label: string }[],
    leadTypeOptions: { value: string; label: string }[],
    primaryRmOptions: { value: string; label: string }[],
    referralPartnerOptions: { value: string; label: string }[],
): ColumnDef<LeadsTagging>[] => [
    {
        accessorKey: "lead_name",
        header: () => <div className="!text-left">Lead Name</div>,
        size: 250,
        cell: ({ row }) => {
            return <div className="text-left">
                <Link href={`/crm/${row.original.lead_id}`} className="text-blue-500 hover:text-blue-800 font-bold !text-left hover:underline">{row.original.lead_name} </Link> 
                <ToggleVisibility toggleText="Edit">
                    <EditLeadsButton leadData={row.original} leadId={row.original.lead_id} importanceOptions={importanceOptions} 
                    leadProgressionOptions={leadProgressionOptions} leadSourceOptions={leadSourceOptions} 
                    leadTypeOptions={leadTypeOptions} wealthLevelOptions={wealthLevelOptions} primaryRmOptions={primaryRmOptions}
                    referralPartnerOptions={referralPartnerOptions} />
                    <AddDealButton dealEstClosureOptions={dealEstClosureOptions} dealStageOptions={dealStageOptions} 
                    dealSegmentOptions={dealSegmentOptions} relLeadId={row.original.lead_id} initialLeadData={row.original}  
                    importanceOptions={importanceOptions} leadProgressionOptions={leadProgressionOptions} wealthLevelOptions={wealthLevelOptions} />
                    <AddInteractionButton interactionTypeOptions={interactionTypeOptions} interactionTagOptions={interactionTagOptions} 
                    interactionChannelOptions={interactionChannelOptions} initialLeadData={row.original} 
                    importanceOptions={importanceOptions} leadProgressionOptions={leadProgressionOptions} wealthLevelOptions={wealthLevelOptions} />
                    <AddCustomTag 
                        leadId={row.original.lead_id} 
                        customTagOptions={customTagOptions} 
                    />
                    <AddLeadRole 
                    leadId={row.original.lead_id} 
                    leadRoleOptions={leadRoleOptions} 
                    />
                    <AddDigitalAd 
                    leadId={row.original.lead_id} 
                    digitalAdOptions={digitalAdOptions} 
                    />
                </ToggleVisibility>
                {/* <AddLeadTags leadId={row.original.lead_id} customTagOptions={customTagOptions} leadRoleOptions={leadRoleOptions} 
                digitalAdOptions={digitalAdOptions} lead={row.original as LeadsTaggingValues} importanceOptions={importanceOptions} 
                leadProgressionOptions={leadProgressionOptions} leadSourceOptions={leadSourceOptions} 
                leadTypeOptions={leadTypeOptions} wealthLevelOptions={wealthLevelOptions} 
                primaryRmOptions={primaryRmOptions} dealEstClosureOptions={dealEstClosureOptions} 
                dealStageOptions={dealStageOptions} dealSegmentOptions={dealSegmentOptions} 
                interactionTypeOptions={interactionTypeOptions} interactionTagOptions={interactionTagOptions} 
                interactionChannelOptions={interactionChannelOptions} /> */}
                </div>
        }
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
]