import { ColumnDef } from "@tanstack/react-table";  
import { AMC } from "@/types/amc-detail";
import Link from "next/link";
import { RatingDisplay } from "@/components/conditional-formatting";

export const columns: ColumnDef<AMC>[] = [
  {
    accessorKey: "amc_name",
    header: () => <div className="text-left">AMC</div>,
    cell: ({ row }) => {
      const amcSlug = row.original.slug;
      const amcName = row.original.amc_name;

      return (
        <div className="text-left">
          <Link href={`/amc/${amcSlug}`} className="text-blue-600 font-bold hover:underline">
            {amcName}
          </Link>
        </div>
      );
    }
  },    
  {
    accessorKey: "structure",
    header: "Structure",
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "amc_rating",
    header: "AMC",
    cell: ({ getValue }) => <RatingDisplay rating={getValue() as number} />
  },
  {
    accessorKey: "amc_pedigree_rating",
    header: "Pedigree",
    cell: ({ getValue }) => <RatingDisplay rating={getValue() as number} />
  },
  {
    accessorKey: "amc_team_rating",
    header: "Team",
    cell: ({ getValue }) => <RatingDisplay rating={getValue() as number} />,
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "amc_philosophy_rating",
    header: "Philosophy",
    cell: ({ getValue }) => <RatingDisplay rating={getValue() as number} />
  },
  {
    accessorKey: "amc_size_rating",
    cell: ({ getValue }) => <RatingDisplay rating={getValue() as number} />
  },
  {
    accessorKey: "aum",
    header: "AUM"
  },
  {
    accessorKey: "us_investor_tagging",
    header: "US Investor",
    meta: { isFilterOnly: true },
    filterFn: "arrIncludesSome",
  }
];