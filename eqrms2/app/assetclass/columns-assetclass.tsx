import { ColumnDef } from "@tanstack/react-table";
import { AssetClass } from "@/types/asset-class-detail";
import Link from "next/link";
import { FavouriteHeart } from "@/components/ui/favourite-heart";

export const columns: ColumnDef<AssetClass>[] = [
    {
        id: "is_favourite",
        header: "♥",
        size: 40,
        cell: ({ row }) => (
            <FavouriteHeart 
                entityType="asset_class" 
                entityId={row.original.asset_class_id} 
                size="sm"
            />
        ),
        enableSorting: true,
        meta: { isFilterOnly: false }
    },
    {
        accessorKey:"asset_class_name",
        header: () => <div className="!text-left">Asset Class</div>,
        size: 200,
        cell: ({row}) => {
            const assetClass = row.original;
            return (
                <div className="text-left">
                    <Link href={`/assetclass/${assetClass.asset_class_slug}`} className="text-blue-600 font-bold hover:underline">
                        {assetClass.asset_class_name}
                    </Link>
                </div>
            )
        }
    },
    {
        accessorKey:"asset_class_summary",
        header: "Summary",
        size: 800,
    }
];
