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
    }
  },
  { 
    accessorKey: "sector_name", 
    header: "Sector",
    filterFn: "arrIncludesSome",
    // Hidden filter-only column
    meta: { isFilterOnly: true }
  },
  { 
    accessorKey: "industry", 
    header: "Industry",
    filterFn: "arrIncludesSome",
    // Hidden filter-only column  
    meta: { isFilterOnly: true }
  },
  { 
    accessorKey: "quality", 
    header: "Quality",
    filterFn: "arrIncludesSome"
  },
  { 
    accessorKey: "mt_growth", 
    header: "Growth",
    filterFn: "arrIncludesSome",
    enableSorting: true,
    sortingFn: "text"
  },
  { 
    accessorKey: "market_momentum", 
    header: "Momentum",
    filterFn: "arrIncludesSome",
    enableSorting: true,
    sortingFn: "text"
  },
  { 
    accessorKey: "upside", 
    header: "Upside", 
    cell: ({ getValue }) => <div className="text-blue-500 font-bold"> {getValue() as string} </div>
  },
  { 
    accessorKey: "stock_score", 
    header: "Rating",
    enableSorting: true,
    sortingFn: "basic"
  },
  { 
    accessorKey: "cmp", 
    header: "CMP",
    enableSorting: true,
    sortingFn: "basic"
  },
  { 
    accessorKey: "target_price", 
    header: "TP",
    enableSorting: true,
    sortingFn: "basic"
  },
  { 
    accessorKey: "multiple", 
    header: "Multiple",
    enableSorting: true,
    sortingFn: "basic"
  },
  { 
    accessorKey: "pe_t2", 
    header: "FY27 PE",
    enableSorting: true,
    sortingFn: "basic"
  },
  { 
    accessorKey: "gr_t", 
    header: "FY26 gr", 
    cell: ({ getValue }) => <div className="text-blue-500"> {Number(getValue()).toFixed(0)} </div>,
    enableSorting: true,
    sortingFn: "basic"
  },
  { 
    accessorKey: "gr_t1", 
    header: "FY27 gr", 
    cell: ({ getValue }) => <div className="text-blue-500"> {Number(getValue()).toFixed(0)} </div>,
    enableSorting: true,
    sortingFn: "basic"
  },
  { 
    accessorKey: "gr_t2", 
    header: "FY28 gr", 
    cell: ({ getValue }) => <div className="text-blue-500"> {Number(getValue()).toFixed(0)} </div>,
    enableSorting: true,
    sortingFn: "basic"
  },
  { 
    accessorKey: "gr_t3", 
    header: "FY29 gr", 
    cell: ({ getValue }) => <div className="text-blue-500"> {Number(getValue()).toFixed(0)} </div>,
    enableSorting: true,
    sortingFn: "basic"
  },
  { 
    accessorKey: "gr_t4", 
    header: "FY30 gr", 
    cell: ({ getValue }) => <div className="text-blue-500"> {Number(getValue()).toFixed(0)} </div>,
    enableSorting: true,
    sortingFn: "basic"
  },
  { 
    accessorKey: "1m_return", 
    header: "1m",
    enableSorting: true,
    sortingFn: "basic"
  },
  { 
    accessorKey: "3m_return", 
    header: "3m",
    enableSorting: true,
    sortingFn: "basic"
  },
  { 
    accessorKey: "1yr_return", 
    header: "1yr",
    enableSorting: true,
    sortingFn: "basic"
  },
  { 
    accessorKey: "3yrs_return", 
    header: "3yr",
    enableSorting: true,
    sortingFn: "basic"
  },
  { 
    accessorKey: "5yrs_return", 
    header: "5yr",
    enableSorting: true,
    sortingFn: "basic"
  },
];
