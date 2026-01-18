"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AcademyWhitepaperDetail } from "@/types/academy-whitepaper-detail";
import { WhitepaperDetailSheet } from "./WhitepaperDetailSheet";
import { EditAcademyWhitepaperButton } from "@/components/forms/EditAcademyWhitepaper";
import { formatDate } from "@/lib/utils";

export function getWhitepaperColumns(canEdit: boolean): ColumnDef<AcademyWhitepaperDetail>[] {
  return [
    {
      accessorKey: "whitepaper_name",
      header: "Whitepaper Name",
      size: 250,
      cell: ({ getValue, row }) => {
        const whitepaperName = getValue() as string;
        const whitepaperData = row.original;
        return whitepaperName == null ? null : (
          <>
            <WhitepaperDetailSheet whitepaper={whitepaperData} trigger={<span>{whitepaperName}</span>} />
            {canEdit && <EditAcademyWhitepaperButton whitepaperData={whitepaperData} whitepaperId={whitepaperData.whitepaper_id} />}
          </>
        );
      }
    },
    {
      accessorKey: "whitepaper_date",
      header: "Date",
      size: 120,
      cell: ({ getValue }) => {
        const date = getValue() as string;
        return date ? formatDate(date) : null;
      }
    },
    {
      accessorKey: "whitepaper_summary",
      header: "Summary",
      size: 300,
      cell: ({ getValue }) => getValue() as string
    }
  ];
}
