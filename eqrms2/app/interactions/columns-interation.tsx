import { ColumnDef } from "@tanstack/react-table";  
import Link from "next/link";
import {InteractionDetail} from"@/types/interaction-detail";
import { formatDate } from "@/lib/utils";
import { EditInteractionButton } from "@/components/forms/EditInteractions";

export const columns: ColumnDef<InteractionDetail>[] = [
    { 
        accessorKey: "created_at", 
        header: "Meeting Date", size:120, cell: ({ getValue }) => getValue() == null ? null : <p className="text-left">{formatDate(getValue() as string)}</p>},

    { accessorKey: "meeting_name", header: "Meeting Name", size:200, 
        cell: ({ row }) => row.original.meeting_name == null ? null : <EditInteractionButton meetingId={row.original.meeting_id} interactionData={row.original} />,
    },
    { accessorKey: "interaction_type", header: "Type", size:100, cell: ({ getValue }) => getValue() == null ? null : <p className="text-left">{getValue() as string}</p>},
    { accessorKey: "rm_name", header: "Created By", size:150, cell: ({ getValue }) => getValue() == null ? null : <p className="text-left">{getValue() as string}</p>},
    { accessorKey: "meeting_summary", header: "Summary", size:800, cell: ({ getValue }) => getValue() == null ? null : <p className="text-left">{getValue() as string}</p>},
    
];