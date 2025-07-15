// eqrms2/app/companies/columns-valscreen.ts
import { ColumnDef } from "@tanstack/react-table";
import { Company } from "@/types/company-detail";
import Link from "next/link";

export const columns: ColumnDef<Company>[] = [
  {
    accessorKey: "ime_name",
    header: () => <div className="text-left">Company</div>,
    cell: ({ row }) => {
      const companyId = row.original.company_id;
      const companyName = row.original.ime_name;

      return (
        <div className="text-left">
          <Link href={`/companies/${companyId}`} className="text-blue-600 font-bold hover:underline">
            {companyName}
          </Link>
        </div>
      );
    },
  },
  { accessorKey: "quality", header: "Quality"},
  { accessorKey: "mt_growth", header: "Growth" },
  { accessorKey: "market_momentum", header: "Momentum" },
  { accessorKey: "upside", header: "Upside", cell: ({ getValue }) => <div className="text-blue-500 font-bold"> {getValue() as string} </div>  },
  { accessorKey: "stock_score", header: "Rating" },
  { accessorKey: "cmp", header: "CMP" },
  { accessorKey: "target_price", header: "TP" },
  { accessorKey: "multiple", header: "Multiple" },
  { accessorKey: "pe_t2", header: "FY27 PE" },
  { accessorKey: "gr_t", header: "FY26 gr", cell: ({ getValue }) => <div className="text-blue-500"> {Number(getValue()).toFixed(0)} </div>  },
  { accessorKey: "gr_t1", header: "FY27 gr", cell: ({ getValue }) => <div className="text-blue-500"> {Number(getValue()).toFixed(0)} </div>  },
  { accessorKey: "gr_t2", header: "FY28 gr", cell: ({ getValue }) => <div className="text-blue-500"> {Number(getValue()).toFixed(0)} </div>  },
  { accessorKey: "gr_t3", header: "FY29 gr", cell: ({ getValue }) => <div className="text-blue-500"> {Number(getValue()).toFixed(0)} </div>  },
  { accessorKey: "gr_t4", header: "FY30 gr", cell: ({ getValue }) => <div className="text-blue-500"> {Number(getValue()).toFixed(0)} </div>  },
  { accessorKey: "1m_return", header: "1m" },
  { accessorKey: "3m_return", header: "3m" },
  { accessorKey: "3yrs_return", header: "3yr" },
  { accessorKey: "5yrs_return", header: "5yr" },
];
