import { Suspense } from 'react';
import { supabaseListRead } from '@/lib/supabase/serverQueryHelper';
import { createClient } from '@/lib/supabase/server';
import { UnlinkedLoginsTableClient } from './UnlinkedLoginsTableClient';
import { LoginProfile } from './types';

// Link Login to Lead functionality

// Server component to fetch unlinked login profiles
async function UnlinkedLoginsData() {
  try {
    console.log('Attempting to fetch unlinked login profiles...');
    
    // Use the v_unlinked_logins view with correct column names
    const unlinkedLogins = await supabaseListRead<LoginProfile>({
      table: 'v_unlinked_logins',
      columns: 'uuid, phone_number, lead_name, created_at',
      filters: []
    });

    console.log('Successfully fetched unlinked logins:', unlinkedLogins?.length || 0, 'records');
    return <UnlinkedLoginsTableClient data={unlinkedLogins || []} />;
  } catch (error) {
    console.error('Detailed error fetching unlinked logins:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
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

export default function LinkLoginLeadPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Link Login to Lead</h1>
        <p className="text-gray-600 mt-2">
          Manage unlinked login profiles and connect them to existing leads in the system.
        </p>
      </div>

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
    </div>
  );
}
