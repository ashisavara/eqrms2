import { ColumnDef } from "@tanstack/react-table";  
import Link from "next/link";
import { FinGoalsDetail } from "@/types/fin-goals-detail";
import { isMobileView } from "@/lib/hooks/useResponsiveColumns";
import { EditFinGoalsButton } from "@/components/forms/EditFinancialGoals";
import { PencilIcon } from "lucide-react";

export const columns: ColumnDef<FinGoalsDetail>[] = [
    { 
        accessorKey: "goal_name", 
        header: "Goal Name",
        size:150,
        cell: ({ row, table }) => {
            if (isMobileView(table)) {
                // Mobile view - show as card
                return (
                    <div>
                    </div>
                );
            } else {
                // Desktop view - show as normal table cell
                return (
                    <div className="text-left">
                        <EditFinGoalsButton goalData={row.original} goalId={row.original.goal_id}>
                            <span className="blue-hyperlink">
                                {row.original.goal_name}
                            </span>
                        </EditFinGoalsButton>
                    </div>
                );
            }
        }
    },
    { 
        accessorKey: "goal_description", 
        header: "Goal Description", 
        size:500, 
        cell: ({ getValue }) => (getValue() as string) || "" 
    },
];




