import { ColumnDef } from "@tanstack/react-table";  
import Link from "next/link";
import { FinGoalsDetail } from "@/types/fin-goals-detail";
import { isMobileView } from "@/lib/hooks/useResponsiveColumns";
import { EditFinGoalsButton } from "@/components/forms/EditFinancialGoals";
import { PencilIcon } from "lucide-react";
import SimpleTable from "@/components/tables/singleRowTable";
import { GoalAchievementRating, YearsToGoalRating } from "@/components/conditional-formatting";

export const columns: ColumnDef<FinGoalsDetail>[] = [
    { 
        accessorKey: "goal_name", 
        header: "Goal Name",
        cell: ({ row, table }) => {
            if (isMobileView(table)) {
                // Mobile view - show as card
                return (
                    <div className="mobile-card">
                        <div className="font-semibold text-left">
                            {row.original.goal_name}
                        </div>
                        <p className="text-xs text-gray-600 text-left">{row.original.goal_description}</p>
                        <SimpleTable 
                            headers={[{ label: "Achieved" }, { label: "FV Goal" }, { label: "Yrs Goal" }]}
                            body={[{ value: <GoalAchievementRating percentage={row.original.goal_ach as number} /> }, { value: row.original.fv_goals}, { value: <YearsToGoalRating years={row.original.yrs_to_goal as number} /> }]}
                        />
                        <SimpleTable 
                            headers={[{ label: "FV Inv" }, { label: "Pending" }, { label: "Lumpsum" }, { label: "SIP" }]}
                            body={[{ value: (row.original.fv_inv as number)?.toFixed(0) || "" }, { value: (row.original.pending_amt as number)?.toFixed(0) || "" }, { value: (row.original.lumpsum_req as number)?.toFixed(0) || "" }, { value: (row.original.sip_req as number)?.toFixed(0) || "" }]}
                        />
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
    { accessorKey: "goal_ach", header: "Achieved", cell: ({ getValue }) => <GoalAchievementRating percentage={getValue() as number} /> },
    { 
        accessorKey: "yrs_to_goal", 
        header: "Yrs to Goal", 
        size:80,
        cell: ({ getValue }) => <YearsToGoalRating years={getValue() as number} />
    },
    { accessorKey: "pv_goal", header: "PV Goal", size:80, cell: ({ getValue }) => (getValue() as number)?.toFixed(0) || "" },
    { accessorKey: "fv_goals", header: "FV Goal", size:80, cell: ({ getValue }) => <span className="font-bold">{getValue() as number}</span>},
    { accessorKey: "pv_inv", header: "PV Inv", size:80, cell: ({ getValue }) => (getValue() as number)?.toFixed(0) || "" },
    { accessorKey: "fv_inv", header: "FV Inv", size:80, cell: ({ getValue }) => <span className="font-bold">{(getValue() as number)?.toFixed(0) || ""}</span> },
    { accessorKey: "pending_amt", header: "Pending Amt", size:80, cell: ({ getValue }) => <span className="font-bold">{(getValue() as number)?.toFixed(0) || ""}</span> },
    { accessorKey: "lumpsum_req", header: "Lumpsum Req", size:80, cell: ({ getValue }) => (getValue() as number)?.toFixed(0) || "" },
    { accessorKey: "sip_req", header: "SIP Req", size:80, cell: ({ getValue }) => (getValue() as number)?.toFixed(0) || "" }
];




