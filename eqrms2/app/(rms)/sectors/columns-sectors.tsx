import { ColumnDef } from "@tanstack/react-table";
import { SectorValues } from "@/types/forms";
import { EditSectorButton } from "@/components/forms/EditSector";

export const columns: ColumnDef<SectorValues>[] = [
    {
        accessorKey:"sector_name",
        header: "Sector Name",
        cell: ({row}) => {
            const sector = row.original;
            return (
                    <EditSectorButton 
                        sectorData={sector}
                        sectorSlug={sector.sector_slug || ""}
                    />
            )
        }
    },
    {
        accessorKey:"sector_stance",
        header: "Stance",
    },
    {
        accessorKey:"mkt_momentum",
        header: "Mkt Momentum",
    },
    {
        accessorKey:"investment_view",
        header: "Investment View",
    },
    {
        accessorKey:"sector_positive_snapshot",
        header: "Positive Snapshot",
    },
    {
        accessorKey:"sector_negative_snapshot",
        header: "Negative Snapshot",
    },
    {
        accessorKey:"sector_watch_for_snapshot",
        header: "Watch For Snapshot",
    }
];
