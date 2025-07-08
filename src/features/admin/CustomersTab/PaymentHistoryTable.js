import React from 'react';
import Table from '../../common/ui/Table';

const PaymentHistoryTable = ({ payments }) => {
  const columns = [
    { header: 'Date', accessor: 'payment_date', render: (p) => p.payment_date ? new Date(p.payment_date).toLocaleDateString() : 'N/A', cellClassName: 'text-left', headerClassName: 'text-left', widthClass: 'w-1/4' },
    { header: 'Amount', accessor: 'amount', render: (p) => `₹${parseFloat(p.amount).toLocaleString()}`, cellClassName: 'text-center', headerClassName: 'text-center', widthClass: 'w-1/4' },
    { header: 'Type', accessor: 'payment_type', cellClassName: 'text-center', headerClassName: 'text-center', widthClass: 'w-1/4' },
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