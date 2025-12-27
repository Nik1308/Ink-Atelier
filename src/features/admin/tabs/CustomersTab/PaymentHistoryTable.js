import React from 'react';
import { Table } from '../../../../shared';

const PaymentHistoryTable = ({ payments }) => {
  const columns = [
    { header: 'Date', accessor: 'paymentDate', render: (p) => p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : 'N/A', cellClassName: 'text-left', headerClassName: 'text-left', widthClass: 'w-1/4' },
    { header: 'Amount', accessor: 'amount', render: (p) => `₹${parseFloat(p.amount).toLocaleString()}`, cellClassName: 'text-center', headerClassName: 'text-center', widthClass: 'w-1/4' },
    { header: 'Type', accessor: 'paymentType', cellClassName: 'text-center', headerClassName: 'text-center', widthClass: 'w-1/4' },
    { header: 'Service', accessor: 'service', cellClassName: 'text-right', headerClassName: 'text-right', widthClass: 'w-1/4' },
  ];
  return (
    <Table
      columns={columns}
      data={payments}
      emptyState="No payment history found."
    />
  );
};

export default PaymentHistoryTable; 