import React from 'react';
import Table from '../../common/ui/Table';
import { getCustomerName, getCustomerPhone } from '../../../utils/customerUtils';

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
      accessor: 'customer_id',
      cellClassName: 'text-center',
      render: (f) => getCustomerName(customers, f.customer_id),
    },
    {
      header: 'Customer Phone',
      accessor: 'customer_phone',
      cellClassName: 'text-center',
      render: (f) => getCustomerPhone(customers, f.customer_id),
    },
    {
      header: 'Date',
      accessor: 'date',
      cellClassName: 'text-center',
      render: (f) =>
        f.type === 'tattoo'
          ? (f.tattoo_date ? new Date(f.tattoo_date).toLocaleDateString() : 'N/A')
          : (f.piercing_date ? new Date(f.piercing_date).toLocaleDateString() : 'N/A'),
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