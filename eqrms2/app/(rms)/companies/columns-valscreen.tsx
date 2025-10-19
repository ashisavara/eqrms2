// eqrms2/app/companies/columns-valscreen.ts
import { ColumnDef } from "@tanstack/react-table";
import { Company } from "@/types/company-detail";
import Link from "next/link";
import { CompQualityRating, RatingDisplay, NumberRating, ComGrowthNumberRating } from "@/components/conditional-formatting";
import { isMobileView } from "@/lib/hooks/useResponsiveColumns";

export const columns: ColumnDef<Company>[] = [
  {
    accessorKey: "ime_name",
    header: () => <div className="text-left">Company</div>,
    cell: ({ row, table }) => {
      const companyId = row.original.company_id;
      const companyName = row.original.ime_name;

      if (isMobileView(table)) {
        // Mobile view - show as card
        return (
          <div className="p-3 border rounded-lg space-y-2">
            <div className="font-semibold text-left">
              <Link href={`/companies/${companyId}`} className="text-blue-600 font-bold">
                {companyName}
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>Rating: <RatingDisplay rating={row.original.stock_score} /></div>
              <div>Upside: <NumberRating rating={row.original.upside} /></div>
              <div>Quality: <CompQualityRating rating={row.original.quality} /></div>
              <div>Growth: <CompQualityRating rating={row.original.mt_growth} /></div>
              <div className="col-span-2">Momentum: <CompQualityRating rating={row.original.market_momentum} /></div>
            </div>
          </div>
        );
      } else {
        // Desktop view - show as normal table cell
        return (
          <div className="text-left">
            <Link href={`/companies/${companyId}`} className="text-blue-600 font-bold hover:underline">
              {companyName}
            </Link>
          </div>
        );
      }
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
    accessorKey: "stock_score", 
    header: "Rating",
    cell : ({ getValue }) => <RatingDisplay rating={getValue() as number} />
  },
  { 
    accessorKey: "upside", 
    header: "Upside", 
    cell: ({ getValue }) => <NumberRating rating={getValue() as number} />
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
    filterFn: "arrIncludesSome",
    cell : ({ getValue }) => <CompQualityRating rating={getValue() as string} />
  },
  { 
    accessorKey: "mt_growth", 
    header: "Growth",
    filterFn: "arrIncludesSome",
    cell : ({ getValue }) => <CompQualityRating rating={getValue() as string} />
  },
  { 
    accessorKey: "market_momentum", 
    header: "Momentum",
    filterFn: "arrIncludesSome",
    cell : ({ getValue }) => <CompQualityRating rating={getValue() as string} />
  },
  { 
    accessorKey: "cmp", 
    header: "CMP"
  },
  { 
    accessorKey: "target_price", 
    header: "TP"
  },
  { 
    accessorKey: "pe_t2", 
    header: "27 PE",
    cell: ({ getValue }) => <div className="font-bold text-blue-500"> {Number(getValue()).toFixed(1)} </div>
  },
  { 
    accessorKey: "pe_t4", 
    header: "29 PE", 
    cell: ({ getValue }) => <div className="text-grey-600"> {Number(getValue()).toFixed(1)} </div>
  },
  { 
    accessorKey: "multiple", 
    header: "TP PE",
    cell: ({ getValue }) => <div className="font-bold text-blue-500"> {Number(getValue()).toFixed(1)}  </div>
  },
  { 
    accessorKey: "gr_t1", 
    header: "26gr", 
    cell: ({ getValue }) => getValue() == null ? null : <ComGrowthNumberRating rating={Math.round(Number(getValue()))}/>
  },
  { 
    accessorKey: "gr_t2", 
    header: "27gr", 
    cell: ({ getValue }) => getValue() == null ? null : <ComGrowthNumberRating rating={Math.round(Number(getValue()))}/>
  },
  { 
    accessorKey: "1m_return", 
    header: "1 m ", 
    cell: ({ getValue }) => getValue() == null ? null : <ComGrowthNumberRating rating={Math.round(Number(getValue()))}/>
  },
  { 
    accessorKey: "3m_return", 
    header: "3 m "
  },
  { 
    accessorKey: "1yr_return", 
    header: "1 yr ", 
    cell: ({ getValue }) => getValue() == null ? null : <ComGrowthNumberRating rating={Math.round(Number(getValue()))}/>
  },
  { 
    accessorKey: "3yrs_return", 
    header: "3 yr ", 
    cell: ({ getValue }) => getValue() == null ? null : <ComGrowthNumberRating rating={Math.round(Number(getValue()))}/>
  },
  { 
    accessorKey: "5yrs_return", 
    header: "5 yr ", 
    cell: ({ getValue }) => getValue() == null ? null : <ComGrowthNumberRating rating={Math.round(Number(getValue()))}/>
  },
  { 
    accessorKey: "coverage", 
    header: "Coverage ", 
    meta: { isFilterOnly: true }
  },
];
