"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client"; // Make sure this is your browser Supabase client

// This is a component that fetches a single row from a Supabase table and passes it to a child component.
// It takes a table name, a list of columns to fetch, a list of filters to apply, a child component to render the data, and a message to display if no data is found or an error occurs.
// It uses the Supabase client to fetch the data from the Supabase table.
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

export function SupabaseSingleReadClient<T>({
  table,
  columns = "*",
  filters = [],
  children,
  notFoundMessage = "No data found.",
  errorMessage = "Error loading data.",
}: Props<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("SupabaseSingleReadClient rendered");
    useEffect(() => {
        console.log("useEffect running with id:", filters);
        // ...rest of code
      }, [table, columns, JSON.stringify(filters)]);
    const fetchData = async () => {
      const supabase = createClient();
      let query = supabase.from(table).select(columns);
      filters.forEach(({ column, operator = "eq", value }) => {
        query = query.filter(column, operator, value);
      });
      const { data, error } = await query.single();
      console.log("Supabase query result:", { data, error });
      if (error) {
        setError(error);
        setData(null); // Only set null, not error
      } else {
        setData(data as T); // Ensure data is of type T
        setError(null);
      }
      setLoading(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, columns, JSON.stringify(filters)]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{errorMessage}: {error.message}</div>;
  if (!data) return <div>{notFoundMessage}</div>;
  return <>{children(data)}</>;
} 