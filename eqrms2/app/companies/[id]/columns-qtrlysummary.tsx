// eqrms2/app/companies/columns-valscreen.ts
import { ColumnDef } from "@tanstack/react-table";
import { CompanyQrtNotesValues } from "@/types/forms";

export const columns = (onQuarterClick: (data: CompanyQrtNotesValues) => void): ColumnDef<CompanyQrtNotesValues>[] => [
  { 
    accessorKey: "qtr", 
    header: "Quarter",
    cell: ({ getValue, row }) => (
      <button
        className="font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 cursor-pointer"
        onClick={() => onQuarterClick(row.original)}
      >
        {getValue() as string}
      </button>
    )
  },
  { 
    accessorKey: "result_rating", 
    header: "Result Rating",
    cell: ({ getValue }) => {
      const rating = getValue() as string;
      const colorClass = rating === "Above" ? "text-green-600 bg-green-50" : 
                        rating === "Below" ? "text-red-600 bg-red-50" : 
                        "text-yellow-600 bg-yellow-50";
      return (
        <span className={`px-2 py-1 rounded font-medium ${colorClass}`}>
          {rating}
        </span>
      );
    }
  },
  { 
    accessorKey: "positive", 
    header: "Positive",
    cell: ({ getValue }) => (
      <div className="text-green-700 text-sm max-w-xs truncate">
        {getValue() as string}
      </div>
    )
  },
  { 
    accessorKey: "negative", 
    header: "Negative",
    cell: ({ getValue }) => (
      <div className="text-red-700 text-sm max-w-xs truncate">
        {getValue() as string}
      </div>
    )
  },
  { 
    accessorKey: "outlook", 
    header: "Outlook",
    cell: ({ getValue }) => (
      <div className="text-orange-700 text-sm max-w-xs truncate">
        {getValue() as string}
      </div>
    )
  },
  { 
    accessorKey: "summary", 
    header: "Summary",
    cell: ({ getValue }) => (
      <div className="text-gray-700 text-sm max-w-sm truncate">
        {getValue() as string}
      </div>
    )
  },
];


