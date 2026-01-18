"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AcademyWebinarDetail } from "@/types/academy-webinar-detail";
import { WebinarDetailSheet } from "./WebinarDetailSheet";
import { EditAcademyWebinarButton } from "@/components/forms/EditAcademyWebinar";
import { formatDate } from "@/lib/utils";

export function getWebinarColumns(canEdit: boolean): ColumnDef<AcademyWebinarDetail>[] {
  return [
    {
      accessorKey: "webinar_name",
      header: "Webinar Name",
      size: 250,
      cell: ({ getValue, row }) => {
        const webinarName = getValue() as string;
        const webinarData = row.original;
        return webinarName == null ? null : (
          <>
            <WebinarDetailSheet webinar={webinarData} trigger={<span>{webinarName}</span>} />
            {canEdit && <EditAcademyWebinarButton webinarData={webinarData} webinarId={webinarData.webinar_id} />}
          </>
        );
      }
    },
    {
      accessorKey: "webinar_date",
      header: "Date",
      size: 120,
      cell: ({ getValue }) => {
        const date = getValue() as string;
        return date ? formatDate(date) : null;
      }
    },
    {
      accessorKey: "webinar_summary",
      header: "Summary",
      size: 300,
      cell: ({ getValue }) => getValue() as string
    }
  ];
}
