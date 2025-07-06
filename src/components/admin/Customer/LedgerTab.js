import React, { useState, useMemo, useRef } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DateRangePicker, defaultStaticRanges, defaultInputRanges } from 'react-date-range';
import { addDays, subDays, startOfDay, endOfDay, isWithinInterval, isSameDay, format } from 'date-fns';
import { enIN } from 'date-fns/locale';
import { FiCalendar } from 'react-icons/fi';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import FormField from '../../forms/FormField';
import Pagination from '../../common/Pagination';

const COLORS = ['#6366f1', '#f59e42']; // Tattoo, Piercing
const SERVICE_LABELS = { tattoo: 'Tattoo', piercing: 'Piercing' };

function formatRangeLabel(range) {
  const { startDate, endDate } = range;
  if (isSameDay(startDate, endDate)) {
    return format(startDate, 'PPP', { locale: enIN });
  }
  return `${format(startDate, 'PPP', { locale: enIN })} – ${format(endDate, 'PPP', { locale: enIN })}`;
}

const LedgerTab = ({ payments }) => {
  // Date range state
  const [dateRange, setDateRange] = useState([
    {
      startDate: startOfDay(new Date()),
      endDate: endOfDay(new Date()),
      key: 'selection',
    },
  ]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef();
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Click outside to close picker
  React.useEffect(() => {
    function handleClick(e) {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) setPickerOpen(false);
    }
    if (pickerOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [pickerOpen]);

  // Filter payments by selected range
  const filteredPayments = useMemo(() => {
    const { startDate, endDate } = dateRange[0];
    return payments.filter(p => {
      if (!p.payment_date) return false;
      const d = new Date(p.payment_date);
      return isWithinInterval(d, { start: startOfDay(startDate), end: endOfDay(endDate) }) || isSameDay(d, startDate) || isSameDay(d, endDate);
    });
  }, [payments, dateRange]);

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

  // Pagination logic
  const totalItems = filteredPayments.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  React.useEffect(() => {
    setCurrentPage(1);
  }, [dateRange]);
  const paginatedPayments = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredPayments.slice(startIndex, endIndex);
  }, [filteredPayments, currentPage, ITEMS_PER_PAGE]);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);

  // Custom static ranges for quick selection
  const customStaticRanges = [
    {
      label: 'Today',
      range: () => ({
        startDate: startOfDay(new Date()),
        endDate: endOfDay(new Date()),
      }),
      isSelected(range) {
        return isSameDay(range.startDate, startOfDay(new Date())) && isSameDay(range.endDate, endOfDay(new Date()));
      },
    },
    {
      label: 'Yesterday',
      range: () => {
        const y = subDays(new Date(), 1);
        return { startDate: startOfDay(y), endDate: endOfDay(y) };
      },
      isSelected(range) {
        const y = subDays(new Date(), 1);
        return isSameDay(range.startDate, startOfDay(y)) && isSameDay(range.endDate, endOfDay(y));
      },
    },
    {
      label: 'Last 7 days',
      range: () => ({
        startDate: startOfDay(subDays(new Date(), 6)),
        endDate: endOfDay(new Date()),
      }),
      isSelected(range) {
        return (
          isSameDay(range.startDate, startOfDay(subDays(new Date(), 6))) &&
          isSameDay(range.endDate, endOfDay(new Date()))
        );
      },
    },
    {
      label: 'Last 30 days',
      range: () => ({
        startDate: startOfDay(subDays(new Date(), 29)),
        endDate: endOfDay(new Date()),
      }),
      isSelected(range) {
        return (
          isSameDay(range.startDate, startOfDay(subDays(new Date(), 29))) &&
          isSameDay(range.endDate, endOfDay(new Date()))
        );
      },
    },
    {
      label: 'Last 90 days',
      range: () => ({
        startDate: startOfDay(subDays(new Date(), 89)),
        endDate: endOfDay(new Date()),
      }),
      isSelected(range) {
        return (
          isSameDay(range.startDate, startOfDay(subDays(new Date(), 89))) &&
          isSameDay(range.endDate, endOfDay(new Date()))
        );
      },
    },
    {
      label: 'Last 365 days',
      range: () => ({
        startDate: startOfDay(subDays(new Date(), 364)),
        endDate: endOfDay(new Date()),
      }),
      isSelected(range) {
        return (
          isSameDay(range.startDate, startOfDay(subDays(new Date(), 364))) &&
          isSameDay(range.endDate, endOfDay(new Date()))
        );
      },
    },
    {
      label: 'Last Month',
      range: () => {
        const now = new Date();
        const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        return {
          startDate: startOfDay(prevMonth),
          endDate: endOfDay(new Date(now.getFullYear(), now.getMonth(), 0)),
        };
      },
      isSelected(range) {
        return false;
      },
    },
    {
      label: 'Last 12 months',
      range: () => {
        const now = new Date();
        return {
          startDate: startOfDay(subDays(now, 365)),
          endDate: endOfDay(now),
        };
      },
      isSelected(range) {
        return false;
      },
    },
    {
      label: 'Last year',
      range: () => {
        const now = new Date();
        const lastYear = now.getFullYear() - 1;
        return {
          startDate: startOfDay(new Date(lastYear, 0, 1)),
          endDate: endOfDay(new Date(lastYear, 11, 31)),
        };
      },
      isSelected(range) {
        return false;
      },
    },
    {
      label: 'Week to date',
      range: () => {
        const now = new Date();
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
        const weekStart = new Date(now.setDate(diff));
        return {
          startDate: startOfDay(weekStart),
          endDate: endOfDay(new Date()),
        };
      },
      isSelected(range) {
        return false;
      },
    },
    {
      label: 'Month to date',
      range: () => {
        const now = new Date();
        return {
          startDate: startOfDay(new Date(now.getFullYear(), now.getMonth(), 1)),
          endDate: endOfDay(now),
        };
      },
      isSelected(range) {
        return false;
      },
    },
    {
      label: 'Year to date',
      range: () => {
        const now = new Date();
        return {
          startDate: startOfDay(new Date(now.getFullYear(), 0, 1)),
          endDate: endOfDay(now),
        };
      },
      isSelected(range) {
        return false;
      },
    },
  ];

  return (
    <div className="space-y-8">
      {/* Date Range Button and Popover */}
      <div className="flex flex-col items-start" ref={pickerRef}>
        <button
          className="flex items-center border rounded-lg px-4 py-2 shadow-sm bg-white hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setPickerOpen((o) => !o)}
        >
          <FiCalendar className="mr-2" />
          <span>{formatRangeLabel(dateRange[0])}</span>
        </button>
        {pickerOpen && (
          <div className="absolute z-50 mt-2 bg-white border rounded-lg shadow-lg p-4">
            <DateRangePicker
              ranges={dateRange}
              onChange={item => setDateRange([item.selection])}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
              months={2}
              direction="horizontal"
              staticRanges={customStaticRanges}
              inputRanges={[]}
              locale={enIN}
            />
            <div className="flex justify-end mt-2">
              <button className="mr-2 px-4 py-2 rounded border" onClick={() => setPickerOpen(false)}>Cancel</button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setPickerOpen(false)}>Apply</button>
            </div>
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