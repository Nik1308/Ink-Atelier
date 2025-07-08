import React from 'react';

/**
 * columns: [
 *   { header: 'Name', accessor: 'name', render?: (row) => ... },
 *   ...
 * ]
 * data: array of objects
 * emptyState: string or React node
 */
const Table = ({ columns = [], data = [], emptyState = 'No data found.', keyPrefix = 'row' }) => {

  return (
    <table className="min-w-full table-fixed divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {columns.map((col, idx) => (
            <th
              key={col.accessor || idx}
              className={`px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider ${col.headerClassName || col.cellClassName || ''} ${col.widthClass || ''}`}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className="text-center text-gray-400 py-8">{emptyState}</td>
          </tr>
        ) : (
          data.map((row, rowIdx) => (
            <tr key={
              row.id 
                ? `${keyPrefix}-${row.type || 'unknown'}-${row.id}-${rowIdx}` 
                : row.customer_id 
                  ? `${keyPrefix}-${row.type || 'unknown'}-${row.customer_id}-${row.created_at || rowIdx}-${rowIdx}` 
                  : `${keyPrefix}-${row.type || 'unknown'}-${rowIdx}`
            }>
              {columns.map((col, colIdx) => (
                <td key={col.accessor || colIdx} className={`px-4 py-3 ${col.cellClassName || ''} ${col.widthClass || ''}`}>
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default Table; 