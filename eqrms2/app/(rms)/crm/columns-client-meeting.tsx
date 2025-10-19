import { ColumnDef } from "@tanstack/react-table";  
import { InteractionDetail } from "@/types/interaction-detail";
import { formatDate } from "@/lib/utils";
import { MeetingDetailsSheet } from "@/components/forms/MeetingDetailsSheet";

export const columns: ColumnDef<InteractionDetail>[] = [
  { 
    accessorKey: "created_at", 
    header: "Meeting Date", 
    size: 120, 
    cell: ({ getValue }) => getValue() == null ? null : <p className="text-left">{formatDate(getValue() as string)}</p>
  },
  { 
    accessorKey: "meeting_name", 
    header: "Meeting Name", 
    size: 200, 
    cell: ({ row }) => {
      const meetingName = row.getValue("meeting_name") as string;
      return meetingName == null ? null : (
        <MeetingDetailsSheet meetingData={row.original}>
          <p className="text-left">{meetingName}</p>
        </MeetingDetailsSheet>
      );
    }
  },
  { 
    accessorKey: "meeting_summary", 
    header: "Summary", 
    size: 1200, 
    cell: ({ getValue }) => getValue() == null ? null : <p className="text-left">{getValue() as string}</p>
  },    
];