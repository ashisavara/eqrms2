'use client';

import { useRouter } from 'next/navigation';
import { ProfilesWithoutRolesTable } from './ProfilesWithoutRolesTable';
import { LoginProfileWithoutRoles } from './types';

interface ProfilesWithoutRolesTableClientProps {
  data: LoginProfileWithoutRoles[];
}

export function ProfilesWithoutRolesTableClient({ data }: ProfilesWithoutRolesTableClientProps) {
  const router = useRouter();

  const handleRefresh = () => {
    router.refresh();
  };

  return <ProfilesWithoutRolesTable data={data} onRefresh={handleRefresh} />;
}
