import { supabaseSingleRead } from "@/lib/supabase/serverQueryHelper";
import React from "react";

// This is a component that fetches a single row from a Supabase table and passes it to a child component.
// It takes a table name, a list of columns to fetch, a list of filters to apply, a child component to render the data, and a message to display if no data is found or an error occurs.
// It uses the supabaseSingleRead function to fetch the data from the Supabase table.
// It returns the child component with the data passed to it.
// It also displays an error message if an error occurs.
type Props<T> = {
  table: string;
  columns?: string;
  filters?: any[];
  children: (data: T) => React.ReactNode;
  notFoundMessage?: string;
  errorMessage?: string;
};

export async function SupabaseSingleResource<T>({table,columns = "*",filters = [],children,notFoundMessage = "No data found.",errorMessage = "Error loading data.",}: Props<T>) {
  let data: T | null = null;
  let error: any = null;
  try {
    data = await supabaseSingleRead<T>({ table, columns, filters });
  } catch (e) {
    error = e;
  }

  if (error) return <div>{errorMessage}: {error.message}</div>;
  if (!data) return <div>{notFoundMessage}</div>;
  return <>{children(data)}</>;
} 