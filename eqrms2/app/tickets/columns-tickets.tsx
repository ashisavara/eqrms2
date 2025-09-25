import { ColumnDef } from "@tanstack/react-table";  
import {Ticket} from "@/types/tickets-detail";
import { formatDate } from "@/lib/utils";
import { EditTicketButton } from "@/components/forms/EditTickets";

export const columns: ColumnDef<Ticket>[] = [
  { accessorKey: "created_at", 
    header: "Created", 
    cell: ({ getValue }) => getValue() == null ? null : <div>{formatDate(getValue() as string)}</div> },
  { accessorKey: "ticket_name", header: "Ticket", cell: ({ getValue, row }) => {
    const ticketName = getValue() as string;
    const ticketData = row.original;
    return ticketName == null ? null : (
      <EditTicketButton 
        ticketData={ticketData} 
        ticketId={ticketData.ticket_id}
      />
    );
  }},
  { accessorKey: "ticket_summary", header: "Summary" },
  { accessorKey: "hours_passed", header: "Hours", cell: ({ getValue }) => getValue() == null ? null : <div className="text-blue-500">{getValue() as number}</div> },
  { accessorKey: "creator_name", header: "Raised by", cell: ({ getValue }) => getValue() == null ? null : <div className="text-blue-500">{getValue() as string}</div>, filterFn: "arrIncludesSome" },
  { accessorKey: "status", header: "Status", cell: ({ getValue }) => getValue() == null ? null : <div className="text-blue-500">{getValue() as string}</div> },
  { accessorKey: "due_date", header: "Due Date", 
    cell: ({ getValue }) => getValue() == null ? null : <div>{formatDate(getValue() as string)}</div>  },
  { accessorKey: "status_desc", header: "Status Desc", cell: ({ getValue }) => getValue() == null ? null : <div className="text-blue-500">{getValue() as string}</div> },
  { accessorKey: "assignee_name", header: "Assignee", cell: ({ getValue }) => getValue() == null ? null : <div className="text-blue-500">{getValue() as string}</div>, filterFn: "arrIncludesSome" },
  { accessorKey: "importance", header: "Importance", cell: ({ getValue }) => getValue() == null ? null : <div className="text-blue-500">{getValue() as string}</div>, filterFn: "arrIncludesSome" },
  { accessorKey: "ticket_segment", header: "Segment", cell: ({ getValue }) => getValue() == null ? null : <div className="text-blue-500">{getValue() as string}</div>, filterFn: "arrIncludesSome" },
];