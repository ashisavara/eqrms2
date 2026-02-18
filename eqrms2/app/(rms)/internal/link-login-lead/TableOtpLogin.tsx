"use client";

import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, getSortedRowModel } from "@tanstack/react-table";
import { ReactTableWrapper } from "@/components/data-table/ReactTableWrapper";
import { columnsOtpLogin } from "./columns-otp-login";
import type { OtpLoginDetail } from "@/types/otp-login-detail";

const searchOtpLoginFilter = (row: { original: OtpLoginDetail }, _columnId: string, filterValue: string) => {
  if (!filterValue?.trim()) return true;
  const term = String(filterValue).toLowerCase();
  const phone = String(row.original.phone_number ?? "").toLowerCase();
  const otpCode = String(row.original.otp_code ?? "").toLowerCase();
  return phone.includes(term) || otpCode.includes(term);
};

interface TableOtpLoginProps {
  data: OtpLoginDetail[];
}

export function TableOtpLogin({ data }: TableOtpLoginProps) {
  const table = useReactTable({
    data,
    columns: columnsOtpLogin,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: searchOtpLoginFilter,
    initialState: {
      pagination: { pageSize: 50 },
      sorting: [{ id: "created_at", desc: true }],
    },
  });

  return (
    <ReactTableWrapper
      table={table}
      className="text-xs"
      searchPlaceholder="Search by phone or OTP code..."
    />
  );
}
