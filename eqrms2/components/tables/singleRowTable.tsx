// SimpleTable.tsx

/**
 * SimpleTable Component
 * 
 * Usage:
 * 
 * <SimpleTable 
 *   headers={[
 *     { label: 'Quality Rating' },
 *     { label: 'MT Growth' },
 *     { label: 'Market Momentum' },
 *     { label: 'Stock Score' }
 *   ]}
 *   body={[
 *     { value: 'High' },
 *     { value: 'V Low', className: 'bg-red-100' },
 *     { value: 'V Low', className: 'bg-red-100' },
 *     { value: '3', className: 'bg-yellow-300' }
 *   ]}
 * />
 * 
 * Props:
 * - headers: Array of objects with 'label' and optional 'className' for each header cell.
 * - body: Array of objects with 'value' and optional 'className' for each body cell.
 */

import React from 'react';

type SimpleTableProps = {
  headers: { label: string; className?: string }[];
  body: { value: string | number | React.ReactNode; className?: string }[]; // Allow both string and number types in body
};

const SimpleTable: React.FC<SimpleTableProps> = ({ headers, body }) => {
  return (
    <table className="w-full table-fixed">
      <thead>
        <tr className="bg-gray-100 text-gray-500 text-xs">
          {headers.map((header, index) => (
            <th key={index} className={`p-1 ${header.className || ''}`}>
              {header.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {body.map((cell, index) => (
            <td key={index} className={`p-2 text-center ${cell.className || ''}`}>
              {cell.value}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
};

export default SimpleTable;
