// eqrms2/app/companies/[id]/EditQuarterSheet.tsx
"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CompanyQrtNotesValues } from "@/types/forms";

interface EditQuarterSheetProps {
  data: CompanyQrtNotesValues | null;
  onClose: () => void;
}

export function EditQuarterSheet({ data, onClose }: EditQuarterSheetProps) {
  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Quarter</SheetTitle>
        </SheetHeader>
        <div className="p-4">
          <p>Edit quarter form placeholder</p>
          {data && (
            <div className="mt-4">
              <p><strong>Quarter:</strong> {data.qtr}</p>
              <p><strong>Rating:</strong> {data.result_rating}</p>
              <p><strong>Company ID:</strong> {data.company_id}</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
} 