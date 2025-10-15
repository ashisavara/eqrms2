/**
 * @deprecated These actions are deprecated. Use mandateActions.ts or simpleActions.ts instead.
 * 
 * - For mandate-linked forms: Use mandateActions.ts (loadMandateData, updateMandateField)
 * - For insert-only forms: Use simpleActions.ts (insertFormData)
 * 
 * See: lib/conversational-forms/mandateActions.ts
 * See: lib/conversational-forms/simpleActions.ts
 */

"use server";

import { supabaseUpdateRow, supabaseSingleRead } from "@/lib/supabase/serverQueryHelper";
import { createClient } from "@/lib/supabase/server";
import { ServerActionResponse } from "./types";

/**
 * Create initial draft entry in the database
 * Called after user answers the first question
 */
export async function createFormDraft(
  table: string, 
  data: Record<string, any>
): Promise<ServerActionResponse<{ id: number }>> {
  try {
    const supabase = await createClient();
    
    // Insert and return the created row
    const { data: insertedData, error } = await supabase
      .from(table)
      .insert(data)
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create form draft'
      };
    }

    if (!insertedData) {
      return {
        success: false,
        error: 'No data returned from insert'
      };
    }

    // Get the ID from the result (find the column ending with '_id')
    const idKey = Object.keys(insertedData).find(key => key.endsWith('_id')) || Object.keys(insertedData)[0];
    const id = insertedData[idKey];

    return {
      success: true,
      data: { id }
    };
  } catch (error) {
    console.error('Error creating form draft:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create form draft'
    };
  }
}

/**
 * Update existing form data
 * Called on each subsequent answer
 */
export async function updateFormDraft(
  table: string,
  idColumn: string,
  id: number,
  data: Record<string, any>
): Promise<ServerActionResponse> {
  try {
    await supabaseUpdateRow(table, idColumn, id, data);
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Error updating form draft:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update form draft'
    };
  }
}

/**
 * Load existing form data for editing or resuming
 */
export async function loadFormData(
  table: string,
  idColumn: string,
  id: number
): Promise<ServerActionResponse<Record<string, any>>> {
  try {
    const result = await supabaseSingleRead({
      table,
      columns: "*",
      filters: [(query) => query.eq(idColumn, id)]
    });

    if (!result) {
      return {
        success: false,
        error: 'Form not found'
      };
    }

    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Error loading form data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to load form data'
    };
  }
}

/**
 * Mark form as submitted/complete
 * Called when user submits the final question
 */
export async function submitForm(
  table: string,
  idColumn: string,
  id: number,
  finalData: Record<string, any>,
  auditData: any
): Promise<ServerActionResponse> {
  try {
    await supabaseUpdateRow(table, idColumn, id, {
      ...finalData,
      form_status: 'submitted',
      submission_data: auditData
    });

    return {
      success: true
    };
  } catch (error) {
    console.error('Error submitting form:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit form'
    };
  }
}

