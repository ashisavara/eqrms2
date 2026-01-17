"use server";

import { getCurrentGroupId } from "@/lib/auth/serverGroupMandate";
import { supabaseInsertRow } from "@/lib/supabase/serverQueryHelper";

export type FundComparisonResult = {
  success: boolean;
  message?: string;
  error?: string;
};

/**
 * Add a fund to the comparison table for the current group
 * Returns a result object for notification handling
 */
export async function addFundToComparison(fundId: number): Promise<FundComparisonResult> {
  try {
    const groupId = await getCurrentGroupId();
    
    if (!groupId) {
      return {
        success: false,
        error: "No group selected"
      };
    }

    const insertData = {
      group_id: groupId,
      fund_id: fundId
    };

    await supabaseInsertRow("im_fund_comparison", insertData);

    return {
      success: true,
      message: "Fund added to comparison successfully"
    };
  } catch (error: any) {
    // Check if it's a unique constraint violation (already exists)
    if (error?.code === '23505') {
      return {
        success: false,
        error: "Fund is already in comparison"
      };
    }
    
    console.error("Error adding fund to comparison:", error);
    return {
      success: false,
      error: error?.message || "Failed to add fund to comparison"
    };
  }
}
