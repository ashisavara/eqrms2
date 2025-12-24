"use server";

import { supabaseUpdateRow, supabaseSingleRead } from "@/lib/supabase/serverQueryHelper";
import { ServerActionResponse } from "./types";

/**
 * Load group data for form
 * Used when opening a group form to pre-fill existing values
 */
export async function loadGroupData(
  groupId: number
): Promise<ServerActionResponse<Record<string, any>>> {
  try {
    const result = await supabaseSingleRead({
      table: "client_group",
      columns: "*",
      filters: [(query) => query.eq("group_id", groupId)]
    });

    if (!result) {
      return {
        success: false,
        error: 'Group not found'
      };
    }

    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Error loading group data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to load group data'
    };
  }
}

// Legacy function name for backward compatibility
export const loadMandateData = loadGroupData;

/**
 * Update a single field in client group
 * Called after each question is answered for auto-save
 */
export async function updateGroupField(
  groupId: number,
  fieldData: Record<string, any>
): Promise<ServerActionResponse> {
  try {
    await supabaseUpdateRow("client_group", "group_id", groupId, fieldData);
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Error updating group field:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update group field'
    };
  }
}

// Legacy function name for backward compatibility
export const updateMandateField = updateGroupField;

