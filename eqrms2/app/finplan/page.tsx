import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { getCurrentGroupId } from "@/lib/auth/serverGroupMandate";
import FinPlanClientWrapper from "./FinPlanClientWrapper";


export default async function FinPlan() {
    // Get current group ID from cookies (server-side)
    const groupId = await getCurrentGroupId();

    // If no group selected, show message
    if (!groupId) {
        return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Financial Planning</h1>
            <p className="text-muted-foreground">
            Please select a group using the "Select Group & Mandate" button to view financial planning.
            </p>
        </div>
        );
    }

    const [finGoals, investmentFinPlan, sipFinGoals] = await Promise.all([
        supabaseListRead({
          table: "fin_goals",
          columns: "*",
          filters: [
            (query) => query.eq("group_id", groupId)
          ], 
        }),
        supabaseListRead({
          table: "view_investments_details",
          columns: "fund_name, goal_name, investor_name, asset_class_name, cur_amt, fv_inv",
          filters: [
            (query) => query.eq("group_id", groupId)
          ]
        }),
        supabaseListRead({
          table: "view_inv_sip_details",
          columns: "sip_fund_name, goal_name, investor_name, sip_amount, months_left, sip_fv",
          filters: [
            (query) => query.eq("group_id", groupId)
          ], 
        }),
      ]);



    return(
        <div>
            <FinPlanClientWrapper finGoalsData={finGoals} investmentFinPlanData={investmentFinPlan} sipFinGoalsData={sipFinGoals} />
            
        </div>
    )
};