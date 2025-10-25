import { getStaticServerData } from '@/lib/supabase/serverQueryHelper';

interface StaticDataTableProps {
  dataType: string;
  title?: string;
  className?: string;
}

export default async function StaticDataTable({ 
  dataType, 
  title, 
  className = '' 
}: StaticDataTableProps) {
  const data = await getStaticServerData(dataType);
  
  if (!data || data.length === 0) {
    return (
      <div className={`p-4 bg-gray-50 rounded-lg ${className}`}>
        <p className="text-gray-600">No data available at this time.</p>
      </div>
    );
  }

  return (
    <div className={`bg-white border rounded-lg overflow-hidden ${className}`}>
      {title && (
        <div className="bg-gray-50 px-4 py-3 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th
                  key={key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {key.replace(/_/g, ' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row: any, index: number) => (
              <tr key={index}>
                {Object.values(row).map((value: any, cellIndex: number) => (
                  <td
                    key={cellIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
