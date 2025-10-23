import React from 'react';
import Link from 'next/link';

// Type definition for fund performance data
export interface FundPerformanceData {
  fund_name: string | null;
  one_yr: number | null;
  three_yr: number | null;
  five_yr: number | null;
  slug: string | null;
}

interface FundPerformanceTableProps {
  data: FundPerformanceData[];
  className?: string;
}

const FundPerformanceTable: React.FC<FundPerformanceTableProps> = ({ data, className = '' }) => {
  // Helper function to format performance numbers
  const formatPerformance = (value: number | null): string => {
    if (value === null || value === undefined) return '-';
    return `${value}%`;
  };

  // Helper function to add color classes based on performance
  const getPerformanceClass = (value: number | null): string => {
    if (value === null || value === undefined) return 'text-gray-500';
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-500';
  };

  return (
    <div className={`overflow-x-auto ${className}`}>
      {/* Desktop Table */}
      <table className="w-full min-w-[600px] border-collapse bg-white shadow-sm rounded-lg overflow-hidden hidden md:table">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Fund Name
            </th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
              1 Year
            </th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
              3 Year
            </th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
              5 Year
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((fund, index) => (
            <tr 
              key={index} 
              className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
              }`}
            >
              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                {fund.slug ? (
                  <Link href={`/pms-scheme/${fund.slug}`} className="blue-hyperlink">
                    {fund.fund_name || '-'}
                  </Link>
                ) : (
                  fund.fund_name || '-'
                )}
              </td>
              <td className={`px-4 py-3 text-sm text-center font-medium ${getPerformanceClass(fund.one_yr)}`}>
                {formatPerformance(fund.one_yr)}
              </td>
              <td className={`px-4 py-3 text-sm text-center font-medium ${getPerformanceClass(fund.three_yr)}`}>
                {formatPerformance(fund.three_yr)}
              </td>
              <td className={`px-4 py-3 text-sm text-center font-medium ${getPerformanceClass(fund.five_yr)}`}>
                {formatPerformance(fund.five_yr)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {data.map((fund, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">
              {fund.slug ? (
                <Link href={`/pms-scheme/${fund.slug}`} className="blue-hyperlink">
                  {fund.fund_name || '-'}
                </Link>
              ) : (
                fund.fund_name || '-'
              )}
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-xs text-gray-500 mb-1">1 Year</div>
                <div className={`text-sm font-medium ${getPerformanceClass(fund.one_yr)}`}>
                  {formatPerformance(fund.one_yr)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">3 Year</div>
                <div className={`text-sm font-medium ${getPerformanceClass(fund.three_yr)}`}>
                  {formatPerformance(fund.three_yr)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">5 Year</div>
                <div className={`text-sm font-medium ${getPerformanceClass(fund.five_yr)}`}>
                  {formatPerformance(fund.five_yr)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No fund performance data available
        </div>
      )}
    </div>
  );
};

export default FundPerformanceTable;
