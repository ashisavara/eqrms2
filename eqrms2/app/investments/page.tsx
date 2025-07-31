import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { getCurrentGroupId } from "@/lib/auth/serverGroupMandate";
import TableInvestments  from "./TableInvestments";
import TableSystematic from "./TableSip";
import TableStp from "./TableStp";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export default async function InvestmentsPage() {
  // Get current group ID from cookies (server-side)
  const groupId = await getCurrentGroupId();
  
  // If no group selected, show message
  if (!groupId) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Investments</h1>
        <p className="text-muted-foreground">
          Please select a group using the "Select Group & Mandate" button to view investments.
        </p>
      </div>
    );
  }
  // Fetch investments for the selected group (server-side)
  const [investments,sip,stp] = await Promise.all([
  await supabaseListRead({
    table: "view_investments_details",
    columns: "fund_name, fund_rating, investor_name, pur_amt, cur_amt, gain_loss, abs_ret, cagr, cat_long_name, fund_rms_name, asset_class_name, cat_name, structure_name, slug, one_yr,three_yr,five_yr, advisor_name",
    filters: [
      (query) => query.eq("group_id", groupId)
    ]
  }),
  supabaseListRead({
    table: "view_inv_sip_details",
    columns: "*",
    filters: [
      (query) => query.eq("group_id", groupId)
    ], 
  }),
  supabaseListRead({
    table: "view_inv_stp_details",
    columns: "*",
    filters: [
      (query) => query.eq("group_id", groupId)
    ], 
  }),
]);

  return (
    <div>

          <TableInvestments data={investments} sipData={sip} stpData={stp} />
          <h2>SIP Details</h2>
          <TableSystematic data={sip} />
          <h2>STP Details</h2>
          <TableStp data={stp} />


    </div>
  );
}