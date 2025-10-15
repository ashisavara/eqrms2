import { ColumnDef } from "@tanstack/react-table";
import { Structure } from "@/types/structure-detail";
import Link from "next/link";
import { FavouriteHeart } from "@/components/ui/favourite-heart";
import { isMobileView } from "@/lib/hooks/useResponsiveColumns";

export const columns: ColumnDef<Structure>[] = [
    {
        id: "is_favourite",
        header: "♥",
        size: 40,
        cell: ({ row }) => (
            <FavouriteHeart 
                entityType="structure" 
                entityId={row.original.structure_id} 
                size="sm"
            />
        ),
        enableSorting: true,
        meta: { isFilterOnly: false }
    },
    {
        accessorKey:"structure_name",
        header: () => <div className="!text-left">Structure</div>,
        size: 200,
        cell: ({row, table}) => {
            const structure = row.original;
            if (isMobileView(table)) {
                return (
                    <div className="mobile-card">
                        <div className="flex flex-row flex-wrap justify-between">
                            <Link href={`/structure/${structure.structure_slug}`} className="text-blue-600 font-bold hover:underline">
                                {structure.structure_name}
                            </Link>
                            <FavouriteHeart 
                                entityType="structure" 
                                entityId={structure.structure_id} 
                                size="md"
                            />
                        </div>
                        <div className="text-left">
                        {structure.structure_summary}
                        </div>
                    </div>
                );
            } else {
                return ( 
                <div className="text-left">
                    <Link href={`/structure/${structure.structure_slug}`} className="text-blue-600 font-bold hover:underline">
                        {structure.structure_name}
                    </Link>
                </div>  
            )
            }
        }
    },
    {
        accessorKey:"structure_summary",
        header: "Summary",
        size: 800,
    }
];

