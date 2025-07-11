import { createClient } from "./server"; // Make sure this is your server-side client

// Defining types for the filter and query options
type Filter = {
  column: string;
  operator?: "eq" | "neq" | "gt" | "lt" | "gte" | "lte" | "like" | "ilike";
  value: any;
};

type QueryOptions = {
  table: string;
  columns?: string;
  filters?: Filter[];
};

// Fetch a single row from Supabase (server-side)
export async function supabaseSingleRead<T = any>({table,columns = "*",filters = [],}: QueryOptions): Promise<T | null> {
  const supabase = await createClient();
  let query = supabase.from(table).select(columns);

  filters.forEach(({ column, operator = "eq", value }) => {query = query.filter(column, operator, value);});

  const { data, error } = await query.single();
  if (error) throw error;
  return data as T;
}

// Fetch a list of rows from Supabase (server-side)
export async function supabaseListRead<T = any>({table,columns = "*",filters = [],}: QueryOptions): Promise<T[]> {
  const supabase = await createClient();
  let query = supabase.from(table).select(columns);

  filters.forEach(({ column, operator = "eq", value }) => {query = query.filter(column, operator, value);});

  const { data, error } = await query;
  if (error) throw error;
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

  if (error) throw error;
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

  if (error) throw error;
}

// Utility function to fetch and map options for select, radio, or checkbox inputs
// Example usage:
//   const options = await fetchOptions<string, string>("eq_rms_quarters", "quarter", "quarter");
//   first argument is table name, second is value column, third is label column
export async function fetchOptions<T, U>(
  table: string,
  valueColumn: string,
  labelColumn: string
): Promise<{ value: T; label: U }[]> {
  const data = await supabaseListRead({
    table,
    columns: `${valueColumn}, ${labelColumn}`,
    filters: [
      { column: valueColumn, operator: "neq", value: null },
      { column: labelColumn, operator: "neq", value: null }
    ]
  });

  return data.map((item: Record<string, any>) => ({
    value: item[valueColumn] as T,
    label: item[labelColumn] as U,
  }));
}
