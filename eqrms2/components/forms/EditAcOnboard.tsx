'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import { AcOnboardSchema, AcOnboardValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput, NumberInput, SwitchInput, SelectInput } from "./FormFields";
import { toast, Toaster } from "sonner";
import { supabaseUpdateRow, supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { useRouter } from "next/navigation";

// Internal form component
function EditAcOnboardForm({
  initialData, 
  id, 
  onSuccess, 
  onboardingTypeOptions, 
  groupOptions
}: {
  initialData: AcOnboardValues | null; 
  id: number; 
  onSuccess: () => void;
  onboardingTypeOptions: { value: string; label: string }[];
  groupOptions: { value: string; label: string }[];
}) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const cleanedData: AcOnboardValues = {
        onboarding_title: initialData?.onboarding_title || "",
        onboarding_type: initialData?.onboarding_type || 0,
        rel_group_id: initialData?.rel_group_id || 0,
        status_internal: initialData?.status_internal || "",
        get_customer_info: initialData?.get_customer_info || false,
        ops_check_info: initialData?.ops_check_info || false,
        forms_filled: initialData?.forms_filled || false,
        sent_for_sig: initialData?.sent_for_sig || false,
        form_recieved: initialData?.form_recieved || false,
        form_processing: initialData?.form_processing || false,
        account_opened: initialData?.account_opened || false,
        funding_done: initialData?.funding_done || false,
        client_cancellation: initialData?.client_cancellation || false
    };

    const { control, handleSubmit} = useForm<AcOnboardValues>({
        defaultValues: cleanedData,
        resolver: zodResolver(AcOnboardSchema)
    });

    const onSubmit = handleSubmit(async (data) => {
        setIsLoading(true);
        try {
            await supabaseUpdateRow('account_onboarding', 'id', id, data);
            
            if (typeof window !== "undefined") {
                toast.success("Ac Onboarding updated successfully!");
                setTimeout(() => {
                    onSuccess?.();
                    router.refresh();
                }, 1500);
            }
        } catch (error) {
            console.error('Error updating Ac Onboarding:', error);
            if (typeof window !== "undefined") {
                toast.error("Failed to update Ac Onboarding. Please try again.");
            }
            setIsLoading(false);
        }
    });

    return (
        <form onSubmit={onSubmit} className="w-full p-4 space-y-4">
            <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TextInput name="onboarding_title" label="Onboarding Title" control={control} />
                <SelectInput name="rel_group_id" label="Group" control={control} options={groupOptions} valueType="number" />
                <SelectInput name="onboarding_type" label="Onboarding Type" control={control} options={onboardingTypeOptions} valueType="number" />
            </div>

            <div>
                <TextInput name="status_internal" label="Status Internal" control={control} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <SwitchInput name="get_customer_info" label="Get Customer Info" control={control} />
                <SwitchInput name="ops_check_info" label="Ops Check Info" control={control} />
                <SwitchInput name="forms_filled" label="Forms Filled" control={control} />
                <SwitchInput name="sent_for_sig" label="Sent for Signature" control={control} />
                <SwitchInput name="form_recieved" label="Form Received" control={control} />
                <SwitchInput name="form_processing" label="Form Processing" control={control} />
                <SwitchInput name="account_opened" label="Account Opened" control={control} />
                <SwitchInput name="funding_done" label="Funding Done" control={control} />
                <SwitchInput name="client_cancellation" label="Client Cancellation" control={control} />
            </div>
            

            <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save'}
                </Button>
            </div>
        </form>
    );
}

// Main component that exports the button and handles sheet state
export function EditAcOnboardButton({ 
  AcOnboardingData,
  acOnboardId
}: { 
  AcOnboardingData: any;
  acOnboardId: number;
}) {
  const [showEditSheet, setShowEditSheet] = useState(false);
  const [onboardingTypeOptions, setOnboardingTypeOptions] = useState<{ value: string; label: string }[]>([]);
  const [groupOptions, setGroupOptions] = useState<{ value: string; label: string }[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  if (!acOnboardId) {
    console.error('Asset class data is missing asset_class_id:', AcOnboardingData);
  }

  // Fetch options when sheet opens
  const fetchOptions = async () => {
    if (isLoadingOptions) return;
    
    setIsLoadingOptions(true);
    try {
      // Fetch onboarding type options
      const onboardingTypes = await supabaseListRead({
        table: "ac_onboarding_types",
        columns: "onboarding_type_id, onboarding_type_name"
      });
      
      // Fetch group options
      const groups = await supabaseListRead({
        table: "client_group", 
        columns: "group_id, group_name"
      });

      console.log('Raw onboarding types data:', onboardingTypes);
      console.log('Raw groups data:', groups);

      const processedOnboardingTypes = onboardingTypes
        .filter((type: any) => type.onboarding_type_id != null && type.onboarding_type_name != null)
        .map((type: any) => ({
          value: String(type.onboarding_type_id),
          label: type.onboarding_type_name
        }));

      const processedGroups = groups
        .filter((group: any) => group.group_id != null && group.group_name != null)
        .map((group: any) => ({
          value: String(group.group_id),
          label: group.group_name
        }));
      
      console.log('Processed onboarding types:', processedOnboardingTypes);
      console.log('Processed groups:', processedGroups);
      
      setOnboardingTypeOptions(processedOnboardingTypes);
      setGroupOptions(processedGroups);
    } catch (error) {
      console.error('Error fetching options:', error);
    } finally {
      setIsLoadingOptions(false);
    }
  };

  // Convert category data to AcOnboardValues format
  const AcUpdateData: AcOnboardValues = {
    onboarding_title: AcOnboardingData.onboarding_title ?? "",
    onboarding_type: AcOnboardingData.onboarding_type ?? 0,
    rel_group_id: AcOnboardingData.rel_group_id ?? 0,
    status_internal: AcOnboardingData.status_internal ?? "",
    get_customer_info: AcOnboardingData.get_customer_info ?? false,
    ops_check_info: AcOnboardingData.ops_check_info ?? false,
    forms_filled: AcOnboardingData.forms_filled ?? false,
    sent_for_sig: AcOnboardingData.sent_for_sig ?? false,
    form_recieved: AcOnboardingData.form_recieved ?? false,
    form_processing: AcOnboardingData.form_processing ?? false,
    account_opened: AcOnboardingData.account_opened ?? false,
    funding_done: AcOnboardingData.funding_done ?? false,
    client_cancellation: AcOnboardingData.client_cancellation ?? false
  };

  return (
    <>
      <span 
        onClick={() => {
          setShowEditSheet(true);
          fetchOptions();
        }}
        className="blue-hyperlink"
      >
        {AcUpdateData.onboarding_title || "Edit"}
      </span>

      {/* Edit Sheet */}
      {showEditSheet && (
        <Sheet open={true} onOpenChange={() => setShowEditSheet(false)}>
          <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
            <SheetHeader>
              <SheetTitle>Edit Account Onboarding Details</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              {isLoadingOptions ? (
                <div className="p-4 text-center">Loading options...</div>
              ) : (
                <EditAcOnboardForm
                  initialData={AcUpdateData}
                  id={acOnboardId}
                  onSuccess={() => setShowEditSheet(false)}
                  onboardingTypeOptions={onboardingTypeOptions}
                  groupOptions={groupOptions}
                />
              )}
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}