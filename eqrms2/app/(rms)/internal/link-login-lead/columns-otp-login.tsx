import { ColumnDef } from "@tanstack/react-table";
import type { OtpLoginDetail } from "@/types/otp-login-detail";
import { formatDatetime } from "@/lib/utils";

export const columnsOtpLogin: ColumnDef<OtpLoginDetail>[] = [
  {
    accessorKey: "phone_number",
    header: "Phone",
    cell: ({ getValue }) => <span className="whitespace-nowrap">{String(getValue() ?? "")}</span>,
  },
  {
    accessorKey: "otp_code",
    header: "OTP code",
    cell: ({ getValue }) => String(getValue() ?? ""),
  },
  {
    accessorKey: "created_at",
    header: "Created at",
    cell: ({ getValue }) => formatDatetime(getValue() as Date | string | null | undefined),
  },
  {
    accessorKey: "used",
    header: "Used",
    cell: ({ getValue }) => (getValue() ? "Yes" : "No"),
  },
];
