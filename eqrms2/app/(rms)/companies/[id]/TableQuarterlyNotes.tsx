// eqrms2/app/companies/TableValscreen.tsx
"use client";

import { useState } from "react";
import { useReactTable, getCoreRowModel, getPaginationRowModel} from "@tanstack/react-table";
import { ReactTableWrapper } from "@/components/data-table/ReactTableWrapper";
import { columns } from "./columns-qtrlysummary";
import { CompanyQrtNotesValues } from "@/types/forms";

interface TableQuarterlyNotesProps {
  data: CompanyQrtNotesValues[];
  qtrOptions: { value: string; label: string }[];
  resultRatingOptions: { value: string; label: string }[];
  sheetComponent?: React.ComponentType<{
    data: CompanyQrtNotesValues | null, 
    onClose: () => void,
    qtrOptions: { value: string; label: string }[],
    resultRatingOptions: { value: string; label: string }[]
  }>;
}

export function TableQuarterlyNotes({ data, qtrOptions, resultRatingOptions, sheetComponent: SheetComponent }: TableQuarterlyNotesProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<CompanyQrtNotesValues | null>(null);

  const handleQuarterClick = (quarterData: CompanyQrtNotesValues) => {
    setSelectedData(quarterData);
    setIsSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    setSelectedData(null);
  };

  const table = useReactTable({
    data,
    columns: columns(handleQuarterClick),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // Enable pagination
    initialState: {
      pagination: {
        pageSize: 10, // Set default page size
      },
    },
  });

  return (
    <>
      <ReactTableWrapper className="w-full" table={table} showSearch={false} />
      {isSheetOpen && SheetComponent && (
        <SheetComponent 
          data={selectedData} 
          onClose={handleCloseSheet}
          qtrOptions={qtrOptions}
          resultRatingOptions={resultRatingOptions}
        />
      )}
    </>
  );
}
