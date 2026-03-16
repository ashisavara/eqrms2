'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { TextInput, ResizableTextArea, BooleanToggleInput, DatePicker } from "./FormFields";
import { toast, Toaster } from "sonner";
import { supabaseUpdateRow } from "@/lib/supabase/serverQueryHelper";
import { toLocalDateString } from "@/lib/utils";
import { GroupInvestorDetail } from "@/types/group-investor-detail";
import { Pencil } from "lucide-react";

type KycFormValues = GroupInvestorDetail;

function EditGroupInvestorKycForm({
  initialData,
  id,
  onSuccess,
}: {
  initialData: KycFormValues;
  id: number;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const cleanedData: KycFormValues = {
    ...initialData,
    stamp_date: initialData.stamp_date ? new Date(initialData.stamp_date) : (null as any),
    created_at: initialData.created_at ? new Date(initialData.created_at) : initialData.created_at,
  };

  const { control, handleSubmit } = useForm<KycFormValues>({
    defaultValues: cleanedData,
  });

  const onSubmit = async (data: KycFormValues) => {
    setIsLoading(true);
    try {
      const payload = {
        investor_name: data.investor_name,
        investor_type: data.investor_type,
        kyc_status: data.kyc_status,
        kra: data.kra,
        drive_link: data.drive_link,
        mf_ready: data.mf_ready,
        pms_ready: data.pms_ready,
        aif_ready: data.aif_ready,
        kristal_ready: data.kristal_ready,
        client_name_pan: data.client_name_pan,
        pan_available_bool: data.pan_available_bool,
        pan_number: data.pan_number,
        reg_email: data.reg_email,
        phone_number: data.phone_number,
        marital_status: data.marital_status,
        gender: data.gender,
        networth: data.networth,
        annual_income: data.annual_income,
        wealth_source: data.wealth_source,
        occupation_type: data.occupation_type,
        mother_name: data.mother_name,
        city_birth: data.city_birth,
        country_birth: data.country_birth,
        poa_india_bool: data.poa_india_bool,
        poa_india_type: data.poa_india_type,
        bank_proof_bool: data.bank_proof_bool,
        bank_proof_type: data.bank_proof_type,
        prime_nominee_name: data.prime_nominee_name,
        prime_nominee_id: data.prime_nominee_id,
        prime_nominee_relation: data.prime_nominee_relation,
        poa_overseas_bool: data.poa_overseas_bool,
        poa_overseas_type: data.poa_overseas_type,
        tax_id: data.tax_id,
        tax_id_type: data.tax_id_type,
        visa_bool: data.visa_bool,
        passport_bool: data.passport_bool,
        stamp_bool: data.stamp_bool,
        stamp_date: toLocalDateString(data.stamp_date as any),
        address_details: data.address_details,
        other_nominees: data.other_nominees,
        comments_internal: data.comments_internal,
        comments_client_facing: data.comments_client_facing,
        citizenship_tin_details: data.citizenship_tin_details,
      };

      await supabaseUpdateRow("group_investors", "investor_id", id, payload);

      toast.success("KYC details updated.");
      setTimeout(() => {
        onSuccess?.();
        router.refresh();
      }, 1000);
    } catch (error) {
      console.error("Error updating KYC:", error);
      toast.error("Failed to update KYC details.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full px-4 pt-3 pb-2 text-xs space-y-3">
      <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />

      {/* Core */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <TextInput name="investor_name" label="Investor Name" control={control} />
        <TextInput name="investor_type" label="Investor Type" control={control} />
        <TextInput name="kyc_status" label="KYC Status" control={control} />
        <TextInput name="kra" label="KRA" control={control} />
        <TextInput name="drive_link" label="Drive Link" control={control} />
      </div>

      {/* Ready flags */}
      <div className="grid grid-cols-4 gap-3">
        <BooleanToggleInput name="mf_ready" label="MF Ready" control={control} />
        <BooleanToggleInput name="pms_ready" label="PMS Ready" control={control} />
        <BooleanToggleInput name="aif_ready" label="AIF Ready" control={control} />
        <BooleanToggleInput name="kristal_ready" label="Kristal Ready" control={control} />
      </div>

      {/* Contact & PAN */}
      <div className="border-t pt-2 grid grid-cols-2 md:grid-cols-3 gap-3">
        <TextInput name="reg_email" label="Registered Email" control={control} />
        <TextInput name="phone_number" label="Phone Number" control={control} />
        <TextInput name="client_name_pan" label="Client Name (PAN)" control={control} />
        <BooleanToggleInput name="pan_available_bool" label="PAN Available" control={control} />
        <TextInput name="pan_number" label="PAN Number" control={control} />
      </div>

      {/* Profile */}
      <div className="border-t pt-2 grid grid-cols-2 md:grid-cols-3 gap-3">
        <TextInput name="marital_status" label="Marital Status" control={control} />
        <TextInput name="gender" label="Gender" control={control} />
        <TextInput name="networth" label="Net Worth" control={control} />
        <TextInput name="annual_income" label="Annual Income" control={control} />
        <TextInput name="wealth_source" label="Wealth Source" control={control} />
        <TextInput name="occupation_type" label="Occupation Type" control={control} />
        <TextInput name="mother_name" label="Mother's Name" control={control} />
        <TextInput name="city_birth" label="City of Birth" control={control} />
        <TextInput name="country_birth" label="Country of Birth" control={control} />
      </div>

      {/* India documentation */}
      <div className="border-t pt-2 grid grid-cols-2 md:grid-cols-4 gap-3">
        <BooleanToggleInput name="poa_india_bool" label="POA India" control={control} />
        <TextInput name="poa_india_type" label="POA India Type" control={control} />
        <BooleanToggleInput name="bank_proof_bool" label="Bank Proof" control={control} />
        <TextInput name="bank_proof_type" label="Bank Proof Type" control={control} />
      </div>

      {/* Nominees */}
      <div className="border-t pt-2 grid grid-cols-2 md:grid-cols-3 gap-3">
        <TextInput name="prime_nominee_name" label="Primary Nominee Name" control={control} />
        <TextInput name="prime_nominee_id" label="Primary Nominee ID" control={control} />
        <TextInput name="prime_nominee_relation" label="Primary Nominee Relation" control={control} />
      </div>
      <ResizableTextArea name="other_nominees" label="Other Nominees" control={control} />

      {/* Overseas / NRI */}
      <div className="border-t pt-2 grid grid-cols-2 md:grid-cols-3 gap-3">
        <BooleanToggleInput name="poa_overseas_bool" label="POA Overseas" control={control} />
        <TextInput name="poa_overseas_type" label="POA Overseas Type" control={control} />
        <TextInput name="tax_id" label="Tax ID" control={control} />
        <TextInput name="tax_id_type" label="Tax ID Type" control={control} />
        <BooleanToggleInput name="visa_bool" label="Visa" control={control} />
        <BooleanToggleInput name="passport_bool" label="Passport" control={control} />
        <BooleanToggleInput name="stamp_bool" label="Stamp" control={control} />
        <DatePicker name="stamp_date" label="Stamp Date" control={control} />
      </div>
      <ResizableTextArea name="address_details" label="Address Details" control={control} />
      <ResizableTextArea name="citizenship_tin_details" label="Citizenship / TIN Details" control={control} />

      {/* Comments */}
      <div className="border-t pt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
        <ResizableTextArea name="comments_internal" label="Comments (Internal)" control={control} />
        <ResizableTextArea name="comments_client_facing" label="Comments (Client-facing)" control={control} />
      </div>

      <Button type="submit" className="w-full mt-2" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save KYC Details"}
      </Button>
    </form>
  );
}

export function EditGroupInvestorKycButton({
  investor,
}: {
  investor: GroupInvestorDetail;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <span
        onClick={() => setOpen(true)}
        className="cursor-pointer inline-flex items-center px-2 py-1 text-[11px] border rounded-sm hover:bg-gray-100 text-white-700 hover:text-blue-700"
      >
        <Pencil className="w-3 h-3 mr-1" />
        Edit KYC
      </span>

      {open && (
        <Sheet open={true} onOpenChange={() => setOpen(false)}>
          <SheetContent className="!w-400px md:!w-700px !max-w-[95vw]">
            <SheetHeader>
              <SheetTitle className="text-sm">Edit KYC – {investor.investor_name}</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-90px)]">
              <EditGroupInvestorKycForm
                initialData={investor}
                id={investor.investor_id}
                onSuccess={() => setOpen(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}

