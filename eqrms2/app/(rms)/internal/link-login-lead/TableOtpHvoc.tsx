"use client";

import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, getSortedRowModel } from "@tanstack/react-table";
import { ReactTableWrapper } from "@/components/data-table/ReactTableWrapper";
import { columnsOtpHvoc } from "./columns-otp-hvoc";
import type { OtpHvocDetail } from "@/types/otp-hvoc-detail";

const searchOtpHvocFilter = (row: { original: OtpHvocDetail }, _columnId: string, filterValue: string) => {
  if (!filterValue?.trim()) return true;
  const term = String(filterValue).toLowerCase();
  const phone = String(row.original.phone_number ?? "").toLowerCase();
  const otpLeadName = String(row.original.otp_lead_name ?? "").toLowerCase();
  const affiliateLeadName = String(row.original.affiliate_lead_name ?? "").toLowerCase();
  return phone.includes(term) || otpLeadName.includes(term) || affiliateLeadName.includes(term);
};

interface TableOtpHvocProps {
  data: OtpHvocDetail[];
}

export function TableOtpHvoc({ data }: TableOtpHvocProps) {
  const table = useReactTable({
    data,
    columns: columnsOtpHvoc,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: searchOtpHvocFilter,
    filterFns: {
      arrIncludesSome: (row, columnId, value) => {
        const cellValue = row.getValue(columnId);
        return value.includes(String(cellValue));
      },
    },
    initialState: {
      pagination: { pageSize: 50 },
      sorting: [{ id: "created_at", desc: true }],
    },
  });

  const filters = [
    { column: "hvoc", title: "HVOC", placeholder: "Filter by HVOC..." },
    { column: "affiliate_lead_name", title: "Affiliate lead name", placeholder: "Filter by affiliate..." },
  ];

  return (
    <ReactTableWrapper
      table={table}
      className="text-xs"
      searchPlaceholder="Search by phone, OTP lead name, affiliate name..."
      filters={filters}
    />
  );
}
