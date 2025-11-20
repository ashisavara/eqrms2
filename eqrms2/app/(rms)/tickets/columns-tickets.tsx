import { ColumnDef } from "@tanstack/react-table";  
import {Ticket} from "@/types/tickets-detail";
import { formatDate } from "@/lib/utils";
import { EditTicketButton } from "@/components/forms/EditTickets";
import { ImportanceRating } from "@/components/conditional-formatting";

export const columns: ColumnDef<Ticket>[] = [
  { accessorKey: "created_at", 
    header: "Created", size:90,
    cell: ({ getValue }) => getValue() == null ? null : <div>{formatDate(getValue() as string)}</div> },
  { accessorKey: "ticket_name", header: "Ticket", size:150, cell: ({ getValue, row }) => {
    const ticketName = getValue() as string;
    const ticketData = row.original;
    return ticketName == null ? null : (
      <EditTicketButton 
        ticketData={ticketData} 
        ticketId={ticketData.ticket_id}
      />
    );
  }},
  { accessorKey: "importance", header: "Importance", size:80,
    cell: ({ getValue }) => getValue() == null ? null : <ImportanceRating rating={getValue() as string}>{getValue() as string}</ImportanceRating>, filterFn: "arrIncludesSome" },
  { accessorKey: "status", header: "Status",  size:80,
      cell: ({ getValue }) => getValue() == null ? null : <div>{getValue() as string}</div> },
  { accessorKey: "ticket_summary", size:150, header: "Summary" },
  { accessorKey: "hours_passed", header: "Hours",  size:50,
    cell: ({ getValue }) => getValue() == null ? null : <div>{getValue() as number}</div> },
  { accessorKey: "creator_name", header: "Raised by", size:90,
    cell: ({ getValue }) => getValue() == null ? null : <div>{getValue() as string}</div>, filterFn: "arrIncludesSome" },
  { accessorKey: "assignee_name", header: "Assignee",  size:90,
    cell: ({ getValue }) => getValue() == null ? null : <div>{getValue() as string}</div>, filterFn: "arrIncludesSome" },
  { accessorKey: "segment_name", header: "Segment", meta: { isFilterOnly: true } ,  size:90,
    cell: ({ getValue }) => getValue() == null ? null : <div>{getValue() as string}</div>, filterFn: "arrIncludesSome" },
];