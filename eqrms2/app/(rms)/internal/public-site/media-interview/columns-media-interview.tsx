import { ColumnDef } from "@tanstack/react-table";  
import { MediaInterviewDetail } from "@/types/media-interview-detail";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export const columns: ColumnDef<MediaInterviewDetail>[] = [
  {
    accessorKey: "title",
    header: "Title",
    size: 300,
    cell: ({ row }) => {
      const title = row.original.title;
      const interviewId = row.original.interview_id;
      return title ? (
        <div className="text-left">
          <Link 
            href={`/internal/public-site/media-interview/${interviewId}`}
            className="blue-hyperlink"
          >
            {title}
          </Link>
        </div>
      ) : null;
    }
  },
  {
    accessorKey: "publication",
    header: "Publication",
    size: 150,
    filterFn: "arrIncludesSome",
    cell: ({ getValue }) => {
      const publication = getValue() as string;
      return publication ? <div>{publication}</div> : null;
    }
  },
  {
    accessorKey: "publication_date",
    header: "Publication Date",
    size: 120,
    cell: ({ getValue }) => {
      const date = getValue() as Date | string | null;
      return date ? <div>{formatDate(date)}</div> : null;
    }
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    size: 120,
    cell: ({ getValue }) => {
      const date = getValue() as Date | string | null;
      return date ? <div>{formatDate(date)}</div> : null;
    }
  },
  {
    id: "edit",
    header: "Edit",
    size: 80,
    cell: ({ row }) => {
      const interviewId = row.original.interview_id;
      return (
        <Link 
          href={`/internal/public-site/media-interview/edit/${interviewId}`}
          className="text-blue-600 hover:text-blue-800 font-bold hover:underline"
        >
          Edit
        </Link>
      );
    }
  }
];

