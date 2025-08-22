import { ColumnDef } from "@tanstack/react-table";  
import Link from "next/link";
import { RatingDisplay } from "@/components/conditional-formatting";
import {Investments} from"@/types/investment-detail";
import { isMobileView } from "@/lib/hooks/useResponsiveColumns";
import { EditHeldAwayAssetsButton } from "@/components/forms/EditHeldAway";

export const columns: ColumnDef<Investments>[] = [


    { accessorKey: "fund_name", 
    header: "Fund Name",
    size:200,
    cell: ({row, table}) => {
        if (isMobileView(table)) {
            // Mobile view - show as card
            return (
                <div className="p-3 border rounded-lg space-y-2">
                    <div className="font-semibold text-left">
                        {row.original.slug ? (
                            <Link href={`/funds/${row.original.slug}`} className="text-blue-600 font-bold">
                                {row.original.fund_name}
                            </Link>
                        ) : (
                            row.original.fund_name
                        )}
                    </div>
                    <div className="text-sm text-gray-600">{row.original.investor_name}</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>Rating: <RatingDisplay rating={row.original.fund_rating} /></div>
                        <div>Purchase: {row.original.pur_amt?.toFixed(1)}</div>
                        <div>Current: {row.original.cur_amt?.toFixed(1)}</div>
                        <div className={row.original.gain_loss >= 0 ? 'text-green-600' : 'text-red-600'}>
                            Gain/Loss: {row.original.gain_loss?.toFixed(1)}
                        </div>
                    </div>
                </div>
            );
        } else {
            // Desktop view - show as normal table cell
            if (row.original.slug) {
                return <div className="text-left"><Link href={`/funds/${row.original.slug}`} className="blue-hyperlink">{row.original.fund_name}</Link> | <EditHeldAwayAssetsButton investmentData={row.original} investmentId={row.original.investment_id} /></div>
            } else {
                return <div className="text-left">{row.original.fund_name} | <EditHeldAwayAssetsButton investmentData={row.original} investmentId={row.original.investment_id} /></div>
            }
        }
    }
    },
    { accessorKey: "fund_rating", header: "Fund Rating", size:40, cell: ({ getValue }) => <RatingDisplay rating={getValue() as number} /> },
    { accessorKey: "investor_name", header: "Investor", size: 100, filterFn: "arrIncludesSome", cell: ({ getValue }) => {
        const v = getValue();
        return v && String(v).length > 15 ? String(v).slice(0, 15) + "…" : v;
    }},
    { 
        accessorKey: "pur_amt", 
        header: "Pur Amt",
        size: 50, 
        cell: ({ getValue }) => getValue() == null ? null : <div className="text-gray-800"> {Number(getValue()).toFixed(1)}</div>,
        aggregationFn: 'sum', // ✅ Enable sum aggregation
    },
    { 
        accessorKey: "cur_amt", 
        header: "Cur Amt",
        size: 50, 
        aggregationFn: 'sum', // ✅ Enable sum aggregation
        cell: ({ getValue }) => getValue() == null ? null : <div className="text-gray-800 font-bold"> {Number(getValue()).toFixed(1)}</div>,
    },
    { 
        accessorKey: "gain_loss", 
        header: "Gain / Loss",
        size: 50, 
        aggregationFn: 'sum', // ✅ Enable sum aggregation
        cell: ({ getValue }) => getValue() == null ? null : <div className="text-gray-800 font-bold"> {Number(getValue()).toFixed(1)}</div>,
    },
    { accessorKey: "abs_ret", header: "Abs Ret (%)", size:50, cell: ({ getValue }) => getValue() == null ? null : <div className="text-blue-500"> {Number(getValue()).toFixed(1)}</div>  },
    { accessorKey: "cagr", header: "CAGR (%)", size:50, cell: ({ getValue }) => getValue() == null ? null : <div className="text-blue-500"> {Number(getValue()).toFixed(1)}</div>  },
    { accessorKey: "cat_long_name", header: "Category", size:80 },
    { accessorKey: "fund_rms_name", header: "Fund RMS Name", meta: { isFilterOnly: true } },
    { accessorKey: "asset_class_name", header: "Asset Class", meta: { isFilterOnly: true }, filterFn: "arrIncludesSome" },
    { accessorKey: "cat_name", header: "Category", meta: { isFilterOnly: true }, filterFn: "arrIncludesSome", cell: ({ getValue }) => {
        const v = getValue();
        return v && String(v).length > 12 ? String(v).slice(0, 12) + "…" : v;
    }}, 
    { accessorKey: "structure_name", header: "Structure", meta: { isFilterOnly: true }, filterFn: "arrIncludesSome" },
    { accessorKey: "advisor_name", header: "Advisor", meta: { isFilterOnly: true }, filterFn: "arrIncludesSome" },
    { accessorKey: "amt_change", header: "Change Amount", meta: { isFilterOnly: true } }, // Hidden column for pie charts
    { accessorKey: "new_amt", header: "New Amount", meta: { isFilterOnly: true } }, // Hidden column for pie charts
    { accessorKey: "one_yr", header: "1 yr", size:40, cell: ({ getValue }) => getValue() == null ? null : <div className="text-blue-500"> {Number(getValue()).toFixed(1)}</div>  },
    { accessorKey: "three_yr", header: "3 yr", size:40, cell: ({ getValue }) => getValue() == null ? null : <div className="text-blue-500"> {Number(getValue()).toFixed(1)}</div>  },
    { accessorKey: "five_yr", header: "5 yr", size:40, cell: ({ getValue }) => getValue() == null ? null : <div className="text-blue-500"> {Number(getValue()).toFixed(1)}</div>  },
];