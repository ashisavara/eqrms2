'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { LoginProfileWithoutRoles } from './types';
import { AddRoleSheet } from './AddRoleSheet';

interface ProfilesWithoutRolesTableProps {
  data: LoginProfileWithoutRoles[];
  onRefresh?: () => void;
}

export function ProfilesWithoutRolesTable({ data, onRefresh }: ProfilesWithoutRolesTableProps) {
  const [addRoleSheet, setAddRoleSheet] = useState<{
    isOpen: boolean;
    profile: LoginProfileWithoutRoles | null;
  }>({ isOpen: false, profile: null });

  const handleAddRole = (profile: LoginProfileWithoutRoles) => {
    setAddRoleSheet({ isOpen: true, profile });
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Login Profiles Without Roles</h2>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Phone Number</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Lead Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">RM Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Created At</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No login profiles without roles found
                </td>
              </tr>
            ) : (
              data.map((profile) => (
                <tr key={profile.uuid} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{profile.phone_number}</td>
                  <td className="px-4 py-3 text-sm">{profile.rm_name}</td>
                  <td className="px-4 py-3 text-sm">
                    {profile.lead_name || (
                      <span className="text-gray-400 italic">Not set</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {formatDate(profile.created_at)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      No Roles
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Button
                      size="sm"
                      onClick={() => handleAddRole(profile)}
                      className="flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      Add Role
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Role Sheet */}
      {addRoleSheet.profile && (
        <AddRoleSheet
          profile={addRoleSheet.profile}
          isOpen={addRoleSheet.isOpen}
          onClose={() => setAddRoleSheet({ isOpen: false, profile: null })}
          onSuccess={() => {
            setAddRoleSheet({ isOpen: false, profile: null });
            onRefresh?.();
          }}
        />
      )}
    </div>
  );
}
