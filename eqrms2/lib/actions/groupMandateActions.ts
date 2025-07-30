"use server";

import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";

// Types for database responses
type DbGroup = {
  group_id: number;
  group_name: string;
};

type DbMandate = {
  im_id: number;
  mandate_name: string;
};

/**
 * Server action to get user's accessible groups
 * RLS automatically filters based on user's ACL permissions
 */
export async function loadUserGroups() {
  try {
    const groups = await supabaseListRead<DbGroup>({
      table: "client_group",
      columns: "group_id, group_name"
    });

    return groups.map(group => ({
      id: group.group_id,
      name: group.group_name
    }));
  } catch (error) {
    console.error('Error loading groups:', error);
    throw error;
  }
}

/**
 * Server action to get mandates for a specific group
 */
export async function loadGroupMandates(groupId: number) {
  try {
    const mandates = await supabaseListRead<DbMandate>({
      table: "investment_mandate",
      columns: "im_id, mandate_name",
      filters: [
        (query) => query.eq('group_id', groupId)
      ]
    });

    return mandates.map(mandate => ({
      id: mandate.im_id,
      name: mandate.mandate_name
    }));
  } catch (error) {
    console.error('Error loading mandates for group:', groupId, error);
    throw error;
  }
} 