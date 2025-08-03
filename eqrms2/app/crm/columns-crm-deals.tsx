import { ColumnDef } from "@tanstack/react-table";  
import Link from "next/link";
import { Deals } from"@/types/deals";
import { formatDate } from "@/lib/utils";
import { EditDealButton } from "@/components/forms/EditDeals";

export const createColumns = (
    dealEstClousureOptions: { value: string; label: string }[],
    dealStageOptions: { value: string; label: string }[],
    dealSegmentOptions: { value: string; label: string }[],
): ColumnDef<Deals>[] => [
    { 
        accessorKey: "created_at", 
        header: "Date", size:120, cell: ({ getValue }) => getValue() == null ? null : <p className="text-left">{formatDate(getValue() as string)}</p>},

    { accessorKey: "deal_name", header: "Deal", size:250, 
        cell: ({ row }) => row.original.deal_name == null ? null : <div className="text-left"><EditDealButton dealData={row.original} dealId={row.original.deal_id} dealEstClosureOptions={dealEstClousureOptions} dealStageOptions={dealStageOptions} dealSegmentOptions={dealSegmentOptions} /></div>,
    },
    { accessorKey: "est_closure", header: "Est. Closure", size:130,},
    { accessorKey: "deal_likelihood", header: "Likelihood", size:100,},
    { accessorKey: "deal_stage", header: "Stage", size:100,},
    { accessorKey: "deal_segment", header: "Segment", size:130,},
    { accessorKey: "total_deal_aum", header: "AUM", size:100,},
    { accessorKey: "total_deal_likely", header: "Likely", size:100,},
    { accessorKey: "deal_summary", header: "Summary", size:600,},   
    
];