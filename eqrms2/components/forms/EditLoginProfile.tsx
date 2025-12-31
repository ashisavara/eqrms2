'use client';

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TextInput, SwitchInput, MultiToggleGroupInput, ToggleGroupInput } from "./FormFields";
import { toast } from "sonner";
import { EditLoginProfileSchema, EditLoginProfileValues, EditLoginProfileUpdatePayload } from "@/types/forms";
import { MASTER_OPTIONS } from "@/lib/constants";
import { supabaseUpdateRow } from "@/lib/supabase/serverQueryHelper";
import { logoutServerAction } from "@/app/(rms)/app/otpServerActions";
import { can } from '@/lib/permissions';

interface EditLoginProfileProps {
  initialData?: EditLoginProfileValues | null;
  uuid?: string;
  onSuccess?: () => void;
  userRoles?: string | null;
  skipLogout?: boolean;
}

export function EditLoginProfile({ 
  initialData, 
  uuid,
  onSuccess,
  userRoles = 'no_role',
  skipLogout = false
}: EditLoginProfileProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Convert options to value-label format
  const financialProductsOptions = MASTER_OPTIONS.financialProductsInvestedIn.map(product => ({
    value: product,
    label: product
  }));

  const netWorthOptions = MASTER_OPTIONS.netWorth.map(worth => ({
    value: worth,
    label: worth
  }));

  const hearImeCapitalOptions = MASTER_OPTIONS.hearImeCapital.map(source => ({
    value: source,
    label: source
  }));

  // Default values
  const defaultValues: EditLoginProfileValues = {
    first_name: "",
    last_name: "",
    email: "",
    client_confirmation: false,
    finacial_pdts_invested_in: [],
    existing_advisor: false,
    existing_financial_plan: false,
    existing_inv_mandate: false,
    net_worth: "",
    hear_ime_capital: "",
    internal_notes: null,
  };

  const { control, handleSubmit, reset } = useForm<EditLoginProfileValues>({
    resolver: zodResolver(EditLoginProfileSchema),
    defaultValues: initialData || defaultValues,
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmit = handleSubmit(async (data) => {
    if (!uuid) {
      toast.error('UUID is required for updates');
      return;
    }

    setIsLoading(true);
    try {
      // Calculate user_role_name_id and expires_on based on business logic
      const isNetWorthLessThan50Lakhs = data.net_worth === "0-50 lakhs";
      const hasNotConfirmed = !data.client_confirmation;
      
      let user_role_name_id: number;
      let expires_on: string | null = null;
      let inv_desk_notes: string | null = null;
      
      if (isNetWorthLessThan50Lakhs || hasNotConfirmed) {
        // Set to role 9
        user_role_name_id = 9;
        
        // Build inv_desk_notes with reasons
        const reasons: string[] = [];
        if (isNetWorthLessThan50Lakhs) {
          reasons.push("financial assets less than 50 lakhs");
        }
        if (hasNotConfirmed) {
          reasons.push("did not confirm not a financial advisor and being willing to be contacted");
        }
        inv_desk_notes = reasons.join(" or ");
      } else {
        // Set to role 7 with expiry 15 days from now
        user_role_name_id = 7;
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 15);
        expires_on = expiryDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      }
      
      // Calculate investor_name from first_name + last_name
      const lead_name = `${data.first_name} ${data.last_name}`.trim();
      
      // Prepare update data with form data + calculated fields
      const updateData: EditLoginProfileUpdatePayload = {
        ...data,
        user_role_name_id,
        expires_on,
        inv_desk_notes,
        lead_name,
      };
      
      await supabaseUpdateRow(
        'login_profile',
        'uuid',
        uuid,
        updateData
      );

      // Call RPC function to create group only if user_role_name_id is 7
      if (user_role_name_id === 7) {
        try {
          const rpcResponse = await fetch('/api/create-group-on-validation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              uuid,
              lead_name
            })
          });

          const rpcResult = await rpcResponse.json();

          if (!rpcResponse.ok) {
            console.error('Error creating group:', rpcResult.error);
            // Don't fail the entire submission if group creation fails
            // The user has already updated their profile successfully
          }
        } catch (rpcError) {
          console.error('Error calling create group RPC:', rpcError);
          // Don't fail the entire submission if group creation fails
        }
      }
      
      if (typeof window !== "undefined") {
        if (skipLogout) {
          // For admin/inv_desk editing other users - just show success and call onSuccess
          toast.success("Profile updated successfully!");
          onSuccess?.();
        } else {
          // For users editing their own profile - logout to update JWT with new role
          toast.success(
            "Account submitted successfully! You will be logged out. Please re-login to access your account with updated permissions.",
            {
              duration: 8000, // 8 seconds - longer than default
            }
          );
          
          // Wait a bit longer so user can read the message, then logout and redirect
          setTimeout(async () => {
            try {
              // Logout from Supabase
              await logoutServerAction();
              
              // Redirect to app landing page for re-login
              window.location.href = '/app';
            } catch (error) {
              console.error('Error during logout:', error);
              // Still redirect even if logout fails
              window.location.href = '/app';
            }
          }, 4000); // 4 seconds - gives time to read the message
        }
      }
    } catch (error) {
      console.error('Error updating login profile:', error);
      if (typeof window !== "undefined") {
        toast.error("Failed to update login profile. Please try again.");
      }
      setIsLoading(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-gray-200 pb-6">
        <TextInput 
          name="first_name" 
          label="First Name" 
          control={control} 
          placeholder="Enter first name"
        />

        <TextInput 
          name="last_name" 
          label="Last Name" 
          control={control} 
          placeholder="Enter last name"
        />

        <TextInput 
          name="email" 
          label="Email" 
          control={control} 
          type="email"
          placeholder="Enter email address"
        />
      </div>

      <div className="border-b border-gray-200 pb-6">
        <span className="text-sm font-semibold block mb-4">My Investment Journey till Date</span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SwitchInput 
            name="existing_advisor" 
            label="I have an existing financial advisor" 
            control={control} 
          />

          <SwitchInput 
            name="existing_financial_plan" 
            label="I have built a Financial Plan" 
            control={control} 
          />

          <SwitchInput 
            name="existing_inv_mandate" 
            label="I have built an investment mandate" 
            control={control} 
          />
        </div>
      </div>

      <div className="border-b border-gray-200 pb-6">
      <MultiToggleGroupInput 
        name="finacial_pdts_invested_in" 
        label="I have invested in the following investments (select all that apply)" 
        control={control} 
        options={financialProductsOptions}
        itemClassName="ime-choice-chips"
      />
      </div>

      <div className="border-b border-gray-200 pb-6">
      <ToggleGroupInput 
        name="net_worth" 
        label="My current financial assets are in the following range" 
        control={control} 
        options={netWorthOptions}
        itemClassName="ime-choice-chips"
      />
      </div>

      <div className="border-b border-gray-200 pb-4">

      <ToggleGroupInput 
        name="hear_ime_capital" 
        label="How did you hear about IME Capital?" 
        control={control} 
        options={hearImeCapitalOptions}
        itemClassName="ime-choice-chips"
      />
      </div>

      <SwitchInput 
        name="client_confirmation" 
        label="I confirm that I am not a financial advisor, and I am willing to be contacted by IME to understand their services." 
        control={control} 
      />

      {can(userRoles, 'internal', 'link_login_lead') && (
        <div className="border-b border-gray-200 pb-6">
          <TextInput 
            name="internal_notes" 
            label="Internal Notes" 
            control={control} 
            placeholder="Enter internal notes"
          />
        </div>
      )}

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Activating...' : 'Activate Account'}
        </Button>
      </div>
    </form>
  );
}

