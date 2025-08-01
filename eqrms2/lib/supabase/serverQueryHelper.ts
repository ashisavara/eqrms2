"use server";

import { createClient } from "./server"; // Make sure this is your server-side client

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
      (query) => query.neq(valueColumn, null),
      (query) => query.neq(labelColumn, null),
      (query) => query.order(sortColumn, { ascending: sortAscending })
    ]
  });

  return data.map((item: Record<string, any>) => ({
    value: item[valueColumn] as T,
    label: item[labelColumn] as U,
  }));
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
      columns: 'amc_name',
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
