import { ColumnDef } from "@tanstack/react-table";  
import { AMC } from "@/types/amc-detail";
import Link from "next/link";
import { RatingDisplay } from "@/components/conditional-formatting";
import { isMobileView } from "@/lib/hooks/useResponsiveColumns";
import SimpleTable from "@/components/tables/singleRowTable";

export const columns: ColumnDef<AMC>[] = [
  {
    accessorKey: "amc_name",
    header: () => <div className="text-left hidden md:block">AMC</div>,
    size: 300,
    cell: ({ row, table }) => {
      const amcSlug = row.original.slug;
      const amcName = row.original.amc_name;

      if (isMobileView(table)) {
        // Mobile view - show as card
        return (
          <div className="mobile-card">
            <div className="flex flex-row gap-4 justify-between font-semibold text-left">
              <Link href={`/amc/${amcSlug}`} className="text-blue-600 font-bold text-sm">
                {amcName}
              </Link>
              {row.original.structure }
            </div>
            <SimpleTable 
              headers={[{ label: "Rating" }, { label: "Pedigree" }, { label: "Team" }, { label: "Philosophy" }]}
              body={[{ value: <RatingDisplay rating={row.original.amc_rating} /> }, { value: <RatingDisplay rating={row.original.amc_pedigree_rating} /> }, { value: <RatingDisplay rating={row.original.amc_team_rating} /> }, { value: <RatingDisplay rating={row.original.amc_philosophy_rating} /> }]}
            />
          </div>
        );
      } else {
        // Desktop view - show as normal table cell
        return (
          <div className="text-left">
            <Link href={`/amc/${amcSlug}`} className="text-blue-600 font-bold hover:underline">
              {amcName}
            </Link>
          </div>
        );
      }
    }
  },    
  {
    accessorKey: "structure",
    header: "Structure",
    size: 150,
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "amc_rating",
    header: "AMC",
    size: 100,
    cell: ({ getValue }) => <RatingDisplay rating={getValue() as number} />
  },
  {
    accessorKey: "amc_pedigree_rating",
    header: "Pedigree",
    size: 100,
    cell: ({ getValue }) => <RatingDisplay rating={getValue() as number} />
  },
  {
    accessorKey: "amc_team_rating",
    header: "Team",
    size: 100,
    cell: ({ getValue }) => <RatingDisplay rating={getValue() as number} />,
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "amc_philosophy_rating",
    header: "Philosophy",
    size: 100,
    cell: ({ getValue }) => <RatingDisplay rating={getValue() as number} />
  },
  {
    accessorKey: "amc_size_rating",
    header: "Size",
    size: 100,
    cell: ({ getValue }) => <RatingDisplay rating={getValue() as number} />
  },
  {
    accessorKey: "aum",
    header: "AUM",
    size: 150,
  },
  {
    accessorKey: "us_investor_tagging",
    header: "US Investor",
    meta: { isFilterOnly: true },
    filterFn: "arrIncludesSome",
  }
];