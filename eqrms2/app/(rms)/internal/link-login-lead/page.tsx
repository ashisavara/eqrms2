import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { supabaseListRead } from '@/lib/supabase/serverQueryHelper';
import { createClient } from '@/lib/supabase/server';
import { getUserRoles } from '@/lib/auth/getUserRoles';
import { can } from '@/lib/permissions';
import { UnlinkedLoginsTableClient } from './UnlinkedLoginsTableClient';
import { ProfilesWithoutRolesTableClient } from './ProfilesWithoutRolesTableClient';
import { SearchLoginProfilesClient } from './SearchLoginProfilesClient';
import { UnlinkedGroupsData } from './UnlinkedGroupsData';
import { LoginProfile, LoginProfileWithoutRoles } from './types';

// Link Login to Lead functionality

// Server component to fetch unlinked login profiles
async function UnlinkedLoginsData() {
  try {
    // Use the v_unlinked_logins view with correct column names
    const unlinkedLogins = await supabaseListRead<LoginProfile>({
      table: 'v_unlinked_logins',
      columns: 'uuid, phone_number, lead_name, created_at,affiliate_name',
      filters: []
    });

    return <UnlinkedLoginsTableClient data={unlinkedLogins || []} />;
  } catch (error) {
    
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading unlinked login profiles</p>
        <p className="text-sm text-gray-600 mt-1">
          {error instanceof Error ? error.message : 'Unknown error occurred'}
        </p>
        <details className="mt-4 text-xs text-left">
          <summary className="cursor-pointer text-gray-500">Technical Details</summary>
          <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
            {error instanceof Error ? error.stack : JSON.stringify(error, null, 2)}
          </pre>
        </details>
      </div>
    );
  }
}

// Server component to fetch login profiles without roles
async function ProfilesWithoutRolesData() {
  try {
    // Use the v_login_profile_with_roles view and filter for empty user_roles arrays
    const allProfiles = await supabaseListRead<LoginProfileWithoutRoles>({
      table: 'v_login_profile_with_roles',
      columns: 'uuid, phone_number, lead_name, created_at, user_roles, rm_name',
      filters: []
    });

    // Filter for profiles with empty user_roles arrays
    const profilesWithoutRoles = allProfiles.filter(profile => 
      !profile.user_roles || profile.user_roles.length === 0
    );

    return <ProfilesWithoutRolesTableClient data={profilesWithoutRoles || []} />;
  } catch (error) {
    
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading profiles without roles</p>
        <p className="text-sm text-gray-600 mt-1">
          {error instanceof Error ? error.message : 'Unknown error occurred'}
        </p>
        <details className="mt-4 text-xs text-left">
          <summary className="cursor-pointer text-gray-500">Technical Details</summary>
          <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
            {error instanceof Error ? error.stack : JSON.stringify(error, null, 2)}
          </pre>
        </details>
      </div>
    );
  }
}

export default async function LinkLoginLeadPage() {
  const userRoles = await getUserRoles();
  
  // Check permission first
  if (!can(userRoles, 'internal', 'link_login_lead')) {
    redirect('/uservalidation'); // or wherever you want to send them
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Link Login to Lead</h1>
        <p className="helper-text">
          TYPES: (a) LOGIN PROFILE: a number that allows used to login (b) ROLES: every login needs to be associated to a particular role. This determines access control (c) CRM: Whether they already exist in CRM (d) CLIENT GROUP: groups investments, mandates, risk-profiling 
          FUNCTIONALITY TO WORK: LOGIN PROFILE needs to be linked to a role (otherwise will be guest with limited capabilities) and linked to a group (to see investments, mandates etc)
          VIEWS BELOW: (a) Search Login Profile - can search for specific person (b) Unlinked Login Profile - login created but not linked in the CRM (c) Login profiles without roles - people who have no roles (d) Unlinked Client Groups - client groups with no associated login profiles
        </p>
      </div>

      <div className="space-y-8">
        {/* Search Login Profiles */}
        <SearchLoginProfilesClient />

        {/* Unlinked Login Profiles Table */}
        <Suspense 
          fallback={
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Loading unlinked login profiles...</p>
              </div>
            </div>
          }
        >
          <UnlinkedLoginsData />
        </Suspense>

        {/* Login Profiles Without Roles Table */}
        <Suspense 
          fallback={
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Loading profiles without roles...</p>
              </div>
            </div>
          }
        >
          <ProfilesWithoutRolesData />
        </Suspense>

        {/* Unlinked Client Groups Table */}
        <Suspense 
          fallback={
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Loading unlinked client groups...</p>
              </div>
            </div>
          }
        >
          <UnlinkedGroupsData />
        </Suspense>
      </div>
    </div>
  );
}
