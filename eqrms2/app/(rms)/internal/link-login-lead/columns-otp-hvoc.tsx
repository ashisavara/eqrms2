import { ColumnDef } from "@tanstack/react-table";
import type { OtpHvocDetail } from "@/types/otp-hvoc-detail";
import { formatDate } from "@/lib/utils";

export const columnsOtpHvoc: ColumnDef<OtpHvocDetail>[] = [
  {
    accessorKey: "phone_number",
    header: "Phone",
    cell: ({ getValue }) => <span className="whitespace-nowrap">{String(getValue() ?? "")}</span>,
  },
  {
    accessorKey: "created_at",
    header: "Created at",
    cell: ({ getValue }) => formatDate(getValue() as Date | string | null | undefined),
  },
  {
    accessorKey: "otp_lead_name",
    header: "OTP lead name",
    cell: ({ getValue }) => <span className="truncate max-w-[140px] block" title={String(getValue() ?? "")}>{String(getValue() ?? "")}</span>,
  },
  {
    accessorKey: "lead_name",
    header: "In CRM",
    cell: ({ getValue }) => <span className="truncate max-w-[140px] block" title={String(getValue() ?? "")}>{String(getValue() ?? "")}</span>,
  },
  {
    accessorKey: "hvoc",
    header: "HVOC",
    filterFn: "arrIncludesSome",
    cell: ({ getValue }) => String(getValue() ?? ""),
  },
  {
    accessorKey: "affiliate_lead_name",
    header: "Affiliate lead name",
    filterFn: "arrIncludesSome",
    cell: ({ getValue }) => <span className="truncate max-w-[140px] block" title={String(getValue() ?? "")}>{String(getValue() ?? "")}</span>,
  },
  {
    accessorKey: "otp_code",
    header: "OTP code",
    cell: ({ getValue }) => String(getValue() ?? ""),
  },
  {
    accessorKey: "affiliate_ref_meta",
    header: "Affiliate ref meta",
    cell: ({ getValue }) => {
      const v = getValue();
      if (v == null || v === "") return "";
      const str = String(v);
      return <span className="truncate max-w-[180px] block text-xs" title={str}>{str}</span>;
    },
  },
];
