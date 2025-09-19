'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { toast, Toaster } from 'sonner';
import { UserRole } from './types';
import { supabaseDeleteRow } from '@/lib/supabase/serverQueryHelper';

interface DeleteRoleConfirmationProps {
  profileUuid: string;
  role: UserRole;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteRoleConfirmation({ 
  profileUuid, 
  role, 
  isOpen, 
  onClose, 
  onSuccess 
}: DeleteRoleConfirmationProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await supabaseDeleteRow('acl_user_roles', 'user_uuid', profileUuid, {
        user_role_name_id: role.role_id
      });

      toast.success('Role deleted successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error deleting role:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete role');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="!w-500px !max-w-[90vw] p-6">
        <SheetHeader>
          <SheetTitle>Delete Role</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <Toaster position="top-center" />
          
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium mb-2">Are you sure you want to delete this role?</p>
              <p className="text-red-700 text-sm">
                <strong>Role:</strong> {role.role_name}
              </p>
              <p className="text-red-600 text-xs mt-2">
                This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Delete Role'}
              </Button>
              <Button 
                variant="outline" 
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
