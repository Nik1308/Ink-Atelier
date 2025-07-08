import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DateRangeSelector from '../../common/ui/DateRangeSelector';
import usePagination from '../../common/hooks/usePagination';
import { startOfDay, endOfDay, isWithinInterval, isSameDay } from 'date-fns';
import Pagination from '../../common/ui/Pagination';

const COLORS = ['#6366f1', '#f59e42']; // Tattoo, Piercing
const SERVICE_LABELS = { tattoo: 'Tattoo', piercing: 'Piercing' };

const LedgerTab = ({ payments }) => {
  // Date range state
  const [dateRange, setDateRange] = useState([
    {
      startDate: startOfDay(new Date()),
      endDate: endOfDay(new Date()),
      key: 'selection',
    },
  ]);
  const ITEMS_PER_PAGE = 10;

  // Filter payments by selected range
  const filteredPayments = useMemo(() => {
    const { startDate, endDate } = dateRange[0];
    return payments.filter(p => {
      if (!p.payment_date) return false;
      const d = new Date(p.payment_date);
      return isWithinInterval(d, { start: startOfDay(startDate), end: endOfDay(endDate) }) || isSameDay(d, startDate) || isSameDay(d, endDate);
    });
  }, [payments, dateRange]);

  // Pagination
  const {
    paginatedData: paginatedPayments,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
  } = usePagination(filteredPayments, ITEMS_PER_PAGE);

  // Summary stats
  const total = filteredPayments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
  const byService = filteredPayments.reduce((acc, p) => {
    const key = p.service || 'unknown';
    acc[key] = (acc[key] || 0) + (parseFloat(p.amount) || 0);
    return acc;
  }, {});
  const pieData = Object.entries(byService).map(([key, value]) => ({
    name: SERVICE_LABELS[key] || key,
    value
  }));

  return (
    <div className="space-y-8">
      {/* Date Range Selector */}
      <DateRangeSelector dateRange={dateRange} setDateRange={setDateRange} />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-gray-500 text-sm">Total Payments</span>
          <span className="text-2xl font-bold mt-2">₹{total.toLocaleString()}</span>
        </div>
        {Object.entries(byService).map(([key, value]) => (
          <div key={key} className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-gray-500 text-sm">{SERVICE_LABELS[key] || key} Payments</span>
            <span className="text-2xl font-bold mt-2">₹{value.toLocaleString()}</span>
          </div>
        ))}
      </div>

      {/* Pie Chart */}
      <div className="bg-white rounded-xl shadow p-6">
        <h4 className="font-semibold mb-4">Payments by Service</h4>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {pieData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={v => `₹${v.toLocaleString()}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Payment Table */}
      <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
        <h4 className="font-semibold mb-4">
          Payment Transactions
          {totalItems > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({totalItems} transaction{totalItems !== 1 ? 's' : ''})
            </span>
          )}
        </h4>
        <table className="min-w-full table-fixed divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-1/4 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">Date</th>
              <th className="w-1/4 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Amount</th>
              <th className="w-1/4 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Type</th>
              <th className="w-1/4 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Service</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedPayments.map((p) => (
              <tr key={p.id}>
                <td className="w-1/4 px-4 py-3 text-left">{p.payment_date ? new Date(p.payment_date).toLocaleDateString() : 'Unknown'}</td>
                <td className="w-1/4 px-4 py-3 text-center">₹{parseFloat(p.amount).toLocaleString()}</td>
                <td className="w-1/4 px-4 py-3 text-center">{p.payment_type}</td>
                <td className="w-1/4 px-4 py-3 text-center">{SERVICE_LABELS[p.service] || p.service || 'N/A'}</td>
              </tr>
            ))}
            {paginatedPayments.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-gray-400 py-8">No payments found for selected range.</td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={totalItems}
            itemsPerPage={ITEMS_PER_PAGE}
            startIndex={startIndex}
            endIndex={endIndex}
          />
        )}
      </div>
    </div>
  );
};

export default LedgerTab; 