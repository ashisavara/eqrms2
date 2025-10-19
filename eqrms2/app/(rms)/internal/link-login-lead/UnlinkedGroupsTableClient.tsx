'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { getUnlinkedClientGroups } from '@/lib/supabase/serverQueryHelper';

interface UnlinkedGroup {
  group_id: number;
  group_name: string;
}

interface UnlinkedGroupsTableClientProps {
  data: UnlinkedGroup[];
}

export function UnlinkedGroupsTableClient({ data }: UnlinkedGroupsTableClientProps) {
  const [groups, setGroups] = useState<UnlinkedGroup[]>(data);
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const newData = await getUnlinkedClientGroups();
      setGroups(newData);
    } catch (error) {
      console.error('Error refreshing unlinked groups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">
          Unlinked Client Groups
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-600 mb-4">
          Client groups that have no associated login profiles
        </div>
        
        {groups.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No unlinked client groups found</p>
            <p className="text-sm mt-1">All client groups have associated login profiles</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-medium text-gray-700">Group ID</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-700">Group Name</th>
                </tr>
              </thead>
              <tbody>
                {groups.map((group) => (
                  <tr key={group.group_id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-3 text-sm font-mono">{group.group_id}</td>
                    <td className="py-2 px-3 text-sm">{group.group_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="mt-4 text-xs text-gray-500">
          Total: {groups.length} unlinked group{groups.length !== 1 ? 's' : ''}
        </div>
      </CardContent>
    </Card>
  );
}
