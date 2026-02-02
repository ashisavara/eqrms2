import { ColumnDef } from "@tanstack/react-table";  
import { blogDetail } from "@/types/blog-detail";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export const columns: ColumnDef<blogDetail>[] = [
  {
    accessorKey: "title",
    header: "Recommendations",
    size: 300,
    cell: ({ row }) => {
      const title = row.original.title;
      const slug = row.original.slug;
      return title ? (
        <div className="text-left">
          <Link 
            href={`/recommendations/${slug}`}
            className="blue-hyperlink"
          >
            {title}
          </Link>
        </div>
      ) : null;
    }
  },
];

