import { ColumnDef } from "@tanstack/react-table";
import { CallsDetail } from "@/types/calls-detail";
import Link from "next/link";

export const createColumns = (): ColumnDef<CallsDetail>[] => [
  {
    accessorKey: "candidate_name",
    header: "Name",
    size: 180,
    cell: ({ row }) => {
      const name = row.original.candidate_name ?? "-";
      const leadId = row.original.lead_id;
      if (leadId != null) {
        return (
          <Link href={`/crm/${leadId}`} className="blue-hyperlink">
            {name}
          </Link>
        );
      }
      return name;
    },
  },
  {
    accessorKey: "candidate_number",
    header: "Phone",
    size: 140,
    cell: ({ row }) => (
      <a href={`tel:${row.original.candidate_number}`} className="blue-hyperlink">
        {row.original.candidate_number}
      </a>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 120,
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "call_start_time",
    header: "Call Time",
    size: 160,
    cell: ({ row }) => {
      const val = row.original.call_start_time;
      if (!val) return "-";
      const d = new Date(val);
      const dateStr = `${d.getDate()}-${d.toLocaleString('en', { month: 'short' })}`;
      const timeStr = d.toTimeString().slice(0, 8);
      return `${dateStr} ${timeStr}`;
    },
  },
  {
    accessorKey: "call_duration",
    header: "Duration (min)",
    size: 100,
    cell: ({ row }) => {
      const val = row.original.call_duration;
      return val != null ? Number(val).toFixed(2) : "-";
    },
  },
  {
    accessorKey: "recording_url",
    header: "Recording",
    size: 80,
    cell: ({ row }) => {
      const url = row.original.recording_url;
      if (!url) return "-";
      return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="blue-hyperlink text-xs">
          Listen
        </a>
      );
    },
  },
  {
    accessorKey: "link",
    header: "Link",
    size: 80,
    cell: ({ row }) => {
      const url = row.original.link;
      if (!url) return "-";
      return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="blue-hyperlink text-xs">
          View
        </a>
      );
    },
  },
];
