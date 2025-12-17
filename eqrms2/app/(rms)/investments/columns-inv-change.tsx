import { ColumnDef } from "@tanstack/react-table";  
import Link from "next/link";
import { RatingDisplay } from "@/components/conditional-formatting";
import {Investments} from"@/types/investment-detail";
import { isMobileView } from "@/lib/hooks/useResponsiveColumns";
import { EditInvAmtButton } from "@/components/forms/EditInvNewAmt";
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
                <div className="p-3 border rounded-lg space-y-2">
                    <div className="font-semibold text-left text-base">
                        {row.original.slug ? (
                            <Link href={`/funds/${row.original.slug}`} className="text-blue-600 font-bold">
                                {row.original.fund_name}
                            </Link>
                        ) : (
                            row.original.fund_name
                        )} 
                        <span className="text-gray-600 text-xs font-normal">     |  {row.original.investor_name}</span>
                    </div>
                    <p className="text-xs text-left text-gray-600">{row.original.recommendation || ''}</p>
                    <SimpleTable 
                        headers={[{ label: "Rating" }, { label: "CurVal" }, { label: "Change" }, { label: "NewVal" }]}
                        body={[{ value: <RatingDisplay rating={row.original.fund_rating} /> }, { value: row.original.cur_amt?.toFixed(1)}, { value: row.original.amt_change?.toFixed(1) }, { value: row.original.new_amt?.toFixed(1) }]}
                    />
                </div>
            );
        } else {
            // Desktop view - show as normal table cell
            if (row.original.slug) {
                return <div className="text-left"><Link href={`/funds/${row.original.slug}`} className="blue-hyperlink">{row.original.fund_name}</Link> {canEditInvestments && <>| <EditInvAmtButton investmentData={row.original} investmentId={row.original.investment_id} /></>}</div>
            } else {
                return <div className="text-left">{row.original.fund_name} {canEditInvestments && <>| <EditInvAmtButton investmentData={row.original} investmentId={row.original.investment_id} /></>}</div>
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
        accessorKey: "cur_amt", 
        header: "Cur Amt",
        size: 50, 
        aggregationFn: 'sum', // ✅ Enable sum aggregation
        cell: ({ getValue }) => getValue() == null ? null : <div className="text-gray-800 font-bold"> {Number(getValue()).toFixed(1)}</div>,
    },
    { 
        accessorKey: "amt_change", 
        header: "Change Amt",
        size: 50, 
        aggregationFn: 'sum', // ✅ Enable sum aggregation
        cell: ({ getValue }) => {
            const value = getValue() as number;
            return value === 0
                ? null
                : <div className="text-gray-800 font-bold">{value.toFixed(1)}</div>;
        },
    },
    { 
        accessorKey: "new_amt", 
        header: "New Amount", 
        size:50, 
        cell: ({ getValue }) => {
            const value = getValue() as number;
            return <div className="text-blue-500 font-bold">{value.toFixed(1)}</div>;
        }
    },
    { accessorKey: "recommendation", header: "Recommendation", size:50, cell: ({ getValue }) => {
        const recommendation = getValue() as string;
        if (!recommendation) return null;
        return <div>{recommendation}</div>;
    }},
    { accessorKey: "cat_long_name", header: "Category", size:80 },
    { accessorKey: "fund_rms_name", header: "Fund RMS Name", meta: { isFilterOnly: true } },
    { accessorKey: "asset_class_name", header: "Asset Class", meta: { isFilterOnly: true }, filterFn: "arrIncludesSome" },
    { accessorKey: "cat_name", header: "Category", meta: { isFilterOnly: true }, filterFn: "arrIncludesSome", cell: ({ getValue }) => {
        const v = getValue();
        return v && String(v).length > 12 ? String(v).slice(0, 12) + "…" : v;
    }}, 
    { accessorKey: "structure_name", header: "Structure", meta: { isFilterOnly: true }, filterFn: "arrIncludesSome" },
    { accessorKey: "advisor_name", header: "Advisor", meta: { isFilterOnly: true }, filterFn: "arrIncludesSome" },
    { accessorKey: "one_yr", header: "1 yr", size:40, cell: ({ getValue }) => getValue() == null ? null : <div className="text-blue-500"> {Number(getValue()).toFixed(1)}</div>  },
    { accessorKey: "three_yr", header: "3 yr", size:40, cell: ({ getValue }) => getValue() == null ? null : <div className="text-blue-500"> {Number(getValue()).toFixed(1)}</div>  },
    { accessorKey: "five_yr", header: "5 yr", size:40, cell: ({ getValue }) => getValue() == null ? null : <div className="text-blue-500"> {Number(getValue()).toFixed(1)}</div>  },
  ];
};

// Export the default columns for backward compatibility (without permissions)
export const columns = createColumns([]);