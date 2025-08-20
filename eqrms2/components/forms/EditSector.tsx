'use client'; // Keep this as a client component for form validation

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { sectorSchema, SectorValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResizableTextArea, TextInput, ToggleGroupInput } from "./FormFields";
import { toast, Toaster } from "sonner";
import { supabaseUpdateRow } from "@/lib/supabase/serverQueryHelper";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// Internal form component
function EditSectorForm({ 
  initialData, 
  sectorSlug,
  onSuccess
}: { 
  initialData: SectorValues; 
  sectorSlug: string;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  // Convert null values to empty strings for form inputs
  const cleanedData: SectorValues = {
    sector_name: initialData.sector_name ?? "",
    sector_slug: initialData.sector_slug ?? "",
    sector_stance: initialData.sector_stance ?? "",
    mkt_momentum: initialData.mkt_momentum ?? "",
    investment_view: initialData.investment_view ?? "",
    sector_positive_snapshot: initialData.sector_positive_snapshot ?? "",
    sector_negative_snapshot: initialData.sector_negative_snapshot ?? "",
    sector_watch_for_snapshot: initialData.sector_watch_for_snapshot ?? "",
    portfolio_thoughts: initialData.portfolio_thoughts ?? "",
    red_team: initialData.red_team ?? "",
  };

  const { control, handleSubmit } = useForm<SectorValues>({
    defaultValues: cleanedData,
    resolver: zodResolver(sectorSchema),
  });

  const onSubmit = async (data: SectorValues) => {
    try {
      if (!sectorSlug) {
        throw new Error('sector_slug is required for updates');
      }
      
      await supabaseUpdateRow('eq_rms_sectors', 'sector_slug', sectorSlug, data);
      
      if (typeof window !== "undefined") {
        toast.success("Sector updated successfully!");
        setTimeout(() => {
          onSuccess?.();
          router.refresh();
        }, 1500);
      }
    } catch (error) {
      console.error('Error:', error);
      if (typeof window !== "undefined") {
        toast.error("Error updating sector");
      }
    }
  };

  const stanceOptions = [
    { value: "Positive", label: "Positive" },
    { value: "Neutral", label: "Neutral" },
    { value: "Negative", label: "Negative" }
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full p-4 space-y-4">
      <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />
      
      <div className="grid grid-cols-3 gap-4">
        <h3 className="text-2xl font-semibold text-gray-800">{cleanedData.sector_name || ""}</h3>
        <ToggleGroupInput name="sector_stance" label="Sector Stance" control={control} options={stanceOptions} valueType="string" toggleGroupClassName="gap-2 flex-wrap" itemClassName="ime-choice-chips" />
        <ToggleGroupInput name="mkt_momentum" label="Market Momentum" control={control} options={stanceOptions} valueType="string" toggleGroupClassName="gap-2 flex-wrap" itemClassName="ime-choice-chips" />
      </div>

      {/* Snapshot Text Input Fields */}
      <div className="grid grid-cols-3 gap-4">
        <TextInput name="sector_positive_snapshot" label="Sector Positive Snapshot" control={control} />
        <TextInput name="sector_negative_snapshot" label="Sector Negative Snapshot" control={control} />
        <TextInput name="sector_watch_for_snapshot" label="Sector Watch For Snapshot" control={control} />
      </div>
      
      {/* Resizable Text Area Fields */}
      <ResizableTextArea name="investment_view" label="Investment View" control={control} />
      <ResizableTextArea name="portfolio_thoughts" label="Portfolio Thoughts" control={control} />
      <ResizableTextArea name="red_team" label="Red Team" control={control} />
      
      <Button type="submit" className="w-full">Update Sector</Button>
    </form>
  );
}

// Main component that exports the button and handles sheet state
export function EditSectorButton({ 
  sectorData,
  sectorSlug
}: { 
  sectorData: any;
  sectorSlug: string;
}) {
  const [showEditSheet, setShowEditSheet] = useState(false);

  if (!sectorSlug) {
    console.error('sectorSlug is required but not provided');
  }

  // Convert sector data to SectorValues format
  const sectorUpdateData: SectorValues = {
    sector_name: sectorData.sector_name ?? "",
    sector_slug: sectorData.sector_slug ?? "",
    sector_stance: sectorData.sector_stance ?? "",
    mkt_momentum: sectorData.mkt_momentum ?? "",
    investment_view: sectorData.investment_view ?? "",
    sector_positive_snapshot: sectorData.sector_positive_snapshot ?? "",
    sector_negative_snapshot: sectorData.sector_negative_snapshot ?? "",
    sector_watch_for_snapshot: sectorData.sector_watch_for_snapshot ?? "",
    portfolio_thoughts: sectorData.portfolio_thoughts ?? "",
    red_team: sectorData.red_team ?? "",
  };

  return (
    <>
      <span 
        onClick={() => setShowEditSheet(true)}
        className="text-blue-700 font-bold hover:underline cursor-pointer"
      >
        {sectorData.sector_name ? `${sectorData.sector_name}` : 'Edit |'}
      </span>

      {/* Edit Sheet */}
      {showEditSheet && (
        <Sheet open={true} onOpenChange={() => setShowEditSheet(false)}>
          <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
            <SheetHeader>
              <SheetTitle>Edit Sector Details</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <EditSectorForm
                initialData={sectorUpdateData}
                sectorSlug={sectorSlug}
                onSuccess={() => setShowEditSheet(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
