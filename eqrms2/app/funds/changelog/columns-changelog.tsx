import { ColumnDef } from "@tanstack/react-table";  
import { RmsChangelog } from "@/types/rms-changelog-detail";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { EditChangelogButton } from "@/components/forms/EditRmsChangeLog";

export const columns: ColumnDef<RmsChangelog>[] = [
  {
        accessorKey: "created_at",
        header: "Date",
        cell: ({ getValue }) => formatDate(getValue() as Date | string),
  },
  {
    accessorKey: "fund_name",
    header: () => <div className="text-left">Fund</div>,
    cell: ({ row }) => {
      const fundSlug = row.original.fund_slug;
      const fundName = row.original.fund_name;

      return (
        <div className="text-left">
          <Link href={`/funds/${fundSlug}`} className="text-blue-600 font-bold hover:underline">
            {fundName}
          </Link>
        </div>
      );
    }
  },
  {
    accessorKey: "amc_name",
    header: () => <div className="text-left">Fund</div>,
    cell: ({ row }) => {
      const amcSlug = row.original.amc_slug;
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
    accessorKey: "team_discussed",
    header: "Team Discussed"
  },
  {
    accessorKey: "change_type",
    header: "Type",
    cell: ({ row }) => {
      const changeType = row.original.change_type;
      return (
        <div className="text-left">
          {changeType}
        </div>
      );
    }
  },
  {
    accessorKey: "change_desc",
    header: "Description"
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const changelogData = row.original;
      const changelogId = changelogData.id;

      return (
        <EditChangelogButton 
          changelogData={changelogData}
          changelogId={changelogId}
        />
      );
    }
  },
];