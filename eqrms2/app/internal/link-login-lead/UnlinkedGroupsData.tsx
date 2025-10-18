import { getUnlinkedClientGroups } from '@/lib/supabase/serverQueryHelper';
import { UnlinkedGroupsTableClient } from './UnlinkedGroupsTableClient';

interface UnlinkedGroup {
  group_id: number;
  group_name: string;
}

// Server component to fetch unlinked client groups
export async function UnlinkedGroupsData() {
  try {
    const unlinkedGroups = await getUnlinkedClientGroups();

    return <UnlinkedGroupsTableClient data={unlinkedGroups || []} />;
  } catch (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading unlinked client groups</p>
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
