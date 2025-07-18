// eqrms2/app/funds/[slug]/EditFundSheet.tsx
"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { EditFundsForm } from "@/components/forms/EditFunds";
import { FundsUpdateValues } from "@/types/forms";

interface EditFundSheetProps {
  data: FundsUpdateValues | null;
  onClose: () => void;
}

export function EditFundSheet({ data, onClose }: EditFundSheetProps) {
  if (!data) {
    return null;
  }

  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
        <SheetHeader>
          <SheetTitle>Edit Fund Details</SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
          <EditFundsForm
            initialData={data}
            onSuccess={onClose}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
} 