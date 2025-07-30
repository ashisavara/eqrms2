import { ColumnDef } from "@tanstack/react-table";  
import Link from "next/link";
import { RatingDisplay } from "@/components/conditional-formatting";
import {Investments} from"@/types/investment-detail";

export const columns: ColumnDef<Investments>[] = [


    { accessorKey: "fund_name", 
    header: "Fund Name",
    size:200,
    cell: ({row}) => {
        // If slug exists, render as link; otherwise render as plain text
        if (row.original.slug) {
            return <div className="text-left"><Link href={`/funds/${row.original.slug}`} className="text-blue-600 font-bold hover:underline">{row.original.fund_name}</Link></div>
        } else {
            return <div className="text-left">{row.original.fund_name}</div>
        }
      }
    },
    { accessorKey: "fund_rating", header: "Fund Rating",size:40,cell: ({ getValue }) => <RatingDisplay rating={getValue() as number} /> },
    { accessorKey: "investor_name", header: "Investor", size: 100, filterFn: "arrIncludesSome", cell: ({ getValue }) => {
        const v = getValue();
        return v && String(v).length > 15 ? String(v).slice(0, 15) + "…" : v;
    }},
    { 
        accessorKey: "pur_amt", 
        header: "Pur Amt",
        size: 50, 
        aggregationFn: 'sum', // ✅ Enable sum aggregation
        cell: ({ getValue }) => getValue() == null ? null : <div className="text-gray-800"> {Number(getValue()).toFixed(1)}</div>,
        aggregatedCell: ({ cell }: { cell: any }) => (
          <div className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded">
            ₹{Number(cell.getValue()).toFixed(1)}
          </div>
        )
    },
    { 
        accessorKey: "cur_amt", 
        header: "Cur Amt",
        size: 50, 
        aggregationFn: 'sum', // ✅ Enable sum aggregation
        cell: ({ getValue }) => getValue() == null ? null : <div className="text-gray-800 font-bold"> {Number(getValue()).toFixed(1)}</div>,
        aggregatedCell: ({ cell }: { cell: any }) => (
          <div className="text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded">
            ₹{Number(cell.getValue()).toFixed(1)}
          </div>
        )
    },
    { 
        accessorKey: "gain_loss", 
        header: "Gain / Loss",
        size: 50, 
        aggregationFn: 'sum', // ✅ Enable sum aggregation
        cell: ({ getValue }) => {
            const value = getValue();
            if (value == null) return null;
            const numValue = Number(value);
            const textColor = numValue >= 0 ? 'text-green-600' : 'text-red-600';
            return <div className={`${textColor}`}> {numValue.toFixed(1)}</div>;
        },
        aggregatedCell: ({ cell }: { cell: any }) => {
            const value = Number(cell.getValue());
            const textColor = value >= 0 ? 'text-green-600' : 'text-red-600';
            const bgColor = value >= 0 ? 'bg-green-50' : 'bg-red-50';
            return (
              <div className={`${textColor} font-bold ${bgColor} px-2 py-1 rounded`}>
                ₹{value.toFixed(1)}
              </div>
            );
        }
    },
    { accessorKey: "abs_ret", header: "Abs Ret (%)",size:50, cell: ({ getValue }) => getValue() == null ? null : <div className="text-blue-500"> {Number(getValue()).toFixed(1)}</div>  },
    { accessorKey: "cagr", header: "CAGR (%)",size:50, cell: ({ getValue }) => getValue() == null ? null : <div className="text-blue-500"> {Number(getValue()).toFixed(1)}</div>  },
    { accessorKey: "cat_long_name", header: "Category",size:80 },
    { accessorKey: "fund_rms_name", header: "Fund RMS Name", meta: { isFilterOnly: true } },
    { accessorKey: "asset_class_name", header: "Asset Class", meta: { isFilterOnly: true }, filterFn: "arrIncludesSome", enableGrouping: true },
    { accessorKey: "cat_name", header: "Category", meta: { isFilterOnly: true }, filterFn: "arrIncludesSome", cell: ({ getValue }) => {
        const v = getValue();
        return v && String(v).length > 12 ? String(v).slice(0, 12) + "…" : v;
    }}, 
    { accessorKey: "structure_name", header: "Structure", meta: { isFilterOnly: true }, filterFn: "arrIncludesSome" },
    { accessorKey: "advisor_name", header: "Structure", meta: { isFilterOnly: true }, filterFn: "arrIncludesSome" },
    { accessorKey: "one_yr", header: "1 yr",size:40, cell: ({ getValue }) => getValue() == null ? null : <div className="text-blue-500"> {Number(getValue()).toFixed(1)}</div>  },
    { accessorKey: "three_yr", header: "3 yr",size:40, cell: ({ getValue }) => getValue() == null ? null : <div className="text-blue-500"> {Number(getValue()).toFixed(1)}</div>  },
    { accessorKey: "five_yr", header: "5 yr",size:40, cell: ({ getValue }) => getValue() == null ? null : <div className="text-blue-500"> {Number(getValue()).toFixed(1)}</div>  },
];