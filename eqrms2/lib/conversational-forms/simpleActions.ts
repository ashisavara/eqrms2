"use server";

import { createClient } from "@/lib/supabase/server";
import { ServerActionResponse } from "./types";

/**
 * Insert form data into target table
 * Called once when user completes the entire form
 * No auto-save - all data submitted at the end
 */
export async function insertFormData(
  table: string,
  data: Record<string, any>
): Promise<ServerActionResponse> {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from(table)
      .insert(data);

    if (error) {
      console.error('Supabase insert error:', error);
      return {
        success: false,
        error: error.message || 'Failed to submit form'
      };
    }

    return {
      success: true
    };
  } catch (error) {
    console.error('Error inserting form data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit form'
    };
  }
}

