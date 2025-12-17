import { ColumnDef } from "@tanstack/react-table";  
import Link from "next/link";
import { RatingDisplay } from "@/components/conditional-formatting";
import {Investments} from"@/types/investment-detail";
import { isMobileView } from "@/lib/hooks/useResponsiveColumns";
import { EditHeldAwayAssetsButton } from "@/components/forms/EditHeldAway";
import { DeleteInvestmentButton } from "@/components/forms/DeleteInvestmentButton";
import SimpleTable from "@/components/tables/singleRowTable";
import { can } from '@/lib/permissions';

export const createColumns = (userRoles: string[]): ColumnDef<Investments>[] => {
  const canEditInvestments = can(userRoles, 'investments', 'add_edit_held_away');

  return [


    { accessorKey: "fund_name", 
    header: "Fund Name",
    size:200,
    cell: ({row, table}) => {
        if (isMobileView(table)) {
            // Mobile view - show as card
            return (
                <div className="mobile-card">
                    <div className="font-semibold text-left text-sm">
                        {row.original.slug ? (
                            <Link href={`/funds/${row.original.slug}`} className="text-blue-600 font-bold">
                                {row.original.fund_name}
                            </Link>
                        ) : (
                            row.original.fund_name
                        )}
                           <span className="text-gray-600 text-xs pl-2 font-normal">    {row.original.investor_name}</span>
                    </div>
                    <SimpleTable 
                        headers={[{ label: "Rating" }, { label: "PurVal" }, { label: "CurVal" }, { label: "Gain/loss" }]}
                        body={[{ value: <RatingDisplay rating={row.original.fund_rating} /> }, { value: row.original.pur_amt?.toFixed(1)}, { value: row.original.cur_amt?.toFixed(1) }, { value: row.original.gain_loss?.toFixed(1) }]}
                    />
                </div>
            );
        } else {
            // Desktop view - show as normal table cell
            if (row.original.slug) {
                return <div className="text-left flex items-center">
                    <Link href={`/funds/${row.original.slug}`} className="blue-hyperlink">{row.original.fund_name}</Link>  
                    {canEditInvestments &&<EditHeldAwayAssetsButton investmentData={row.original} investmentId={row.original.investment_id} />}
                    </div>
            } else {
                return (
                  <div className="text-left flex items-center">
                    {row.original.fund_name}
                    {canEditInvestments &&  <><EditHeldAwayAssetsButton investmentData={row.original} investmentId={row.original.investment_id} />
                    <DeleteInvestmentButton investmentId={row.original.investment_id} advisorName={row.original.advisor_name} /></>}
                  </div>
                )
            }
        }
    }
    },
    { accessorKey: "fund_rating", header: "Fund Rating", size:40, filterFn: "arrIncludesSome", cell: ({ getValue }) => <RatingDisplay rating={getValue() as number} /> },
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
    { accessorKey: "cat_long_name", header: "Category", size:100, cell: ({ getValue }) => {
        const v = getValue();
        return v && String(v).length > 20 ? String(v).slice(0, 20) + "…" : v;
    }},
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
};

// Export the default columns for backward compatibility (without permissions)
export const columns = createColumns([]);