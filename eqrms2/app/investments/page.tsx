import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { getCurrentGroupId } from "@/lib/auth/serverGroupMandate";
import TableInvestments  from "./TableInvestments";
import TableSystematic from "./TableSip";
import TableStp from "./TableStp";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Function to process raw investment data and update existing fields with calculated values
function processInvestmentData(rawData: any[]): any[] {
  return rawData.map(investment => {
    const curAmt = investment.cur_amt ?? 0;
    const originalAmtChange = investment.amt_change ?? 0;
    const recommendation = investment.recommendation;
    
    // Calculate the effective change amount for display
    let effectiveAmtChange: number;
    if (recommendation === 'Exit') {
      effectiveAmtChange = -curAmt; // Exit = sell entire position
    } else {
      effectiveAmtChange = originalAmtChange; // Use original value for other recommendations
    }
    
    // Update amt_change field with the effective value
    investment.amt_change = effectiveAmtChange;
    
    // Calculate new_amt based on recommendation
    let newAmt: number;
    if (recommendation === 'Exit') {
      newAmt = 0; // Exit = complete exit
    } else if (originalAmtChange === 0) {
      newAmt = curAmt; // No change = keep current amount
    } else {
      newAmt = curAmt + originalAmtChange; // Position adjustment
    }
    
    // Ensure new_amt is never negative (safety check)
    investment.new_amt = Math.max(0, newAmt);
    
    return investment;
  });
}


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
  const [rawInvestments, sip, stp, investor] = await Promise.all([
    supabaseListRead({
      table: "view_investments_details",
      columns: "fund_name, fund_rating, investor_name, pur_amt, cur_amt, gain_loss, abs_ret, cagr, cat_long_name, fund_rms_name, asset_class_name, cat_name, structure_name, slug, one_yr,three_yr,five_yr, advisor_name, investment_id, amt_change, new_amt, recommendation, asset_class_id, category_id, structure_id",
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
    supabaseListRead({
      table: "group_investors",
      columns: "*",
      filters: [
        (query) => query.eq("group_id", groupId)
      ], 
    }),
  ]);

  // Process investment data to update existing fields with calculated values
  const investments = processInvestmentData(rawInvestments);
  const investorOptions = investor.map(investor => ({
    value: String(investor.investor_id),
    label: investor.investor_name as string
  }));

  return (
    <div>

          <TableInvestments data={investments} sipData={sip} stpData={stp} investorOptions={investorOptions} />

    </div>
  );
}