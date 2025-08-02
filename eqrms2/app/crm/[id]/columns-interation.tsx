import { ColumnDef } from "@tanstack/react-table";  
import Link from "next/link";
import {InteractionDetail} from"@/types/interaction-detail";
import { formatDate } from "@/lib/utils";

export const columns: ColumnDef<InteractionDetail>[] = [
    { accessorKey: "meeting_date", header: "Meeting Date", size:120, cell: ({ getValue }) => getValue() == null ? null : <p className="text-left">{formatDate(getValue() as string)}</p>},
    { accessorKey: "meeting_name", header: "Meeting Name", size:200, cell: ({ getValue }) => getValue() == null ? null : <p className="text-left font-bold text-blue-600 hover:underline">{getValue() as string}</p>},
    { accessorKey: "rm_name", header: "Created By", size:150},
    { accessorKey: "meeting_summary", header: "Summary", size:800, cell: ({ getValue }) => getValue() == null ? null : <p className="text-left">{getValue() as string}</p>},
    
];