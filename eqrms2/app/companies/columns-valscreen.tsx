// eqrms2/app/companies/columns-valscreen.ts
import { ColumnDef } from "@tanstack/react-table";
import { Company } from "@/types/company-detail";

export const columns: ColumnDef<Company>[] = [
  { accessorKey: "company_id", header: "Company ID" },
  {
    accessorKey: "ime_name",
    header: "Company Name",
    cell: ({ row }) => {
      const companyId = row.original.company_id ?? row.original.id; // Ensure these fields exist in your Company type
      const companyName = row.original.ime_name;

      return (
        <a href={`/companies/${companyId}`} className="text-blue-600 hover:underline">
          {companyName}
        </a>
      );
    },
  },
  { accessorKey: "sector_id", header: "Sector ID" },
  { accessorKey: "industry", header: "Industry" },
];
