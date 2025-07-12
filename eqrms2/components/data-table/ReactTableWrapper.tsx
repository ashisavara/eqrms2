"use client"; // ✅ Required if you're using this in a Next.js App Router page

import {
  type Table as TanStackTable, // ✅ TanStack's internal Table type (generic)
  flexRender, // ✅ Helper to render headers and cells dynamically
} from "@tanstack/react-table";

// ✅ This is the reusable table component you can call from any page.
//    It receives a TanStack `table` instance and renders a complete <table>.
interface BasicTableProps<TData> {
  table: TanStackTable<TData>; // The `table` instance returned by useReactTable()
  className?: string;          // Optional Tailwind classes
  emptyText?: string;          // Custom message if there are no rows
}

export function ReactTableWrapper<TData>({
  table,
  className = "",
  emptyText = "No results found.",
}: BasicTableProps<TData>) {
  return (
    <div className={`w-full overflow-auto rounded-md border ${className}`}>
      <table className="min-w-full text-sm text-left">
        {/* ✅ Table Header */}
        <thead className="bg-muted">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  className="px-4 py-2 font-semibold"
                >
                  {/* ✅ flexRender allows dynamic JSX/strings/functions */}
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        {/* ✅ Table Body */}
        <tbody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b hover:bg-muted/50 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2">
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            // ✅ Shown if there's no data (after filtering, for example)
            <tr>
              <td
                colSpan={table.getAllColumns().length}
                className="px-4 py-8 text-center text-muted-foreground"
              >
                {emptyText}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
