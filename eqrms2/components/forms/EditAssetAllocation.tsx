'use client';

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { NumberInput } from "./FormFields";
import { EditAssetAllocationSchema, EditAssetAllocationValues } from "@/types/forms";
import { supabaseUpdateRow } from "@/lib/supabase/serverQueryHelper";

const allocationFields: { name: keyof EditAssetAllocationValues; label: string }[] = [
  { name: "target_equity_pct", label: "Equity (%)" },
  { name: "target_debt_pct", label: "Debt (%)" },
  { name: "target_hybrid_pct", label: "Hybrid (%)" },
  { name: "target_real_estate_pct", label: "Real Estate (%)" },
  { name: "target_alternatives_pct", label: "Alternatives (%)" },
  { name: "target_global_equity_pct", label: "Global Equity (%)" },
  { name: "target_global_debt_pct", label: "Global Debt (%)" },
  { name: "target_global_alternatives_pct", label: "Global Alternatives (%)" },
];

function getTotal(values: EditAssetAllocationValues) {
  return (
    values.target_equity_pct +
    values.target_debt_pct +
    values.target_hybrid_pct +
    values.target_real_estate_pct +
    values.target_alternatives_pct +
    values.target_global_equity_pct +
    values.target_global_debt_pct +
    values.target_global_alternatives_pct
  );
}

function EditAssetAllocationForm({
  initialData,
  groupId,
  onSuccess,
}: {
  initialData: EditAssetAllocationValues;
  groupId: number;
  onSuccess: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { control, handleSubmit, watch } = useForm<EditAssetAllocationValues>({
    defaultValues: initialData,
    resolver: zodResolver(EditAssetAllocationSchema),
  });

  const watchedValues = watch();
  const total = useMemo(() => getTotal(watchedValues), [watchedValues]);
  const remaining = 100 - total;
  const isValidTotal = total === 100;

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      await supabaseUpdateRow("client_group", "group_id", groupId, data);
      if (typeof window !== "undefined") {
        toast.success("Target asset allocation updated successfully!");
        setTimeout(() => {
          onSuccess();
          router.refresh();
        }, 1200);
      }
    } catch (error) {
      console.error("Error updating target asset allocation:", error);
      if (typeof window !== "undefined") {
        toast.error("Failed to update target asset allocation. Please try again.");
      }
      setIsLoading(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="w-full p-4 space-y-4">
      <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {allocationFields.map((field) => (
          <NumberInput key={field.name} name={field.name} label={field.label} control={control} step="1" min={0} max={100} />
        ))}
      </div>

      <div className="rounded-md border p-3 text-sm">
        <p className="font-semibold">Total Allocated: {total}%</p>
        <p className={remaining === 0 ? "text-green-700" : remaining > 0 ? "text-amber-700" : "text-red-700"}>
          {remaining === 0
            ? "Perfect. Allocation total is exactly 100%."
            : remaining > 0
              ? `${remaining}% left to allocate.`
              : `${Math.abs(remaining)}% over-allocated. Please reduce before saving.`}
        </p>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading || !isValidTotal}>
          {isLoading ? "Saving..." : "Save Asset Allocation"}
        </Button>
      </div>
    </form>
  );
}

export function EditAssetAllocationButton({
  groupId,
  groupData,
}: {
  groupId: number;
  groupData: any;
}) {
  const [open, setOpen] = useState(false);

  const defaults: EditAssetAllocationValues = {
    target_equity_pct: groupData?.target_equity_pct ?? 0,
    target_debt_pct: groupData?.target_debt_pct ?? 0,
    target_hybrid_pct: groupData?.target_hybrid_pct ?? 0,
    target_real_estate_pct: groupData?.target_real_estate_pct ?? 0,
    target_alternatives_pct: groupData?.target_alternatives_pct ?? 0,
    target_global_equity_pct: groupData?.target_global_equity_pct ?? 0,
    target_global_debt_pct: groupData?.target_global_debt_pct ?? 0,
    target_global_alternatives_pct: groupData?.target_global_alternatives_pct ?? 0,
  };

  return (
    <>
      <span onClick={() => setOpen(true)} className="blue-hyperlink">
        Asset Allocation
      </span>
      {open && (
        <Sheet open={true} onOpenChange={() => setOpen(false)}>
          <SheetContent className="!w-400px md:!w-700px !max-w-[92vw]">
            <SheetHeader>
              <SheetTitle>Edit Target Asset Allocation</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <EditAssetAllocationForm initialData={defaults} groupId={groupId} onSuccess={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
