import React from 'react';
import { Table } from '../../../../shared';
import { getCustomerName, getCustomerPhone } from '../../../../shared/utils/customer';

const ConsentFormsTable = ({ forms, customers = [], onDownload, downloading, onViewDetails, currentPage = 1, onPageChange, totalItems, itemsPerPage = 10 }) => {
  const columns = React.useMemo(() => [
    {
      header: 'Type',
      accessor: 'type',
      cellClassName: 'text-left',
      render: (f) => (
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${f.type === 'tattoo' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
          {f.type === 'tattoo' ? 'Tattoo' : 'Piercing'}
        </span>
      ),
    },
    {
      header: 'Customer Name',
      accessor: 'customerId',
      cellClassName: 'text-center',
      render: (f) => getCustomerName(customers, f.customerId),
    },
    {
      header: 'Customer Phone',
      accessor: 'customerPhone',
      cellClassName: 'text-center',
      render: (f) => getCustomerPhone(customers, f.customerId),
    },
    {
      header: 'Date',
      accessor: 'date',
      cellClassName: 'text-center',
      render: (f) =>
        f.type === 'tattoo'
          ? (f.tattooDate ? new Date(f.tattooDate).toLocaleDateString() : 'N/A')
          : (f.piercingDate ? new Date(f.piercingDate).toLocaleDateString() : 'N/A'),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cellClassName: 'text-right',
      render: (f) => (
        <div className="flex flex-col gap-1 items-end">
          <button
            className="text-blue-600 underline text-sm"
            onClick={() => onViewDetails(f)}
          >
            View Details
          </button>
        </div>
      ),
    },
  ], [customers, onViewDetails]);

  return (
    <Table
      key={`all-consents-table-${currentPage}`}
      keyPrefix="all-consents-row"
      columns={columns}
      data={forms}
      emptyState="No consent forms found for selected range."
    />
  );
};

export default ConsentFormsTable; 