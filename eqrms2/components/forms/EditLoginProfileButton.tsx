'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Pencil } from "lucide-react";
import { EditLoginProfile } from "./EditLoginProfile";
import { EditLoginProfileValues } from "@/types/forms";
import { LoginProfileWithRoles } from "@/app/(rms)/internal/link-login-lead/types";

interface EditLoginProfileButtonProps {
  profile: LoginProfileWithRoles;
  userRoles?: string | null;
  onSuccess?: () => void;
}

export function EditLoginProfileButton({ 
  profile,
  userRoles = 'no_role',
  onSuccess
}: EditLoginProfileButtonProps) {
  const [showEditSheet, setShowEditSheet] = useState(false);

  // Map profile data to EditLoginProfileValues format
  // The view returns all columns, so we can access them even if not in the type
  const initialData: EditLoginProfileValues = {
    first_name: (profile as any).first_name || '',
    last_name: (profile as any).last_name || '',
    email: (profile as any).email || '',
    client_confirmation: (profile as any).client_confirmation || false,
    finacial_pdts_invested_in: (profile as any).finacial_pdts_invested_in || [],
    existing_advisor: (profile as any).existing_advisor || false,
    existing_financial_plan: (profile as any).existing_financial_plan || false,
    existing_inv_mandate: (profile as any).existing_inv_mandate || false,
    net_worth: (profile as any).net_worth || '',
    hear_ime_capital: (profile as any).hear_ime_capital || '',
    internal_notes: (profile as any).internal_notes || null,
  };

  const handleSuccess = () => {
    setShowEditSheet(false);
    onSuccess?.();
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowEditSheet(true)}
        className="h-6 w-6 p-0"
        title="Edit login profile"
      >
        <Pencil className="h-4 w-4" />
      </Button>

      {/* Edit Sheet */}
      {showEditSheet && (
        <Sheet open={true} onOpenChange={() => setShowEditSheet(false)}>
          <SheetContent className="!w-400px md:!w-650px !max-w-[90vw] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Edit Login Profile</SheetTitle>
            </SheetHeader>
            <div className="mt-4 p-6">
              <EditLoginProfile
                initialData={initialData}
                uuid={profile.uuid}
                userRoles={userRoles}
                onSuccess={handleSuccess}
                skipLogout={true}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
