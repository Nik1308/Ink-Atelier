import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import FormField from '../../forms/FormField';

const COLORS = ['#6366f1', '#f59e42']; // Tattoo, Piercing
const SERVICE_LABELS = { tattoo: 'Tattoo', piercing: 'Piercing' };

function getMonthYear(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

const LedgerTab = ({ payments }) => {
  const [filterType, setFilterType] = useState('all'); // all, month, range
  const [selectedMonth, setSelectedMonth] = useState('');
  const [range, setRange] = useState({ from: '', to: '' });

  // Get all unique months in payments
  const months = useMemo(() => {
    const set = new Set(payments.map(p => getMonthYear(p.payment_date)));
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [payments]);

  // Filter payments
  const filteredPayments = useMemo(() => {
    if (filterType === 'month' && selectedMonth) {
      return payments.filter(p => getMonthYear(p.payment_date) === selectedMonth);
    }
    if (filterType === 'range' && range.from && range.to) {
      const from = new Date(range.from);
      const to = new Date(range.to);
      return payments.filter(p => {
        const d = new Date(p.payment_date);
        return d >= from && d <= to;
      });
    }
    return payments;
  }, [payments, filterType, selectedMonth, range]);

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

  // Table columns: Date, Amount, Type, Service
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:space-x-8 space-y-4 md:space-y-0">
        <div>
          <FormField
            label="Filter By"
            name="filterType"
            type="select"
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            options={[
              { value: 'all', label: 'All' },
              { value: 'month', label: 'Month' },
              { value: 'range', label: 'Custom Range' }
            ]}
            inputClassName="w-full max-w-[200px]"
          />
        </div>
        {filterType === 'month' && (
          <div>
            <FormField
              label="Month"
              name="month"
              type="select"
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              options={months.map(m => ({ value: m, label: m }))}
              inputClassName="w-full max-w-[200px]"
            />
          </div>
        )}
        {filterType === 'range' && (
          <div className="flex space-x-2 items-end">
            <FormField
              label="From"
              name="from"
              type="date"
              value={range.from}
              onChange={e => setRange(r => ({ ...r, from: e.target.value }))}
              inputClassName="w-full max-w-[150px]"
            />
            <FormField
              label="To"
              name="to"
              type="date"
              value={range.to}
              onChange={e => setRange(r => ({ ...r, to: e.target.value }))}
              inputClassName="w-full max-w-[150px]"
            />
          </div>
        )}
      </div>

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
        <h4 className="font-semibold mb-4">Payment Transactions</h4>
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
            {filteredPayments.map((p) => (
              <tr key={p.id}>
                <td className="w-1/4 px-4 py-3 text-left">{p.payment_date ? new Date(p.payment_date).toLocaleDateString() : 'Unknown'}</td>
                <td className="w-1/4 px-4 py-3 text-center">₹{parseFloat(p.amount).toLocaleString()}</td>
                <td className="w-1/4 px-4 py-3 text-center">{p.payment_type}</td>
                <td className="w-1/4 px-4 py-3 text-center">{SERVICE_LABELS[p.service] || p.service || 'N/A'}</td>
              </tr>
            ))}
            {filteredPayments.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-gray-400 py-8">No payments found for selected filter.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LedgerTab; 