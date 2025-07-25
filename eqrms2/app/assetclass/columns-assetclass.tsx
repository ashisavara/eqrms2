import { ColumnDef } from "@tanstack/react-table";
import { AssetClass } from "@/types/asset-class-detail";
import Link from "next/link";

export const columns: ColumnDef<AssetClass>[] = [
    {
        accessorKey:"asset_class_name",
        header: "Asset Class",
        cell: ({row}) => {
            const assetClass = row.original;
            return (
                <Link href={`/assetclass/${assetClass.asset_class_slug}`} className="text-blue-600 font-bold hover:underline">
                    {assetClass.asset_class_name}
                </Link>
            )
        }
    },
    {
        accessorKey:"asset_class_summary",
        header: "Summary",
    }
];
