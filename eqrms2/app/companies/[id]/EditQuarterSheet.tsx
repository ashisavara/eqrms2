// eqrms2/app/companies/[id]/EditQuarterSheet.tsx
"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { EditQtrNotesForm } from "@/components/forms/EditQtrNotes";
import { CompanyQrtNotesValues } from "@/types/forms";

interface EditQuarterSheetProps {
  data: CompanyQrtNotesValues | null;
  qtrOptions: { value: string; label: string }[];
  resultRatingOptions: { value: string; label: string }[];
  onClose: () => void;
}

export function EditQuarterSheet({ data, qtrOptions, resultRatingOptions, onClose }: EditQuarterSheetProps) {
  if (!data) {
    return null;
  }

  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
        <SheetHeader>
          <SheetTitle>Edit Quarterly Notes</SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
          <EditQtrNotesForm
            initialData={data}
            qtrOptions={qtrOptions}
            resultRatingOptions={resultRatingOptions}
            onSuccess={onClose}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
} 