import { ColumnDef } from "@tanstack/react-table";
import { AssetClass } from "@/types/asset-class-detail";
import Link from "next/link";
import { FavouriteHeart } from "@/components/ui/favourite-heart";
import { isMobileView } from "@/lib/hooks/useResponsiveColumns";

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
        cell: ({row, table}) => {
            const assetClass = row.original;
            if (isMobileView(table)) {
                return (
                    <div className="mobile-card">
                        <div className="flex flex-row flex-wrap justify-between">
                            <Link href={`/assetclass/${assetClass.asset_class_slug}`} className="text-blue-600 font-bold hover:underline">
                                {assetClass.asset_class_name}
                            </Link>
                            <FavouriteHeart 
                                entityType="asset_class" 
                                entityId={assetClass.asset_class_id} 
                                size="md"
                            />
                        </div>
                        <div className="text-left">
                        {assetClass.asset_class_summary}
                        </div>
                    </div>
                );
            } else {
                return ( 
                <div className="text-left">
                    <Link href={`/assetclass/${assetClass.asset_class_slug}`} className="text-blue-600 font-bold hover:underline">
                        {assetClass.asset_class_name}
                    </Link>
                </div>  
            )
            }
        }
    },
    {
        accessorKey:"asset_class_summary",
        header: "Summary",
        size: 800,
    }
];
