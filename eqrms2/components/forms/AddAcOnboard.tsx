'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import { AcOnboardSchema, AcOnboardValues } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput, NumberInput, BooleanToggleInput, SelectInput } from "./FormFields";
import { toast, Toaster } from "sonner";
import { supabaseInsertRow, supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { useRouter } from "next/navigation";

// Internal form component
function AddAcOnboardForm({
  onSuccess, 
  onboardingTypeOptions, 
  groupOptions
}: {
  onSuccess: () => void;
  onboardingTypeOptions: { value: string; label: string }[];
  groupOptions: { value: string; label: string }[];
}) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const defaultData: AcOnboardValues = {
        onboarding_title: "",
        onboarding_type: 0,
        rel_group_id: 0,
        status_internal: "",
        get_customer_info: false,
        ops_check_info: false,
        forms_filled: false,
        sent_for_sig: false,
        form_recieved: false,
        form_processing: false,
        account_opened: false,
        funding_done: false, 
        client_cancellation: false
    };

    const { control, handleSubmit} = useForm<AcOnboardValues>({
        defaultValues: defaultData,
        resolver: zodResolver(AcOnboardSchema)
    });

    const onSubmit = handleSubmit(async (data) => {
        setIsLoading(true);
        try {
            await supabaseInsertRow('account_onboarding', data);
            
            if (typeof window !== "undefined") {
                toast.success("Account Onboarding created successfully!");
                setTimeout(() => {
                    onSuccess?.();
                    router.refresh();
                }, 1500);
            }
        } catch (error) {
            console.error('Error creating Account Onboarding:', error);
            if (typeof window !== "undefined") {
                toast.error("Failed to create Account Onboarding. Please try again.");
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput name="status_client" label="Status Client" control={control} />
                <TextInput name="status_internal" label="Status Internal" control={control} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <BooleanToggleInput name="get_customer_info" label="Get Customer Info" control={control} />
                <BooleanToggleInput name="ops_check_info" label="Ops Check Info" control={control} />
                <BooleanToggleInput name="forms_filled" label="Forms Filled" control={control} />
                <BooleanToggleInput name="sent_for_sig" label="Sent for Signature" control={control} />
                <BooleanToggleInput name="form_recieved" label="Form Received" control={control} />
                <BooleanToggleInput name="form_processing" label="Form Processing" control={control} />
                <BooleanToggleInput name="account_opened" label="Account Opened" control={control} />
                <BooleanToggleInput name="funding_done" label="Funding Done" control={control} />
            </div>
            
            <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Account Onboarding'}
                </Button>
            </div>
        </form>
    );
}

// Main component that exports the button and handles sheet state
export function AddAcOnboardButton() {
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [onboardingTypeOptions, setOnboardingTypeOptions] = useState<{ value: string; label: string }[]>([]);
  const [groupOptions, setGroupOptions] = useState<{ value: string; label: string }[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

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

  return (
    <>
      <Button 
        onClick={() => {
          setShowAddSheet(true);
          fetchOptions();
        }}
        className="bg-blue-500 hover:bg-blue-600 text-white"
      >
        New Ac Onboarding
      </Button>

      {/* Add Sheet */}
      {showAddSheet && (
        <Sheet open={true} onOpenChange={() => setShowAddSheet(false)}>
          <SheetContent className="!w-400px md:!w-650px !max-w-[90vw]">
            <SheetHeader>
              <SheetTitle>Create New Account Onboarding</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              {isLoadingOptions ? (
                <div className="p-4 text-center">Loading options...</div>
              ) : (
                <AddAcOnboardForm
                  onSuccess={() => setShowAddSheet(false)}
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
