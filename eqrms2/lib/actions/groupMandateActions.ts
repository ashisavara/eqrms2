// list provider .. goes to supabase to get the list of options

"use server";

import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";

// Types for database responses
type DbGroup = {
  group_id: number;
  group_name: string;
};

/**
 * Server action to get user's accessible groups
 * RLS automatically filters based on user's ACL permissions
 */
export async function loadUserGroups() {
  try {
    const groups = await supabaseListRead<DbGroup>({
      table: "client_group",
      columns: "group_id, group_name", 
      filters: [
        (query) => query.order('group_name', { ascending: true })
      ]
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
