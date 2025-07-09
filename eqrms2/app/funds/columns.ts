import { ColumnDef } from "@tanstack/react-table";

// Define the shape of a Fund object with its properties.
export type Fund = {
  fund_id: string;    // Unique identifier for the fund
  fund_name: string;  // Name of the fund
  fund_rating: number;
  one_yr: number;
  three_yr: number;
  five_year: number;
  open_for_subscription: string;
};

// Define the columns configuration for the funds data table.
// Each object in the array represents a column in the table.
export const columns: ColumnDef<Fund>[] = [
    { accessorKey: "fund_id", header: "Fund ID" },
    { accessorKey: "fund_name", header: "Fund Name" },
    { accessorKey: "fund_rating", header: "Rating" },
    { accessorKey: "one_yr", header: "1 yr" },
    { accessorKey: "three_yr", header: "3 yr" },
    { accessorKey: "five_year", header: "5 yr" },
    { accessorKey: "open_for_subscription", header: "Open for Subs" },
  ];
