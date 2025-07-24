'use client'; // Keep this as a client component for form validation

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { amcUpdateSchema, AmcUpdateValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResizableTextArea, TextInput, ToggleGroupInput, SelectInput } from "./FormFields";
import { toast, Toaster } from "sonner";

// Internal form component
function EditAmcForm({ 
  initialData, 
  id,  // Add explicit id prop
  onSuccess,
  amcPedigreeOptions,
  amcTeamPedigreeOptions,
  amcTeamChurnOptions,
  amcMaturityOptions,
  amcInvPhilosophyDefOptions
}: { 
  initialData: AmcUpdateValues; 
  id: number;  // Add type for id
  onSuccess?: () => void;
  amcPedigreeOptions: { value: string; label: string }[];
  amcTeamPedigreeOptions: { value: string; label: string }[];
  amcTeamChurnOptions: { value: string; label: string }[];
  amcMaturityOptions: { value: string; label: string }[];
  amcInvPhilosophyDefOptions: { value: string; label: string }[];
}) {  
  // Convert null values to empty strings for form inputs
  const cleanedData: AmcUpdateValues = {
    amc_rating: initialData.amc_rating ?? 0,
    amc_pedigree_rating: initialData.amc_pedigree_rating ?? 0,
    amc_team_rating: initialData.amc_team_rating ?? 0,
    amc_philosophy_rating: initialData.amc_philosophy_rating ?? 0,
    amc_size_rating: initialData.amc_size_rating ?? 0,
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
    inv_philosophy_followed: initialData.inv_philosophy_followed ?? ""
  };

  const { control, handleSubmit } = useForm<AmcUpdateValues>({
    defaultValues: cleanedData,
    resolver: zodResolver(amcUpdateSchema),
  });

  const onSubmit = async (data: AmcUpdateValues) => {
    try {
      // Structure the data as the API route expects
      const requestData = {
        id,
        data  // The form data goes in a 'data' property
      };
      
      if (!requestData.id) {
        throw new Error('id is required for updates');
      }
      
      const response = await fetch('/api/update-amc-view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Result:', result);
      
      if (typeof window !== "undefined") {
        toast.success("AMC updated successfully!");
        setTimeout(() => {
          onSuccess?.();
          window.location.reload();
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
      
      {/* Rating Fields with Toggle Groups */}
      <ToggleGroupInput name="amc_rating" label="AMC Rating" control={control} options={ratingOptions} valueType="number" itemClassName="ime-choice-chips" />
      <ToggleGroupInput name="amc_pedigree_rating" label="AMC Pedigree Rating" control={control} options={ratingOptions} valueType="number" itemClassName="ime-choice-chips"  />
      <ToggleGroupInput name="amc_team_rating" label="Team Rating" control={control} options={ratingOptions} valueType="number" itemClassName="ime-choice-chips"  />
      <ToggleGroupInput name="amc_philosophy_rating" label="Philosophy Rating" control={control} options={ratingOptions} valueType="number" itemClassName="ime-choice-chips"  />
      <ToggleGroupInput name="amc_size_rating" label="Size Rating" control={control} options={ratingOptions} valueType="number" itemClassName="ime-choice-chips"  />
      
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
        <ResizableTextArea name="salient_points" label="Salient Points" control={control} />
      </div>
      
      <Button type="submit" className="w-full">Update AMC</Button>
    </form>
  );
}

// Main component that exports the button and handles sheet state
export function EditAMCButton({ 
  amcData,
  amcId,  // Add explicit amcId prop
  amcPedigreeOptions,
  amcTeamPedigreeOptions,
  amcTeamChurnOptions,
  amcMaturityOptions,
  amcInvPhilosophyDefOptions
}: { 
  amcData: any;
  amcId: number;  // Add explicit amcId prop type
  amcPedigreeOptions: { value: string; label: string }[];
  amcTeamPedigreeOptions: { value: string; label: string }[];
  amcTeamChurnOptions: { value: string; label: string }[];
  amcMaturityOptions: { value: string; label: string }[];
  amcInvPhilosophyDefOptions: { value: string; label: string }[];
}) {
  const [showEditSheet, setShowEditSheet] = useState(false);

  // Use the explicit amcId prop instead of extracting from amcData
  if (!amcId) {
    console.error('amcId is required but not provided');
  }

  // Convert amc data to AmcUpdateValues format
  const amcUpdateData: AmcUpdateValues = {
    amc_rating: amcData.amc_rating ?? 0,
    amc_pedigree_rating: amcData.amc_pedigree_rating ?? 0,
    amc_team_rating: amcData.amc_team_rating ?? 0,
    amc_philosophy_rating: amcData.amc_philosophy_rating ?? 0,
    amc_size_rating: amcData.amc_size_rating ?? 0,
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
    inv_philosophy_followed: amcData.inv_philosophy_followed ?? ""
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
                amcPedigreeOptions={amcPedigreeOptions}
                amcTeamPedigreeOptions={amcTeamPedigreeOptions}
                amcTeamChurnOptions={amcTeamChurnOptions}
                amcMaturityOptions={amcMaturityOptions}
                amcInvPhilosophyDefOptions={amcInvPhilosophyDefOptions}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
