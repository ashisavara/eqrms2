'use client'; // Keep this as a client component for form validation

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { amcUpdateSchema, AmcUpdateValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResizableTextArea, TextInput, ToggleGroupInput, SelectInput } from "./FormFields";
import { toast, Toaster } from "sonner";
import { supabaseUpdateRow } from "@/lib/supabase/serverQueryHelper";
import { useMasterOptions, transformToValueLabel } from "@/lib/contexts/MasterOptionsContext";
import { ImageUpload } from "./ImageUpload";

// Internal form component
function EditAmcForm({ 
  initialData, 
  id,  // Add explicit id prop
  onSuccess
}: { 
  initialData: AmcUpdateValues; 
  id: number;  // Add type for id
  onSuccess?: () => void;
}) {
  // Get options from context (all options available in MasterOptionsContext)
  const masterOptions = useMasterOptions();
  const amcPedigreeOptions = transformToValueLabel(masterOptions.amcPedigreeTag);
  const amcTeamPedigreeOptions = transformToValueLabel(masterOptions.amcTeamPedigreeTag);
  const amcTeamChurnOptions = transformToValueLabel(masterOptions.amcTeamChurnTag);
  const amcMaturityOptions = transformToValueLabel(masterOptions.amcMaturityTag);
  const amcInvPhilosophyDefOptions = transformToValueLabel(masterOptions.amcInvPhilosophyDefTag);
  const router = useRouter();
  // Convert null values to empty strings for form inputs
  const cleanedData: AmcUpdateValues = {
    amc_pedigree: initialData.amc_pedigree ?? "",
    team_pedigree: initialData.team_pedigree ?? "",
    inv_team_risk: initialData.inv_team_risk ?? "",
    amc_maturity: initialData.amc_maturity ?? "",
    inv_phil_name: initialData.inv_phil_name ?? "",
    core_amc_team: initialData.core_amc_team ?? "",
    amc_view: initialData.amc_view ?? "",
    amc_pedigree_desc: initialData.amc_pedigree_desc ?? "",
    team_pedigree_desc: initialData.team_pedigree_desc ?? "",
    salient_points: initialData.salient_points ?? "",
    inv_phil_desc: initialData.inv_phil_desc ?? "",
    inv_philosophy_followed: initialData.inv_philosophy_followed ?? "",
    amc_body: initialData.amc_body ?? "",
    amc_private_body: initialData.amc_private_body ?? ""
  };

  const { control, handleSubmit } = useForm<AmcUpdateValues>({
    defaultValues: cleanedData,
    resolver: zodResolver(amcUpdateSchema),
  });

  const onSubmit = async (data: AmcUpdateValues) => {
    try {
      if (!id) {
        throw new Error('id is required for updates');
      }
      
      await supabaseUpdateRow('rms_amc', 'id', id, data);
      
      if (typeof window !== "undefined") {
        toast.success("AMC updated successfully!");
        setTimeout(() => {
          onSuccess?.();
          router.refresh();
        }, 1500);
      }
    } catch (error) {
      console.error('Error:', error);
      if (typeof window !== "undefined") {
        toast.error("Error updating AMC");
      }
    }
  };

  const ratingOptions = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" }
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full p-4 space-y-4">
      <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />
      
      <ToggleGroupInput 
        name="amc_pedigree" 
        label="AMC Pedigree" 
        control={control} 
        options={amcPedigreeOptions}
        valueType="string"
        toggleGroupClassName="gap-2 flex-wrap"
        itemClassName="ime-choice-chips"
      />
      <ToggleGroupInput 
        name="team_pedigree" 
        label="Team Pedigree" 
        control={control} 
        options={amcTeamPedigreeOptions}
        valueType="string"
        toggleGroupClassName="gap-2 flex-wrap"
        itemClassName="ime-choice-chips"
      />
      <ToggleGroupInput 
        name="inv_team_risk" 
        label="Team Churn" 
        control={control} 
        options={amcTeamChurnOptions}
        valueType="string"
        toggleGroupClassName="gap-2 flex-wrap"
        itemClassName="ime-choice-chips"
      />
      <ToggleGroupInput 
        name="amc_maturity" 
        label="Maturity" 
        control={control} 
        options={amcMaturityOptions}
        valueType="string"
        toggleGroupClassName="gap-2 flex-wrap"
        itemClassName="ime-choice-chips"
      />
      <ToggleGroupInput 
        name="inv_philosophy_followed" 
        label="Inv Philosophy Def" 
        control={control} 
        options={amcInvPhilosophyDefOptions}
        valueType="string"
        toggleGroupClassName="gap-2 flex-wrap"
        itemClassName="ime-choice-chips"
      />
      
      
      <div>
        <ResizableTextArea name="amc_view" label="AMC View" control={control} />
        <ResizableTextArea name="amc_pedigree_desc" label="AMC Pedigree Description" control={control} />
        <ResizableTextArea name="team_pedigree_desc" label="Team Pedigree Description" control={control} />
        <ResizableTextArea name="inv_phil_desc" label="Inv Philosophy Description" control={control} />
        <TextInput name="inv_phil_name" label="Inv Philosophy Name" control={control} />
        <ResizableTextArea name="salient_points" label="Salient Points" control={control} />
        <div><span className="text-sm font-semibold">Img Uploader <br/><ImageUpload /></span></div>
        <ResizableTextArea name="amc_body" label="AMC Body" control={control} />
        <ResizableTextArea name="amc_private_body" label="AMC Private Body" control={control} />
      </div>
      
      <Button type="submit" className="w-full">Update AMC</Button>
    </form>
  );
}

// Main component that exports the button and handles sheet state
export function EditAMCButton({ 
  amcData,
  amcId  // Add explicit amcId prop
}: { 
  amcData: any;
  amcId: number;  // Add explicit amcId prop type
}) {
  const [showEditSheet, setShowEditSheet] = useState(false);

  // Use the explicit amcId prop instead of extracting from amcData
  if (!amcId) {
    console.error('amcId is required but not provided');
  }

  // Convert amc data to AmcUpdateValues format
  const amcUpdateData: AmcUpdateValues = {
    amc_pedigree: amcData.amc_pedigree ?? "",
    team_pedigree: amcData.team_pedigree ?? "",
    inv_team_risk: amcData.inv_team_risk ?? "",
    amc_maturity: amcData.amc_maturity ?? "",
    inv_phil_name: amcData.inv_phil_name ?? "",
    core_amc_team: amcData.core_amc_team ?? "",
    amc_view: amcData.amc_view ?? "",
    amc_pedigree_desc: amcData.amc_pedigree_desc ?? "",
    team_pedigree_desc: amcData.team_pedigree_desc ?? "",
    inv_phil_desc: amcData.inv_phil_desc ?? "",
    salient_points: amcData.salient_points ?? "",
    inv_philosophy_followed: amcData.inv_philosophy_followed ?? "",
    amc_body: amcData.amc_body ?? "",
    amc_private_body: amcData.amc_private_body ?? ""
  };

  return (
    <>
      <span 
        onClick={() => setShowEditSheet(true)}
        className="text-blue-500 hover:text-blue-700 underline cursor-pointer"
      >
          AMC View |
      </span>

      {/* Edit Sheet */}
      {showEditSheet && (
        <Sheet open={true} onOpenChange={() => setShowEditSheet(false)}>
          <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
            <SheetHeader>
              <SheetTitle>Edit Fund Details</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <EditAmcForm
                initialData={amcUpdateData}
                id={amcId}  // Use the explicit amcId prop
                onSuccess={() => setShowEditSheet(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
