'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { EditLoginProfileButton } from '@/components/forms/EditLoginProfileButton';
import { EditLoginRoleButton } from '@/components/forms/EditLoginRole';
import { LinkLoginProfileGroupButton } from '@/components/forms/LinkLoginProfileGroup';
import { UpdateGroupNameButton } from '@/components/forms/UpdateGroupName';
import { LoginProfileWithRoles } from './types';

interface UnvalidatedAccountsTableClientProps {
  data: LoginProfileWithRoles[];
  userRoles?: string | null;
}

export function UnvalidatedAccountsTableClient({ data, userRoles }: UnvalidatedAccountsTableClientProps) {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data.filter((p) =>
      (p.lead_name ?? '').toLowerCase().includes(q)
    );
  }, [data, search]);

  const handleRefresh = () => router.refresh();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by client name..."
          className="max-w-xs"
        />
        <span className="text-sm text-gray-500">{filtered.length} record{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Phone Number</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Lead Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">User Role</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Lead ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">CRM Lead Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">RM Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Group ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Group Name</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-gray-500 italic">
                  No unvalidated accounts found.
                </td>
              </tr>
            ) : (
              filtered.map((profile) => (
                <tr key={profile.uuid} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      {profile.phone_number}
                      <EditLoginProfileButton
                        profile={profile}
                        userRoles={userRoles}
                        onSuccess={handleRefresh}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {profile.lead_name || <span className="text-gray-400 italic">Not set</span>}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      {profile.user_role_name ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {profile.user_role_name}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic text-xs">No role</span>
                      )}
                      <EditLoginRoleButton
                        uuid={profile.uuid}
                        initialRoleId={profile.user_role_name_id}
                        initialExpiresOn={profile.expires_on}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {profile.lead_id || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {profile.crm_lead_name && profile.lead_id ? (
                      <a
                        href={`/crm/${profile.lead_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {profile.crm_lead_name}
                      </a>
                    ) : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {profile.rm_name || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {profile.group_id || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {profile.group_id && profile.group_name ? (
                      <UpdateGroupNameButton
                        groupId={profile.group_id}
                        currentGroupName={profile.group_name}
                      >
                        {profile.group_name}
                      </UpdateGroupNameButton>
                    ) : (
                      <LinkLoginProfileGroupButton uuid={profile.uuid} />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
