import { ColumnDef } from "@tanstack/react-table";  
import { InvQueryDetail } from "@/types/inv-query-detail";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export const columns: ColumnDef<InvQueryDetail>[] = [
  {
    accessorKey: "title",
    header: "Title",
    size: 300,
    cell: ({ row }) => {
      const title = row.original.title;
      const queryId = row.original.query_id;
      return title ? (
        <div className="text-left">
          <Link 
            href={`/internal/public-site/investment-query/${queryId}`}
            className="blue-hyperlink"
          >
            {title}
          </Link>
        </div>
      ) : null;
    }
  },
  {
    accessorKey: "query_categories",
    header: "Query Category",
    size: 150,
    filterFn: "arrIncludesSome",
    cell: ({ getValue }) => {
      const category = getValue() as string;
      return category ? <div>{category}</div> : null;
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
      const queryId = row.original.query_id;
      return (
        <Link 
          href={`/internal/public-site/investment-query/edit/${queryId}`}
          className="text-blue-600 hover:text-blue-800 font-bold hover:underline"
        >
          Edit
        </Link>
      );
    }
  }
];

