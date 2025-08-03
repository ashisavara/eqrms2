import { ColumnDef } from "@tanstack/react-table";  
import Link from "next/link";
import {InteractionDetail} from"@/types/interaction-detail";
import { formatDate } from "@/lib/utils";
import { EditInteractionButton } from "@/components/forms/EditInteractions";

/**
 * Creates column definitions for the interactions table.
 * 
 * Why this is a function instead of static columns:
 * - The EditInteractionButton component needs access to dropdown options (interactionTypeOptions, etc.)
 * - These options are fetched dynamically in page.tsx using fetchOptions()
 * - Static column definitions can't access dynamic data from the parent page
 * - By making this a factory function, we can inject the options data at runtime
 * 
 * Data flow:
 * page.tsx (fetches options) → TableInteractions (receives options) → createColumns (uses options in EditInteractionButton)
 * 
 * This pattern allows the form components to have proper dropdown options while maintaining
 * clean separation of concerns and avoiding prop drilling through multiple levels.
 */
export const createColumns = (
    interactionTypeOptions: { value: string; label: string }[],
    interactionTagOptions: { value: string; label: string }[],
    interactionChannelOptions: { value: string; label: string }[]
): ColumnDef<InteractionDetail>[] => [
    { 
        accessorKey: "created_at", 
        header: "Meeting Date", size:120, cell: ({ getValue }) => getValue() == null ? null : <p className="text-left">{formatDate(getValue() as string)}</p>},

    { accessorKey: "meeting_name", header: "Meeting Name", size:200, 
        cell: ({ row }) => row.original.meeting_name == null ? null : <EditInteractionButton meetingId={row.original.meeting_id} interactionData={row.original} interactionChannelOptions={interactionChannelOptions} interactionTagOptions={interactionTagOptions} interactionTypeOptions={interactionTypeOptions}/>,
    },
    { accessorKey: "interaction_type", header: "Type", size:100, cell: ({ getValue }) => getValue() == null ? null : <p className="text-left">{getValue() as string}</p>},
    { accessorKey: "rm_name", header: "Created By", size:150, cell: ({ getValue }) => getValue() == null ? null : <p className="text-left">{getValue() as string}</p>},
    { accessorKey: "meeting_summary", header: "Summary", size:800, cell: ({ getValue }) => getValue() == null ? null : <p className="text-left">{getValue() as string}</p>},
    
];