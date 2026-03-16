import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { GroupInvestorDetail } from "@/types/group-investor-detail";
import { CircleCheckBig } from "lucide-react";

export const columns: ColumnDef<GroupInvestorDetail>[] = [
  {
    accessorKey: "investor_name",
    header: "Investor",
    size: 180,
    cell: ({ row }) => {
      const value = row.original.investor_name;
      if (!value) return null;
      return (
        <div className="text-left">
          <Link
            href={`/kyc/${row.original.investor_id}`}
            className="font-semibold text-blue-900 hover:underline"
          >
            {value}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "investor_type",
    header: "Type",
    size: 90,
    cell: ({ getValue }) => {
      const value = getValue() as string | null;
      if (!value) return null;
      return <div className="text-xs text-gray-800 font-semibold">{value}</div>;
    },
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "mf_ready",
    header: "MF",
    size: 60,
    cell: ({ getValue }) => {
      const value = getValue() as boolean | null;
      return value
        ? (
          <div className="text-center">
            <CircleCheckBig className="h-4 w-4 text-green-800 bg-green-100 rounded-md mx-auto" />
          </div>
        )
        : null;
    },
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "pms_ready",
    header: "PMS",
    size: 60,
    cell: ({ getValue }) => {
      const value = getValue() as boolean | null;
      return value
        ? (
          <div className="text-center">
            <CircleCheckBig className="h-4 w-4 text-green-800 bg-green-100 rounded-md mx-auto" />
          </div>
        )
        : null;
    },
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "kristal_ready",
    header: "Kristal",
    size: 70,
    cell: ({ getValue }) => {
      const value = getValue() as boolean | null;
      return value
        ? (
          <div className="text-center">
            <CircleCheckBig className="h-4 w-4 text-green-800 bg-green-100 rounded-md mx-auto" />
          </div>
        )
        : null;
    },
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "client_name_pan",
    header: "Client (PAN)",
    size: 160,
    cell: ({ getValue }) => {
      const value = getValue() as string | null;
      if (!value) return null;
      return <div className="text-xs text-left">{value}</div>;
    },
  },
  {
    accessorKey: "pan_number",
    header: "PAN",
    size: 120,
    cell: ({ getValue }) => {
      const value = getValue() as string | null;
      if (!value) return null;
      return <div className="font-mono text-xs">{value}</div>;
    },
  },
  {
    accessorKey: "reg_email",
    header: "Email",
    size: 200,
    cell: ({ getValue }) => {
      const value = getValue() as string | null;
      if (!value) return null;
      return <div className="truncate text-xs" title={value}>{value}</div>;
    },
  },
  {
    accessorKey: "phone_number",
    header: "Phone",
    size: 130,
    cell: ({ getValue }) => {
      const value = getValue() as string | null;
      if (!value) return null;
      return <div className="text-xs">{value}</div>;
    },
  },
];

