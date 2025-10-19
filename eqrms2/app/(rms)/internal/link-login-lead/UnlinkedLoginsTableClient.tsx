'use client';

import { useRouter } from 'next/navigation';
import { UnlinkedLoginsTable } from './UnlinkedLoginsTable';
import { LoginProfile } from './types';

interface UnlinkedLoginsTableClientProps {
  data: LoginProfile[];
}

export function UnlinkedLoginsTableClient({ data }: UnlinkedLoginsTableClientProps) {
  const router = useRouter();

  const handleRefresh = () => {
    router.refresh();
  };

  return <UnlinkedLoginsTable data={data} onRefresh={handleRefresh} />;
}
