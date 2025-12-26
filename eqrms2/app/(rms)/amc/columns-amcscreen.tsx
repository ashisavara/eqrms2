import { ColumnDef } from "@tanstack/react-table";  
import { AMC } from "@/types/amc-detail";
import Link from "next/link";
import { RatingDisplay, RatingDisplayWithStar } from "@/components/conditional-formatting";
import { isMobileView } from "@/lib/hooks/useResponsiveColumns";
import SimpleTable from "@/components/tables/singleRowTable";
import { UpgradeIcon } from "@/components/uiComponents/upgrade-icon";
import { can } from "@/lib/permissions";

// Create columns with permission-based rendering
// Permission is checked ONCE when columns are created, not per cell
export const createColumns = (userRoles: string[] | null): ColumnDef<AMC>[] => {
  // ✅ Check permission ONCE at the top
  const hasDetailedAccess = can(userRoles, 'rms', 'view_detailed');

  return [
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
              body={[
                { value: hasDetailedAccess ? <RatingDisplay rating={row.original.amc_rating} /> : <UpgradeIcon clickThroughPath="create-account" text="" /> }, 
                { value: hasDetailedAccess ? <RatingDisplay rating={row.original.amc_pedigree_rating} /> : <UpgradeIcon clickThroughPath="create-account" text="" /> }, 
                { value: hasDetailedAccess ? <RatingDisplay rating={row.original.amc_team_rating} /> : <UpgradeIcon clickThroughPath="create-account" text="" /> }, 
                { value: hasDetailedAccess ? <RatingDisplay rating={row.original.amc_philosophy_rating} /> : <UpgradeIcon clickThroughPath="create-account" text="" /> }
              ]}
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
    filterFn: "arrIncludesSome",
    cell: ({ getValue }) => 
      hasDetailedAccess 
        ? <RatingDisplayWithStar rating={getValue() as number} />
        : <UpgradeIcon clickThroughPath="create-account" text="" />
  },
  {
    accessorKey: "amc_pedigree_rating",
    header: "Pedigree",
    size: 100,
    cell: ({ getValue }) => 
      hasDetailedAccess 
        ? <RatingDisplay rating={getValue() as number} />
        : <UpgradeIcon clickThroughPath="create-account" text="" />
  },
  {
    accessorKey: "amc_team_rating",
    header: "Team",
    size: 100,
    cell: ({ getValue }) => 
      hasDetailedAccess 
        ? <RatingDisplay rating={getValue() as number} />
        : <UpgradeIcon clickThroughPath="create-account" text="" />,
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "amc_philosophy_rating",
    header: "Philosophy",
    size: 100,
    cell: ({ getValue }) => 
      hasDetailedAccess 
        ? <RatingDisplay rating={getValue() as number} />
        : <UpgradeIcon clickThroughPath="create-account" text="" />
  },
  {
    accessorKey: "amc_size_rating",
    header: "Size",
    size: 100,
    cell: ({ getValue }) => 
      hasDetailedAccess 
        ? <RatingDisplay rating={getValue() as number} />
        : <UpgradeIcon clickThroughPath="create-account" text="" />
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
};