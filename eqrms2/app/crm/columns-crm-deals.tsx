import { ColumnDef } from "@tanstack/react-table";  
import Link from "next/link";
import { Deals } from "@/types/deals";
import { formatDate } from "@/lib/utils";
import { EditDealButton } from "@/components/forms/EditDeals";
import { DealLikelihoodRating, DealEstClosureRating, DealStageRating } from "@/components/conditional-formatting";

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
    { accessorKey: "lead_name", header: "Lead", size:150,
        cell: ({ row }) => {
            return <div className="text-left">
                <Link href={`/crm/${row.original.rel_lead_id}`} className="text-blue-500 hover:text-blue-800 font-bold !text-left hover:underline">{row.original.lead_name} </Link> 
                </div>
        }
    },
    { accessorKey: "total_deal_aum", header: "AUM", size:100,
        cell: ({ getValue }) => getValue() == null ? null : <p className="font-bold">{getValue() as number}</p>,
    },
    { accessorKey: "est_closure", header: "Est. Closure", size:130,
        cell: ({ getValue }) => getValue() == null ? null : <DealEstClosureRating rating={getValue() as string}>{getValue() as string}</DealEstClosureRating>,
    },
    { accessorKey: "deal_likelihood", header: "Likelihood", size:80, 
        cell: ({ getValue }) => getValue() == null ? null : <DealLikelihoodRating rating={getValue() as number} />},
    { accessorKey: "deal_stage", header: "Stage", size:140,
        cell: ({ getValue }) => getValue() == null ? null : <DealStageRating rating={getValue() as string}>{getValue() as string}</DealStageRating>,
    },
    { accessorKey: "deal_segment", header: "Segment", size:130,},
    { accessorKey: "deal_summary", header: "Summary", size:600,},   
    
];
