import { ColumnDef } from "@tanstack/react-table";  
import { blogDetail } from "@/types/blog-detail";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export const columns: ColumnDef<blogDetail>[] = [
  {
    accessorKey: "title",
    header: "Title",
    size: 300,
    cell: ({ row }) => {
      const title = row.original.title;
      const blogId = row.original.id;
      return title ? (
        <div className="text-left">
          <Link 
            href={`/internal/public-site/blog/${blogId}`}
            className="blue-hyperlink"
          >
            {title}
          </Link>
        </div>
      ) : null;
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 120,
    filterFn: "arrIncludesSome",
    cell: ({ getValue }) => {
      const status = getValue() as string;
      return status ? <div>{status}</div> : null;
    }
  },
  {
    accessorKey: "category",
    header: "Category",
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
      const blogId = row.original.id;
      return (
        <Link 
          href={`/internal/public-site/blog/edit/${blogId}`}
          className="text-blue-600 hover:text-blue-800 font-bold hover:underline"
        >
          Edit
        </Link>
      );
    }
  }
];

