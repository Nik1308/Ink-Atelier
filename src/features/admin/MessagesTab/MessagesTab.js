import React, { useState, useMemo } from 'react';
import DateRangeSelector from '../../common/ui/DateRangeSelector';
import Table from '../../common/ui/Table';
import { getCustomerName, getCustomerPhone } from '../../../utils/customerUtils';
import { startOfDay, endOfDay, isWithinInterval, isSameDay } from 'date-fns';

const MessagesTab = ({ payments, advancePayments, customers }) => {
  const [dateRange, setDateRange] = useState([
    {
      startDate: startOfDay(new Date()),
      endDate: endOfDay(new Date()),
      key: 'selection',
    },
  ]);

  // Combine and filter payments by date
  const filteredMessages = useMemo(() => {
    const { startDate, endDate } = dateRange[0];
    const all = [
      ...(payments || []),
      ...(advancePayments || []),
    ];
    return all.filter((p) => {
      const d = new Date(p.payment_date || p.created_at);
      return (
        isWithinInterval(d, { start: startOfDay(startDate), end: endOfDay(endDate) }) ||
        isSameDay(d, startDate) ||
        isSameDay(d, endDate)
      );
    });
  }, [payments, advancePayments, dateRange]);

  const columns = [
    { header: 'Customer Name', accessor: 'customer_id', render: (msg) => getCustomerName(customers, msg.customer_id) },
    { header: 'Phone', accessor: 'customer_id', render: (msg) => getCustomerPhone(customers, msg.customer_id) },
  ];

  return (
    <div className="space-y-8">
      {/* Date Range Selector */}
      <DateRangeSelector dateRange={dateRange} setDateRange={setDateRange} />

      {/* Messages Table */}
      <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
        <Table columns={columns} data={filteredMessages} emptyState="No messages found for selected range." />
      </div>
    </div>
  );
};

export default MessagesTab; 