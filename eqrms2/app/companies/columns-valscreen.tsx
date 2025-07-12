"use client";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";

// Define the shape of a Fund object with its properties.
export type Company = {
  company_id: string;    
  ime_name: string; 
  sector_id: number;
  industry: string;
  coverage: string;
};

// Define the columns configuration for the funds data table.
// Each object in the array represents a column in the table.
export const columns: ColumnDef<Company>[] = [
  {accessorKey: "company_id", header: "Company Id"},
  {
    accessorKey: "ime_name",
    header: "Company",
    cell: ({ row }) => {
      const companyName = row.getValue("ime_name") as string;
      const company_id = row.original.company_id; // Renamed to match the data model
      
      return (
        <Link 
          href={`/companies/${company_id}`} // Updated to use company_id
          className="text-blue-600 underline hover:text-blue-800"
        >
          {companyName}
        </Link>
      );
    },
  },
  { accessorKey: "sector_id", header: "Sector" },
  { accessorKey: "industry", header: "Industry" },
  { accessorKey: "coverage", header: "Coverage" },
]; 