import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";

// Define the shape of a Fund object with its properties.
export type Company = {
  id: string;    
  ime_name: string; 
  sector_id: number;
  industry: string;
  coverage: string;
};

// Define the columns configuration for the funds data table.
// Each object in the array represents a column in the table.
export const columns: ColumnDef<Company>[] = [
  {accessorKey: "id", header: "id"},
  {accessorKey: "ime_name",header: "Company"},
  { accessorKey: "sector_id", header: "Sector" },
  { accessorKey: "industry", header: "Industry" },
  { accessorKey: "coverage", header: "Coverage" },
]; 