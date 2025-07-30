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
    { accessorKey: "fund_rating", header: "Fund Rating",size:60,cell: ({ getValue }) => <RatingDisplay rating={getValue() as number} /> },
    { accessorKey: "investor_name", header: "Investor", size: 100, filterFn: "arrIncludesSome", cell: ({ getValue }) => {
        const v = getValue();
        return v && String(v).length > 15 ? String(v).slice(0, 15) + "…" : v;
    }},
    { accessorKey: "pur_amt", header: "Pur Amt",size:50, cell: ({ getValue }) => getValue() == null ? null : <div className="text-gray-800"> {Number(getValue()).toFixed(1)}</div> },
    { accessorKey: "cur_amt", header: "Cur Amt",size:50, cell: ({ getValue }) => getValue() == null ? null : <div className="text-gray-800 font-bold"> {Number(getValue()).toFixed(1)}</div>  },
    { accessorKey: "gain_loss", header: "Gain / Loss",size:50, cell: ({ getValue }) => getValue() == null ? null : <div className="text-gray-800"> {Number(getValue()).toFixed(1)}</div>  },
    { accessorKey: "abs_ret", header: "Abs Ret (%)",size:40, cell: ({ getValue }) => getValue() == null ? null : <div className="text-blue-500"> {Number(getValue()).toFixed(1)}</div>  },
    { accessorKey: "cagr", header: "CAGR (%)",size:40, cell: ({ getValue }) => getValue() == null ? null : <div className="text-blue-500"> {Number(getValue()).toFixed(1)}</div>  },
    { accessorKey: "cat_long_name", header: "Category",size:80 },
    { accessorKey: "fund_rms_name", header: "Fund RMS Name", meta: { isFilterOnly: true } },
    { accessorKey: "asset_class_name", header: "Asset Class", meta: { isFilterOnly: true }, filterFn: "arrIncludesSome" },
    { accessorKey: "cat_name", header: "Category", meta: { isFilterOnly: true }, filterFn: "arrIncludesSome", cell: ({ getValue }) => {
        const v = getValue();
        return v && String(v).length > 15 ? String(v).slice(0, 15) + "…" : v;
    }}, 
    { accessorKey: "structure_name", header: "Structure", meta: { isFilterOnly: true }, filterFn: "arrIncludesSome" },
    { accessorKey: "advisor_name", header: "Structure", meta: { isFilterOnly: true }, filterFn: "arrIncludesSome" },
    { accessorKey: "one_yr", header: "1 yr",size:40, cell: ({ getValue }) => getValue() == null ? null : <div className="text-blue-500"> {Number(getValue()).toFixed(1)}</div>  },
    { accessorKey: "three_yr", header: "3 yr",size:40, cell: ({ getValue }) => getValue() == null ? null : <div className="text-blue-500"> {Number(getValue()).toFixed(1)}</div>  },
    { accessorKey: "five_yr", header: "5 yr",size:40, cell: ({ getValue }) => getValue() == null ? null : <div className="text-blue-500"> {Number(getValue()).toFixed(1)}</div>  },
];