import React from 'react';
import Table from '../../common/ui/Table';

const ConsentFormsTable = ({ forms, customers = [], onDownload, downloading, onViewDetails, showCustomerPhone = false }) => {
  const columns = [
    { header: 'Date', accessor: 'created_at', render: (f) => f.created_at ? new Date(f.created_at).toLocaleDateString() : 'N/A' },
    { header: 'Type', accessor: 'type', render: (f) => f.type ? f.type.charAt(0).toUpperCase() + f.type.slice(1) : 'N/A' },
    { header: 'Customer', accessor: 'customer_id', render: (f) => customers.find(c => c.id === f.customer_id)?.name || 'N/A' },
  ];
  if (showCustomerPhone) {
    columns.push({ header: 'Phone', accessor: 'customer_id', render: (f) => customers.find(c => c.id === f.customer_id)?.phone || 'N/A' });
  }
  columns.push({
    header: 'Actions',
    accessor: 'actions',
    render: (f) => (
      <div className="flex gap-2">
        <button
          className="text-blue-600 underline text-sm"
          onClick={() => onViewDetails(f)}
        >
          View
        </button>
        <button
          className="text-green-600 underline text-sm"
          onClick={() => onDownload(f)}
          disabled={downloading}
        >
          {downloading ? 'Downloading...' : 'Download'}
        </button>
      </div>
    ),
  });

  return (
    <Table
      columns={columns}
      data={forms}
      emptyState="No consent forms found for selected range."
    />
  );
};

export default ConsentFormsTable; 