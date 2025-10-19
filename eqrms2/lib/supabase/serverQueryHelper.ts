"use server";

import { createClient } from "./server"; // Make sure this is your server-side client
import { createClient as createAnonymousClient } from '@supabase/supabase-js';

// Get current user from JWT token (server-side)
export async function getCurrentUser(): Promise<{ id: string; email?: string } | null> {
  try {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session?.access_token) {
      return null;
    }
    
    // Decode JWT payload to extract user information
    const payload = JSON.parse(atob(session.access_token.split('.')[1]));
    return {
      id: payload.sub, // 'sub' field contains the user UUID
      email: payload.email
    };
  } catch (error) {
    console.error('Error extracting user from JWT:', error);
    return null;
  }
}

// Server action to get CRM lead data for current user
export async function getCrmLeadDataForCurrentUser() {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return { success: false, error: 'No current user' };
    }
    
    const result = await supabaseSingleRead({
      table: "v_login_profile_with_roles",
      columns: "lead_id,crm_lead_name",
      filters: [
        (query) => query.eq('uuid', currentUser.id)
      ]
    });
    
    return {
      success: true,
      data: result
    };
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Defining types for the query options
type QueryOptions = {
  table: string;
  columns?: string;
  filters?: ((query: any) => any)[];
};

// Fetch a single row from Supabase (server-side)
export async function supabaseSingleRead<T = any>({ table, columns = "*", filters = [] }: QueryOptions): Promise<T | null> {
  const supabase = await createClient();
  let query = supabase.from(table).select(columns);

  filters.forEach((filterFn) => {
    query = filterFn(query);
  });

  const { data, error } = await query.maybeSingle();
  if (error) {
    console.error("Supabase error:", error);
    throw error;
  }
  return data as T;
}

// Fetch a list of rows from Supabase (server-side)
export async function supabaseListRead<T = any>({ table, columns = "*", filters = [] }: QueryOptions): Promise<T[]> {
  const supabase = await createClient();
  let query = supabase.from(table).select(columns);

  filters.forEach((filterFn) => {
    query = filterFn(query);
  });

  const { data, error } = await query;
  if (error) {
    console.error("Supabase error:", error);
    throw error;
  }
  return data as T[];
}

// Update a single row in Supabase (server-side)
export async function supabaseUpdateRow<T>(
  table: string,
  matchKey: string,
  matchValue: string | number,
  updateData: T
): Promise<void> {
  const supabase = await createClient(); // from ./server
  const { error } = await supabase
    .from(table)
    .update(updateData)
    .eq(matchKey, matchValue);

  if (error) {
    console.error("Supabase error:", error);
    throw error;
  }
}

// Insert a single row into Supabase (server-side)
export async function supabaseInsertRow<T>(
  table: string,
  insertData: T
): Promise<void> {
  const supabase = await createClient(); // from ./server
  const { error } = await supabase
    .from(table)
    .insert(insertData);

  if (error) {
    console.error("Supabase error:", error);
    throw error;
  }
}

// Delete rows from Supabase (server-side)
export async function supabaseDeleteRow<T>(
  table: string,
  matchKey: string,
  matchValue: string | number,
  additionalFilters?: T
): Promise<void> {
  const supabase = await createClient(); // from ./server
  let query = supabase.from(table).delete().eq(matchKey, matchValue);
  
  if (additionalFilters) {
    Object.entries(additionalFilters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
  }

  const { error } = await query;

  if (error) {
    console.error("Supabase error:", error);
    throw error;
  }
}

// Utility function to fetch and map options for select, radio, or checkbox inputs
// Example usage:
//   const options = await fetchOptions<string, string>("eq_rms_quarters", "quarter", "quarter");
//   const optionsCustomSort = await fetchOptions<string, string>("eq_rms_quarters", "quarter", "quarter", { column: "created_at", ascending: false });
//   first argument is table name, second is value column, third is label column, fourth is optional sort config
export async function fetchOptions<T, U>(
  table: string,
  valueColumn: string,
  labelColumn: string,
  sortOptions?: { column?: string; ascending?: boolean }
): Promise<{ value: T; label: U }[]> {
  // Default sort settings: sort by label column in ascending order
  const sortColumn = sortOptions?.column || labelColumn;
  const sortAscending = sortOptions?.ascending !== false; // Default to true if not specified

  const data = await supabaseListRead({
    table,
    columns: `${valueColumn}, ${labelColumn}`,
    filters: [
      (query) => query.not(valueColumn, 'is', null),
      (query) => query.not(labelColumn, 'is', null),
      (query) => query.order(sortColumn, { ascending: sortAscending })
    ]
  });

  return data
    .filter((item: Record<string, any>) => {
      const value = item[valueColumn];
      const label = item[labelColumn];
      return value && label && value !== "null" && label !== "null" && value !== "" && label !== "";
    })
    .map((item: Record<string, any>) => ({
      value: item[valueColumn] as T,
      label: item[labelColumn] as U,
    }));
}

// Fetch options but normalize both value and label to strings for form components
export async function fetchStringOptions(
  table: string,
  valueColumn: string,
  labelColumn: string,
  sortOptions?: { column?: string; ascending?: boolean }
): Promise<{ value: string; label: string }[]> {
  const raw = await fetchOptions<any, any>(table, valueColumn, labelColumn, sortOptions);
  return raw.map((o) => ({ value: String(o.value), label: String(o.label ?? "") }));
}

// Generic search function for entities
export async function searchEntities(
  entityType: 'fund' | 'amc' | 'company',
  searchTerm: string,
  limit: number = 10
): Promise<any[]> {
  const searchConfig = {
    fund: {
      table: 'rms_funds',
      columns: 'fund_name, slug',
      searchField: 'fund_name'
    },
    amc: {
      table: 'rms_amc', 
      columns: 'amc_name, slug',
      searchField: 'amc_name'
    },
    company: {
      table: 'eq_rms_company',
      columns: 'ime_name, company_id',
      searchField: 'ime_name'
    }
  };

  const config = searchConfig[entityType];
  
  return await supabaseListRead({
    table: config.table,
    columns: config.columns,
    filters: [
      (query) => query.ilike(config.searchField, `%${searchTerm}%`),
      (query) => query.limit(limit)
    ]
  });
}

// Enhanced fund search function for form integration
export async function searchRmsFundsWithDetails(
  searchTerm: string,
  limit: number = 50
): Promise<Array<{
  fund_id: number;
  fund_name: string;
  asset_class_id: number;
  category_id: number;
  structure_id: number;
  slug: string;
}>> {
  return await supabaseListRead({
    table: 'rms_funds',
    columns: 'fund_id, fund_name, asset_class_id, category_id, structure_id, slug',
    filters: [
      (query) => query.ilike('fund_name', `%${searchTerm}%`),
      (query) => query.not('asset_class_id', 'is', null),
      (query) => query.not('category_id', 'is', null),
      (query) => query.not('structure_id', 'is', null),
      (query) => query.limit(limit)
    ]
  });
}

// Get unlinked client groups (groups with no login profiles)
export async function getUnlinkedClientGroups(): Promise<Array<{
  group_id: number;
  group_name: string;
}>> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('get_unlinked_client_groups');
  
  if (error) {
    console.error("Error fetching unlinked client groups:", error);
    throw error;
  }
  
  return data || [];
}

// Get public blog slugs for static generation (anonymous client)
export async function getPublicBlogSlugs(): Promise<Array<{ slug: string }>> {
  try {
    // Create anonymous client for build-time static generation
    const supabase = createAnonymousClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    const { data, error } = await supabase
      .from('blogs')
      .select('slug')
      .eq('status', 'published'); // Only published blogs
    
    if (error) {
      console.error('Error fetching public blog slugs:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getPublicBlogSlugs:', error);
    return [];
  }
}

// Upload image to Supabase Storage (server-side)
export async function uploadImageToStorage(
  file: File,
  bucket: string = 'blog'
): Promise<{ success: boolean; path?: string; error?: string }> {
  try {
    const supabase = await createClient();
    
    // Sanitize filename - remove spaces and special characters
    const sanitizedFilename = file.name
      .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars with underscore
      .replace(/_+/g, '_') // Replace multiple underscores with single
      .replace(/^_|_$/g, '') // Remove leading/trailing underscores
      .substring(0, 80); // Limit to 80 characters
    
    // Convert File to ArrayBuffer for server-side upload
    const arrayBuffer = await file.arrayBuffer();
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(sanitizedFilename, arrayBuffer, {
        contentType: file.type,
        upsert: false // Don't overwrite existing files
      });

    if (error) {
      console.error('Upload error:', error);
      return { success: false, error: error.message };
    }

    return { 
      success: true, 
      path: `/${data.path}` 
    };
  } catch (error) {
    console.error('Upload error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
