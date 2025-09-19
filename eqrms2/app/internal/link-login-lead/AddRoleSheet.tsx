'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ToggleGroupInput } from '@/components/forms/FormFields';
import { toast, Toaster } from 'sonner';
import { LoginProfileWithoutRoles } from './types';
import { MASTER_OPTIONS } from '@/lib/constants';
import { supabaseInsertRow } from '@/lib/supabase/serverQueryHelper';

interface AddRoleFormData {
  user_role_name_id: number;
}

interface AddRoleSheetProps {
  profile: LoginProfileWithoutRoles;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddRoleSheet({ profile, isOpen, onClose, onSuccess }: AddRoleSheetProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Convert role options to the format expected by ToggleGroupInput
  const roleOptions = MASTER_OPTIONS.userRoles.map(role => ({
    value: role.id.toString(),
    label: role.name
  }));

  const { control, handleSubmit, reset, watch } = useForm<AddRoleFormData>({
    defaultValues: {
      user_role_name_id: 0
    }
  });

  const selectedRole = watch('user_role_name_id');

  const onSubmit = handleSubmit(async (data) => {
    if (!data.user_role_name_id) {
      toast.error('Please select a role');
      return;
    }

    setIsLoading(true);
    try {
      await supabaseInsertRow('acl_user_roles', {
        user_uuid: profile.uuid,
        user_role_name_id: data.user_role_name_id
      });

      toast.success('Role added successfully!');
      onSuccess();
      onClose();
      reset();
    } catch (error) {
      console.error('Error adding role:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add role');
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="!w-600px !max-w-[90vw] p-6">
        <SheetHeader>
          <SheetTitle>Add Role to User</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <Toaster position="top-center" />
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Phone:</strong> {profile.phone_number}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                <strong>Name:</strong> {profile.lead_name || 'Not set'}
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <ToggleGroupInput 
                  name="user_role_name_id" 
                  label="Select Role" 
                  control={control} 
                  options={roleOptions} 
                  valueType="number" 
                  itemClassName="ime-choice-chips" 
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isLoading || !selectedRole || selectedRole === 0}>
                  {isLoading ? 'Adding...' : 'Add Role'}
                </Button>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
