// components/SupabaseListResource.tsx
import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import React from "react";

type Props<T> = {
  table: string;
  columns?: string;
  filters?: any[];
  children: (data: T[]) => React.ReactNode;
  emptyMessage?: string;
  errorMessage?: string;
};

export async function SupabaseListResource<T>({table,columns = "*",filters = [],children,emptyMessage = "No data found.",errorMessage = "Error loading data.",}: Props<T>) {
  let data: T[] = [];
  let error: any = null;
  try {
    data = await supabaseListRead<T>({ table, columns, filters });
  } catch (e) {
    error = e;
  }

  if (error) return <div>{errorMessage}: {error.message}</div>;
  if (!data.length) return <div>{emptyMessage}</div>;
  return <>{children(data)}</>;
}