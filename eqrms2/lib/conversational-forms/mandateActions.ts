"use server";

import { supabaseUpdateRow, supabaseSingleRead } from "@/lib/supabase/serverQueryHelper";
import { ServerActionResponse } from "./types";

/**
 * Load investment mandate data for form
 * Used when opening a mandate form to pre-fill existing values
 */
export async function loadMandateData(
  mandateId: number
): Promise<ServerActionResponse<Record<string, any>>> {
  try {
    const result = await supabaseSingleRead({
      table: "investment_mandate",
      columns: "*",
      filters: [(query) => query.eq("im_id", mandateId)]
    });

    if (!result) {
      return {
        success: false,
        error: 'Mandate not found'
      };
    }

    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Error loading mandate data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to load mandate data'
    };
  }
}

/**
 * Update a single field in investment mandate
 * Called after each question is answered for auto-save
 */
export async function updateMandateField(
  mandateId: number,
  fieldData: Record<string, any>
): Promise<ServerActionResponse> {
  try {
    await supabaseUpdateRow("investment_mandate", "im_id", mandateId, fieldData);
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Error updating mandate field:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update mandate field'
    };
  }
}

