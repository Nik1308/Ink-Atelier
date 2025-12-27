import React, { useState, useMemo } from 'react';
import GlassCard from '../components/GlassCard';
import { DateRangeSelector } from '../../../shared';
import { startOfDay, endOfDay, isWithinInterval, isSameDay, addDays, subMonths, format, differenceInDays, startOfMonth, endOfMonth } from 'date-fns';
import { useLazyAdminResources } from '../hooks/useLazyAdminResources';
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Line, ResponsiveContainer, Legend } from 'recharts';
import { Tooltip as RechartsTooltip } from 'recharts';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

function RevenueTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  // Our chart data: { label, prevLabel, current, previous }
  const dataPt = payload[0].payload;
  return (
    <div style={{ background: 'rgba(10,15,30,.93)', color: '#fff', borderRadius: 8, boxShadow: '0 6px 32px #0004', padding: 16, fontSize: 15 }}>
      <div style={{ marginBottom: 6, fontWeight: 'bold', fontSize: 17 }}>{dataPt.label} <span style={{ color:'#aaa', fontWeight:400 }}>(Current)</span></div>
      <div>
        <span style={{ color: '#38bdf8', fontWeight: 600 }}>Current: </span> ₹{(dataPt.current||0).toLocaleString()}
      </div>
      <div style={{ margin: '9px 0 5px', fontWeight: 'bold', fontSize: 15 }}>{dataPt.prevLabel} <span style={{ color:'#aaa', fontWeight:400 }}>(Previous)</span></div>
      <div>
        <span style={{ color: '#818cf8', fontWeight: 600 }}>Previous: </span> ₹{(dataPt.previous||0).toLocaleString()}
      </div>
    </div>
  );
}

function getPaginationWindow(current, total) {
  const window = [];
  if (total <= 7) {
    for (let i = 1; i <= total; ++i) window.push(i);
    return window;
  }
  let left = Math.max(2, current - 2);
  let right = Math.min(total - 1, current + 2);
  if (current <= 4) {
    left = 2; right = 5;
  } else if (current >= total - 3) {
    left = total - 4; right = total - 1;
  }
  window.push(1);
  if (left > 2) window.push('...');
  for (let i = left; i <= right; ++i) window.push(i);
  if (right < total - 1) window.push('...');
  window.push(total);
  return window;
}

const startMonth = startOfDay(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
const endToday = endOfDay(new Date());
const NTH_DAY = 2;

const DashboardTab = () => {
  const [dateRange, setDateRange] = useState([
    { startDate: startOfDay(new Date()), endDate: endOfDay(new Date()), key: 'selection' }
  ]);
  const [typeExpanded, setTypeExpanded] = useState(false);
  const [showPaymentsTable, setShowPaymentsTable] = useState(false);
  const rowsPerPage = 10;
  const [activeTab, setActiveTab] = useState('payments'); // 'payments', 'expenses'
  const [paymentsPage, setPaymentsPage] = useState(1);
  const [expensesPage, setExpensesPage] = useState(1);

  const { payments: paymentsQuery, expenses: expensesQuery, customers: customersQuery } = useLazyAdminResources({
    enablePayments: true,
    enableExpenses: true,
    enableCustomers: true,
  });
  const { startDate, endDate } = dateRange[0];
  const rangeDays = differenceInDays(endOfDay(endDate), startOfDay(startDate)) + 1;
  const isMonthly = rangeDays > 32;

  const filteredPayments = useMemo(() => {
    if (!paymentsQuery.data) return [];
    return paymentsQuery.data.filter(p => {
      if (!p.paymentDate) return false;
      const d = new Date(p.paymentDate);
      return isWithinInterval(d, { start: startOfDay(startDate), end: endOfDay(endDate) }) || isSameDay(d, startOfDay(startDate)) || isSameDay(d, endOfDay(endDate));
    });
  }, [paymentsQuery.data, startDate, endDate]);

  // --- Expenses: filter by date range and sum
  const filteredExpenses = useMemo(() => {
    if (!expensesQuery?.data) return [];
    return expensesQuery.data.filter(e => {
      if (!e.expenseDate) return false;
      const d = new Date(e.expenseDate);
      return isWithinInterval(d, { start: startOfDay(startDate), end: endOfDay(endDate) }) || isSameDay(d, startOfDay(startDate)) || isSameDay(d, endOfDay(endDate));
    });
  }, [expensesQuery?.data, startDate, endDate]);
  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

  // Stats/counter logic omitted for brevity...
  // Group graph data by day (if ≤1 month) or by month (if >1 month)

  const buildGraphData = (payments, prevPayments, labelPat) => {
    const result = [];
    if (!isMonthly) {
      for (let i = 0; i < rangeDays; i += NTH_DAY) {
        const currDate = addDays(startOfDay(startDate), i);
        const prevDate = addDays(subMonths(startOfDay(startDate), 1), i);
        const currValue = payments.filter(p => {
          const d = new Date(p.paymentDate);
          return isSameDay(d, currDate) && ((p.service && labelPat.test(p.service)) || (p.service_type && labelPat.test(p.service_type)));
        }).reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
        const prevValue = prevPayments.filter(p => {
          const d = new Date(p.paymentDate);
          return isSameDay(d, prevDate) && ((p.service && labelPat.test(p.service)) || (p.service_type && labelPat.test(p.service_type)));
        }).reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
        result.push({
          label: format(currDate, 'd MMM yyyy'), // day month year for more clarity
          prevLabel: format(prevDate, 'd MMM yyyy'),
          current: currValue,
          previous: prevValue,
        });
      }
    } else {
      const months = [];
      let ym = startOfMonth(startDate);
      while (ym <= endOfMonth(endDate)) {
        months.push(ym);
        ym = addDays(endOfMonth(ym), 1);
        ym = startOfMonth(ym);
      }
      months.forEach((monthDate) => {
        const currMonthStart = startOfMonth(monthDate);
        const currMonthEnd = endOfMonth(monthDate);
        const prevMonthStart = subMonths(currMonthStart, 1);
        const prevMonthEnd = endOfMonth(prevMonthStart);
        const currValue = payments.filter(p => {
          const d = new Date(p.paymentDate);
          return isWithinInterval(d, { start: currMonthStart, end: currMonthEnd }) && ((p.service && labelPat.test(p.service)) || (p.service_type && labelPat.test(p.service_type)));
        }).reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
        const prevValue = prevPayments.filter(p => {
          const d = new Date(p.paymentDate);
          return isWithinInterval(d, { start: prevMonthStart, end: prevMonthEnd }) && ((p.service && labelPat.test(p.service)) || (p.service_type && labelPat.test(p.service_type)));
        }).reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
        result.push({
          label: format(monthDate, 'MMM yyyy'),
          prevLabel: format(subMonths(monthDate, 1), 'MMM yyyy'),
          current: currValue,
          previous: prevValue,
        });
      });
    }
    return result;
  };

  // Previous period (move entire range back a month)
  const prevStart = subMonths(startOfDay(startDate), 1);
  const prevEnd = subMonths(endOfDay(endDate), 1);
  const prevPayments = useMemo(() => {
    if (!paymentsQuery.data) return [];
    return paymentsQuery.data.filter(p => {
      if (!p.paymentDate) return false;
      const d = new Date(p.paymentDate);
      return isWithinInterval(d, { start: prevStart, end: prevEnd }) || isSameDay(d, prevStart) || isSameDay(d, prevEnd);
    });
  }, [paymentsQuery.data, prevStart, prevEnd]);

  const tattooGraphData = buildGraphData(filteredPayments, prevPayments, /tattoo/i);
  const piercingGraphData = buildGraphData(filteredPayments, prevPayments, /piercing/i);
  // ... existing metrics and cards logic ...

  // Revenue by paymentType for Payment Type Cards
  const revenueByType = useMemo(() => {
    const groups = {};
    filteredPayments.forEach(p => {
      const type = p.paymentType || 'Other';
      if (!groups[type]) groups[type] = 0;
      groups[type] += parseFloat(p.amount) || 0;
    });
    return groups;
  }, [filteredPayments]);

  const paymentTypeCards = Object.entries(revenueByType).map(([type, amt]) => ({
    key: type,
    label: type.charAt(0).toUpperCase() + type.slice(1),
    value: `₹${amt.toLocaleString()}`,
  }));

  // Revenue summary cards (now 4: total, tattoo, piercing, expenses)
  const tattooRevenue = filteredPayments
    .filter(p => (p.service && /tattoo/i.test(p.service)) || (p.service_type && /tattoo/i.test(p.service_type)))
    .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
  const piercingRevenue = filteredPayments
    .filter(p => (p.service && /piercing/i.test(p.service)) || (p.service_type && /piercing/i.test(p.service_type)))
    .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
  const totalRevenue = filteredPayments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
  const totalGST = filteredPayments.reduce((sum, p) => sum + (parseFloat(p.gst) || 0), 0);
  // Card values for new layout:
  const netProfit = totalRevenue - totalExpenses;
  const mainCards = [
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, key: 'total', className: '' },
    { label: 'Total Expenses', value: `₹${totalExpenses.toLocaleString()}`, key: 'expenses', className: 'text-rose-200 border-rose-400 bg-rose-900/30' },
    { label: 'Net Profit', value: `₹${netProfit.toLocaleString()}`, key: 'net', className: netProfit >= 0 ? 'text-green-200 border-green-400 bg-green-900/30' : 'text-rose-200 border-rose-400 bg-rose-900/30' },
  ];
  const detailCards = [
    { label: 'Tattoo Revenue', value: `₹${tattooRevenue.toLocaleString()}`, key: 'tattoo' },
    { label: 'Piercing Revenue', value: `₹${piercingRevenue.toLocaleString()}`, key: 'piercing' },
    { label: 'GST Collected', value: `₹${totalGST.toLocaleString()}`, key: 'gst', className: 'text-cyan-200 border-cyan-400 bg-cyan-900/30' },
  ];

  // Revenue by paymentType
  const revenueByTypeList = useMemo(() => {
    const groups = {};
    filteredPayments.forEach(p => {
      const type = p.paymentType || 'Other';
      if (!groups[type]) groups[type] = 0;
      groups[type] += parseFloat(p.amount) || 0;
    });
    // Return as sorted array, descending by amount
    return Object.entries(groups)
      .map(([type, amt]) => ({ type: type.charAt(0).toUpperCase() + type.slice(1), value: amt }))
      .sort((a, b) => b.value - a.value);
  }, [filteredPayments]);

  // Minimal display: show top 1-2
  const topTypes = revenueByTypeList.slice(0, 2);
  const others = revenueByTypeList.slice(2);
  const topTotal = topTypes.reduce((sum, t) => sum + t.value, 0);

  const allCustomers = (customersQuery?.data || []);
  const paymentRecords = (paymentsQuery?.data || []).filter(p => {
    if (!p.paymentDate) return false;
    const d = new Date(p.paymentDate);
    return isWithinInterval(d, { start: startOfDay(startDate), end: endOfDay(endDate) }) || isSameDay(d, startOfDay(startDate)) || isSameDay(d, endOfDay(endDate));
  }).sort((a,b) => new Date(b.paymentDate) - new Date(a.paymentDate));
  const paginatedPayments = paymentRecords.slice((paymentsPage-1) * rowsPerPage, paymentsPage * rowsPerPage);
  const totalPaymentsPages = Math.ceil(paymentRecords.length / rowsPerPage) || 1;
  const paymentPagesWindow = getPaginationWindow(paymentsPage, totalPaymentsPages);

  const expensesRecords = (expensesQuery?.data || []).filter(e => {
    if (!e.expenseDate) return false;
    const d = new Date(e.expenseDate);
    return isWithinInterval(d, { start: startOfDay(startDate), end: endOfDay(endDate) }) || isSameDay(d, startOfDay(startDate)) || isSameDay(d, endOfDay(endDate));
  }).sort((a,b) => new Date(b.expenseDate) - new Date(a.expenseDate));
  const paginatedExpenses = expensesRecords.slice((expensesPage-1) * rowsPerPage, expensesPage * rowsPerPage);
  const totalExpensesPages = Math.ceil(expensesRecords.length / rowsPerPage) || 1;
  const expensesPagesWindow = getPaginationWindow(expensesPage, totalExpensesPages);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-white text-3xl md:text-4xl font-semibold tracking-tight">Dashboard</h1>
        <div className="md:mt-0 md:mb-0 mb-2 w-max">
          <DateRangeSelector dateRange={dateRange} setDateRange={setDateRange} months={1} direction="horizontal" />
        </div>
      </div>
      {/* Revenue Overview row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
        {mainCards.map(card => (
          <GlassCard key={card.key} className={`flex flex-col items-start justify-center h-32 text-left bg-white/10 border-white/20 ${card.className||''}`}>
            <div className="text-base font-medium text-white/80 mb-2">{card.label}</div>
            <div className="text-4xl font-bold font-mono tracking-tight text-amber-100 drop-shadow">{card.value}</div>
          </GlassCard>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {detailCards.map(card => (
          <GlassCard key={card.key} className={`flex flex-col items-start justify-center h-32 text-left bg-white/10 border-white/20 ${card.className || ''}`}>
            <div className="text-base font-medium text-white/80 mb-2">{card.label}</div>
            <div className="text-4xl font-bold font-mono tracking-tight text-amber-100 drop-shadow">{card.value}</div>
          </GlassCard>
        ))}
      </div>
      {/* Payment Type summary: collapsed/expanded glass card */}
      <div className="flex justify-center mb-10">
        <GlassCard className={`w-full max-w-xl px-6 py-5 transition-all duration-300 flex flex-col items-center cursor-pointer ${typeExpanded ? 'shadow-2xl scale-[1.025]' : 'shadow'}`}
          style={{ minHeight: typeExpanded ? 230 : 105 }}
          onClick={() => setTypeExpanded(exp => !exp)}
        >
          <div className="flex items-center justify-between w-full mb-2">
            <div className="text-lg font-semibold text-white/90">Payment Breakdown</div>
            <button
              className="text-2xl focus:outline-none ml-2 text-white/60 hover:text-sky-400"
              tabIndex={-1}
              onClick={e => {e.stopPropagation(); setTypeExpanded(exp => !exp);}}
              aria-label={typeExpanded ? 'Hide' : 'Show All'}
            >
              {typeExpanded ? <FiChevronUp /> : <FiChevronDown />}
            </button>
          </div>
          {!typeExpanded && (
            <div className="w-full flex justify-around items-end transition-all">
              {topTypes.map(pt => (
                <div key={pt.type} className="flex-1 flex flex-col items-center">
                  <div className="text-base font-medium text-cyan-200 mb-0">{pt.type} Payments</div>
                  <div className="text-2xl font-bold font-mono text-cyan-300">₹{pt.value.toLocaleString()}</div>
                </div>
              ))}
              {others.length > 0 && (
                <div className="flex flex-col items-center justify-center opacity-60 text-white">
                  +{others.length} Other
                </div>
              )}
            </div>
          )}
          {typeExpanded && (
            <div className="mt-3 w-full grid grid-cols-1 md:grid-cols-2 gap-1.5 transition-all">
              {revenueByTypeList.map(pt => (
                <div key={pt.type} className="flex flex-row w-full justify-between px-1 py-1 text-lg border-b border-white/10 last:border-b-0">
                  <div className="text-cyan-300 font-semibold max-w-[40%] truncate">{pt.type}</div>
                  <div className="font-mono font-bold text-cyan-100">₹{pt.value.toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
          {/* Expand/collapse hint */}
          <div className="w-full flex justify-center mt-2 mb-0">
            <span className="text-xs text-sky-200 tracking-wide font-normal opacity-70">Tap to {typeExpanded ? 'collapse' : 'expand'} type breakdown</span>
          </div>
        </GlassCard>
      </div>
      {/* Tabs for Payment Records, Expense Records, and Upcoming Bookings */}
      <GlassCard className="w-full mx-auto mt-1 mb-12 px-6 flex flex-col" style={{maxWidth: '1160px', overflow: 'visible'}}>
        {/* Tab Buttons */}
        <div className="flex items-center gap-2 mb-4 pt-2 border-b border-white/20">
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-6 py-3 text-base font-semibold transition-all rounded-t-lg ${
              activeTab === 'payments'
                ? 'bg-white/20 text-white border-b-2 border-sky-400'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            Payment Records
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`px-6 py-3 text-base font-semibold transition-all rounded-t-lg ${
              activeTab === 'expenses'
                ? 'bg-white/20 text-white border-b-2 border-sky-400'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            Expense Records
          </button>
        </div>

        {/* Payment Records Tab Content */}
        {activeTab === 'payments' && (
          <div className="transition-all duration-200 pt-4">
            <div className="w-full overflow-x-auto pb-2">
              <table className="w-full min-w-[900px] glass-table rounded-2xl overflow-hidden border-collapse">
                <thead className="bg-white/10 sticky top-0 z-10">
                  <tr className="text-white/80 text-base font-bold">
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Phone</th>
                    <th className="px-4 py-3 text-center">Payment Date</th>
                    <th className="px-4 py-3 text-center">Amount</th>
                    <th className="px-4 py-3 text-center">Service</th>
                    <th className="px-4 py-3 text-center">Type</th>
                    <th className="px-4 py-3 text-center">GST</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPayments.length === 0 ? (
                    <tr><td colSpan={7} className="px-4 py-8 text-white/60 text-center">No payment records found.</td></tr>
                  ) : paginatedPayments.map((p, idx) => {
                    const customer = allCustomers.find(c => c.id === p.customerId) || {};
                    return (
                      <tr key={p.id || idx} className="bg-white/5 border-b border-white/15 last:border-b-0 text-white hover:bg-white/10 transition">
                        <td className="px-4 py-3 text-left font-bold text-white">{customer.name || 'Unknown'}</td>
                        <td className="px-4 py-3 text-left font-mono text-sky-200">{customer.phone || ''}</td>
                        <td className="px-4 py-3 text-center text-white/90">{p.paymentDate ? new Date(p.paymentDate).toLocaleDateString('en-IN',{year:'numeric',month:'short',day:'numeric'}) : '-'}</td>
                        <td className="px-4 py-3 text-center font-semibold">₹{parseFloat(p.amount||0).toLocaleString()}</td>
                        <td className="px-4 py-3 text-center">{p.service || '-'}</td>
                        <td className="px-4 py-3 text-center">{p.paymentType || '-'}</td>
                        <td className="px-4 py-3 text-center">{p.gst !== undefined ? `₹${parseFloat(p.gst).toLocaleString()}` : '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {totalPaymentsPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6 mb-2">
                  <button
                    onClick={() => setPaymentsPage(p => Math.max(1, p-1))}
                    disabled={paymentsPage===1}
                    className={`px-4 py-2 rounded-2xl font-bold text-base border-none shadow backdrop-blur bg-white/10 transition-all duration-100 ${paymentsPage === 1 ? 'opacity-60 text-white bg-white/20 cursor-not-allowed' : 'text-white hover:bg-sky-100/30 hover:text-sky-300'}`}
                    style={{minWidth:44}}
                  >Prev</button>
                  {paymentPagesWindow.map((num, idx) => num === '...'
                    ? <span key={`dots${idx}`} className="mx-1 text-gray-300 text-lg px-1 font-bold">…</span>
                    : <button
                        key={num}
                        onClick={() => setPaymentsPage(num)}
                        className={`mx-[2px] px-4 py-2 rounded-2xl border-none font-bold text-base transition shadow backdrop-blur ${paymentsPage===num ? 'bg-sky-500 text-white' : 'bg-white/12 text-white/70 hover:bg-sky-400 hover:text-white'}`}
                        style={{minWidth:44}}
                      >{num}</button>
                  )}
                  <button
                    onClick={() => setPaymentsPage(p => Math.min(totalPaymentsPages, p+1))}
                    disabled={paymentsPage===totalPaymentsPages}
                    className={`px-4 py-2 rounded-2xl font-bold text-base border-none shadow backdrop-blur bg-white/10 transition-all duration-100 ${paymentsPage === totalPaymentsPages ? 'opacity-60 text-white bg-white/20 cursor-not-allowed' : 'text-white hover:bg-sky-100/30 hover:text-sky-300'}`}
                    style={{minWidth:44}}
                  >Next</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Expense Records Tab Content */}
        {activeTab === 'expenses' && (
          <div className="transition-all duration-200 pt-4">
            <div className="w-full overflow-x-auto pb-2">
              <table className="w-full min-w-[650px] glass-table rounded-2xl overflow-hidden border-collapse">
                <thead className="bg-white/10 sticky top-0 z-10">
                  <tr className="text-white/80 text-base font-bold">
                    <th className="px-4 py-3 text-center">Expense Date</th>
                    <th className="px-4 py-3 text-center">Amount</th>
                    <th className="px-4 py-3 text-center">Purpose</th>
                    <th className="px-4 py-3 text-center">Payment Method</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedExpenses.length === 0 ? (
                    <tr><td colSpan={4} className="px-4 py-8 text-white/60 text-center">No expense records found.</td></tr>
                  ) : paginatedExpenses.map((e, idx) => (
                    <tr key={e.id || idx} className="bg-white/5 border-b border-white/15 last:border-b-0 text-white hover:bg-white/10 transition">
                      <td className="px-4 py-3 text-center text-white/90">{e.expenseDate ? new Date(e.expenseDate).toLocaleDateString('en-IN',{year:'numeric',month:'short',day:'numeric'}) : '-'}</td>
                      <td className="px-4 py-3 text-center font-semibold">₹{parseFloat(e.amount||0).toLocaleString()}</td>
                      <td className="px-4 py-3 text-center">{e.purpose || '-'}</td>
                      <td className="px-4 py-3 text-center">{e.paymentMethod || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalExpensesPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6 mb-2">
                  <button
                    onClick={() => setExpensesPage(p => Math.max(1, p-1))}
                    disabled={expensesPage===1}
                    className={`px-4 py-2 rounded-2xl font-bold text-base border-none shadow backdrop-blur bg-white/10 transition-all duration-100 ${expensesPage === 1 ? 'opacity-60 text-white bg-white/20 cursor-not-allowed' : 'text-white hover:bg-sky-100/30 hover:text-sky-300'}`}
                    style={{minWidth:44}}
                  >Prev</button>
                  {expensesPagesWindow.map((num, idx) => num === '...'
                    ? <span key={`dots${idx}`} className="mx-1 text-gray-300 text-lg px-1 font-bold">…</span>
                    : <button
                        key={num}
                        onClick={() => setExpensesPage(num)}
                        className={`mx-[2px] px-4 py-2 rounded-2xl border-none font-bold text-base transition shadow backdrop-blur ${expensesPage===num ? 'bg-sky-500 text-white' : 'bg-white/12 text-white/70 hover:bg-sky-400 hover:text-white'}`}
                        style={{minWidth:44}}
                      >{num}</button>
                  )}
                  <button
                    onClick={() => setExpensesPage(p => Math.min(totalExpensesPages, p+1))}
                    disabled={expensesPage===totalExpensesPages}
                    className={`px-4 py-2 rounded-2xl font-bold text-base border-none shadow backdrop-blur bg-white/10 transition-all duration-100 ${expensesPage === totalExpensesPages ? 'opacity-60 text-white bg-white/20 cursor-not-allowed' : 'text-white hover:bg-sky-100/30 hover:text-sky-300'}`}
                    style={{minWidth:44}}
                  >Next</button>
                </div>
              )}
            </div>
          </div>
        )}

      </GlassCard>
    </>
  );
};

export default DashboardTab;
