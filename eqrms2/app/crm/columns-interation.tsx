import { ColumnDef } from "@tanstack/react-table";  
import Link from "next/link";
import {InteractionDetail} from"@/types/interaction-detail";
import { formatDate } from "@/lib/utils";
import { EditInteractionButton } from "@/components/forms/EditInteractions";
import { LeadsTagging } from "@/types/lead-detail";

/**
 * Creates column definitions for the interactions table.
 * 
 * Why this is a function instead of static columns:
 * - The EditInteractionButton component needs access to lead data for context
 * - Static column definitions can't access dynamic data from the parent page
 * - By making this a factory function, we can inject the lead data at runtime
 * 
 * Note: Form options are now sourced from MasterOptionsContext within the form components,
 * eliminating the need to pass them through the column definition.
 */
export const createColumns = (
    leadsData: LeadsTagging[]
): ColumnDef<InteractionDetail>[] => [
    { 
        accessorKey: "created_at", 
        header: "Meeting Date", size:120, 
        cell: ({ getValue }) => getValue() == null ? null : <p className="text-left">{formatDate(getValue() as string)}</p>},

    { accessorKey: "meeting_name", header: "Meeting Name", size:200, 
        cell: ({ getValue }) => getValue() == null ? null : <p className="text-left">{getValue() as string}</p>},
    { accessorKey: "interaction_type", header: "Type", size:100, cell: ({ row }) => {
        // Find the corresponding lead data for this interaction
        const currentLeadData = leadsData.find(lead => lead.lead_id === row.original.rel_lead_id);
        
        return row.original.meeting_name == null ? null : 
        <div className="text-left">
        <EditInteractionButton 
            meetingId={row.original.meeting_id} 
            interactionData={row.original} 
            relLeadId={row.original.rel_lead_id}
            initialLeadData={currentLeadData}
        />
        </div>
    }},
    { accessorKey: "rm_name", header: "Created By", size:150, cell: ({ getValue }) => getValue() == null ? null : <p className="text-left">{getValue() as string}</p>},
    { accessorKey: "lead_name", header: "Lead", size:150, cell: ({ row }) => {
        return <div className="text-left">
            <Link href={`/crm/${row.original.rel_lead_id}`} className="text-blue-500 hover:text-blue-800 hover:font-bold !text-left hover:underline">{row.original.lead_name} </Link> 
            </div>
    }},
    { accessorKey: "meeting_summary", header: "Summary", size:800, cell: ({ getValue }) => getValue() == null ? null : <p className="text-left">{getValue() as string}</p>},
    {accessorKey: "interaction_tag", header: "Tag", meta: { isFilterOnly: true },filterFn: "arrIncludesSome",},
    {accessorKey: "interaction_channel", header: "Channel", meta: { isFilterOnly: true },filterFn: "arrIncludesSome",},
    {accessorKey: "answered", header: "Answered", meta: { isFilterOnly: true },filterFn: "arrIncludesSome",},
    
];