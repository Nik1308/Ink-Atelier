import React, { useState, useMemo } from 'react';
import GlassCard from './components/GlassCard';
import { useLazyAdminResources } from './hooks/useLazyAdminResources';
import { FiSearch, FiChevronDown, FiChevronUp, FiGift, FiUserCheck } from 'react-icons/fi';

function formatDate(date) {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}

const ITEMS_PER_PAGE = 12;

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

function getGridColumns(width) {
  // Returns columns: 1 (mobile), 2 (md), 3 (lg+)
  if (width < 768) return 1;
  if (width < 1024) return 2;
  return 3;
}

function chunkArray(arr, chunkSize) {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    res.push(arr.slice(i, i+chunkSize));
  }
  return res;
}

const CustomersTab = () => {
  const { customers, payments, consentForms } = useLazyAdminResources({
    enableCustomers: true,
    enablePayments: true,
    enableTattooConsents: true,
    enablePiercingConsents: true,
  });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [expandedCustomerId, setExpandedCustomerId] = useState(null);

  // Responsive columns
  const [columns, setColumns] = React.useState(getGridColumns(window.innerWidth));
  React.useEffect(() => {
    function handleResize() {
      setColumns(getGridColumns(window.innerWidth));
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Debug: Log data when it arrives
  React.useEffect(() => {
    if (customers.data) {
      console.log('📊 Customers Data:', customers.data);
      console.log('📊 Customers Count:', customers.data?.length);
      console.log('📊 First Customer:', customers.data?.[0]);
    }
    if (customers.isLoading) {
      console.log('⏳ Loading customers...');
    }
    if (customers.error) {
      console.error('❌ Customers Error:', customers.error);
    }
  }, [customers.data, customers.isLoading, customers.error]);

  // Local search filtering, then sort by createdAt DESC (latest first)
  const filtered = useMemo(() => {
    if (!customers.data) {
      console.log('⚠️ No customers data available');
      return [];
    }
    const q = search.toLowerCase();
    let arr = customers.data;
    if (q) {
      arr = arr.filter(c =>
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.phone && c.phone.includes(search))
      );
    }
    const sorted = arr.sort((a, b) => (new Date(b.createdAt || 0)) - (new Date(a.createdAt || 0)));
    console.log('✅ Filtered customers:', sorted.length);
    return sorted;
  }, [customers.data, search]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const pageData = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  React.useEffect(() => { setPage(1); }, [search]);
  React.useEffect(() => { if (page > totalPages) setPage(totalPages || 1); }, [page, totalPages]);
  const pageWindow = getPaginationWindow(page, totalPages);

  // Payments/Referrals helpers
  const allPayments = payments?.data || [];
  const customersArr = customers?.data || [];

  // Chunk the grid into rows
  const rows = chunkArray(pageData, columns);

  // Find expanded position (rowIdx, colIdx)
  let expandedRowIdx = -1;
  let expandedColIdx = -1;
  rows.forEach((row, rowIdx) => {
    row.forEach((cust, colIdx) => {
      if (cust.id === expandedCustomerId) {
        expandedRowIdx = rowIdx;
        expandedColIdx = colIdx;
      }
    });
  });

  return (
    <div className="max-w-7xl mx-auto px-2 py-6">
      {/* Search Bar */}
      <div className="flex items-center mb-6 bg-white/10 border border-white/20 rounded-xl px-4 py-2 shadow-md max-w-lg mx-auto">
        <FiSearch className="text-lg text-sky-300 mr-2" />
        <input
          className="flex-1 bg-transparent text-white placeholder-slate-400 focus:outline-none text-lg"
          placeholder="Search by name or phone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {/* Loading/empty state */}
      {customers.isLoading && <div className="flex justify-center mt-16"><div className="w-12 h-12 animate-spin rounded-full border-b-2 border-sky-400"></div></div>}
      {!customers.isLoading && (!pageData || pageData.length === 0) && <div className="flex justify-center text-white/60 mt-16 text-xl font-medium">No customers found.</div>}
      <div
        className="grid gap-7 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        style={{minHeight: 300}}
      >
        {rows.map((row, rowIdx) => {
          // If this row has the expanded card, render only that card, full-width
          if (rowIdx === expandedRowIdx) {
            const cust = row.find(c => c.id === expandedCustomerId);
            if (!cust) return null;
            return (
              <div
                key={cust.id+'-expanded'}
                className="col-span-full w-full md:col-span-2 lg:col-span-3 my-2"
                style={{ gridColumn: `1 / span ${columns}` }}
              >
                <GlassCard
                  className="p-7 flex flex-col shadow-2xl transition min-h-[260px] md:min-h-[310px] bg-white/10 border-white/15 backdrop-blur z-10 relative w-full"
                  style={{ minHeight: columns === 1 ? 250 : 310, maxHeight: 740 }}
                  onClick={e => e.stopPropagation()}
                >
                  {/* Absolute close (chevron) button in the corner, always visible */}
                  <div className="absolute top-3 right-3 z-20">
                    <button
                      className="text-2xl rounded bg-black/20 text-sky-300 hover:bg-black/40 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
                      aria-label="Hide details"
                      tabIndex={0}
                      onClick={ev => {ev.stopPropagation(); setExpandedCustomerId(null);}}
                    >
                      <FiChevronUp />
                    </button>
                  </div>
                  {/* First row: left (identity), right (payments) */}
                  <div className="flex flex-col md:flex-row w-full gap-10 md:gap-6 items-start justify-between pr-0 md:pr-14">
                    {/* Left: Identity */}
                    <div className="flex-1 max-w-[440px]">
                      <div className="text-2xl font-extrabold text-white mb-1 truncate max-w-full">{cust.name || <span className="italic text-slate-200">Unknown</span>}</div>
                      <div className="text-lg text-sky-200 font-mono">{cust.phone || '-'}</div>
                      {cust.email && <div className="mt-1 text-base text-slate-400 truncate">{cust.email}</div>}
                      <div className="mt-3 text-xs text-white/50">Created: {formatDate(cust.createdAt)}</div>
                    </div>
                    {/* Right: Payments */}
                    <div className="flex flex-col items-start md:items-end gap-2 min-w-[210px] w-full md:w-auto">
                      <div className="text-base font-semibold text-sky-100 mb-1 flex items-center gap-1"><FiUserCheck />Payments</div>
                      <div className="flex flex-row gap-5 mb-1">
                        <div className="font-semibold text-sky-200 text-lg">Total: <span className="font-bold ml-1">{allPayments.filter(p => p.customerId === cust.id).length}</span></div>
                        <div className="font-semibold text-sky-200 text-lg">Lifetime Spend: <span className="font-bold ml-1">₹{allPayments.filter(p => p.customerId === cust.id).reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0).toLocaleString()}</span></div>
                      </div>
                    </div>
                  </div>
                  {/* Second row: Customer services through consent forms */}
                  <div className="border-t border-white/10 mt-5 pt-4 w-full">
                    <div className="text-base font-semibold text-amber-100 mb-2 flex items-center gap-2">
                      <span className="inline-block w-6 h-6 text-amber-200">📝</span>Services Availed
                    </div>
                    {consentForms
                      ? (() => {
                        const forms = consentForms.filter(f => f.customerId === cust.id);
                        if (!forms.length) return (<div className="text-sm text-white/60 italic mb-2">No services found.</div>);
                        return (
                          <div className="flex flex-col gap-3">
                            {forms.map((form, i) => (
                              <div key={form.id || form.createdAt || i} className="rounded-lg bg-black/10 border border-white/10 p-3">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-2 gap-x-5 w-full items-center">
                                  {/* Col 1: badge + date */}
                                  <div className="flex flex-col items-start md:items-center gap-1">
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full mb-1 ${form.type === 'tattoo' ? 'bg-blue-900 text-sky-200' : 'bg-pink-900 text-pink-200'}`}>{form.type === 'tattoo' ? 'Tattoo' : 'Piercing'}</span>
                                    <span className="text-white/80 text-sm font-medium">{form.type === 'tattoo'
                                      ? (form.tattooDate ? formatDate(form.tattooDate) : form.createdAt ? formatDate(form.createdAt) : '—')
                                      : (form.piercingDate ? formatDate(form.piercingDate) : form.createdAt ? formatDate(form.createdAt) : '—')}</span>
                                  </div>
                                  {/* Col 2: Type + Subtype */}
                                  <div className="flex flex-col items-start md:items-center gap-1">
                                    <span className={`text-sm font-semibold ${form.type === 'tattoo' ? 'text-sky-200' : 'text-pink-200'}`}>Type: <span className="text-white/90 font-bold">{form.type === 'tattoo' ? (form.tattooLocation || '—') : (form.piercingType || '—')}</span></span>
                                    {form.type === 'piercing' && form.piercingSubtype && (
                                      <span className="text-xs text-pink-200">Sub-type: <span className="text-white/90 font-semibold">{form.piercingSubtype}</span></span>
                                    )}
                                  </div>
                                  {/* Col 3: Artist */}
                                  <div className="flex flex-col items-start md:items-center gap-1">
                                    <span className="text-sm font-semibold text-amber-300">Artist:</span>
                                    <span className="text-sm text-white/90 font-semibold">{form.type === 'tattoo' ? (form.tattooArtist || '—') : (form.piercingArtist || '—')}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })()
                      : <div className="text-sm text-white/60 italic mb-2">No services found.</div>}
                  </div>
                  {/* Third row: Referral info */}
                  <div className="border-t border-white/10 mt-6 pt-4 w-full">
                    <div className="text-base font-semibold text-sky-100 mb-1 flex items-center gap-1"><FiGift />Referral</div>
                    <div className="pl-1 text-white/80">
                      {cust.referredByCustomerId && customersArr.find(c => c.id === cust.referredByCustomerId) ? (
                        <div className="mb-1">Referred by: <span className="font-semibold text-sky-300">{(customersArr.find(c => c.id === cust.referredByCustomerId).name || customersArr.find(c => c.id === cust.referredByCustomerId).phone)}</span></div>
                      ) : (<div className="mb-1">Not referred by anyone</div>)}
                      {customersArr.filter(c => c.referredByCustomerId === cust.id).length > 0 ? (
                        <div>
                          <div className="mb-1">Has referred {customersArr.filter(c => c.referredByCustomerId === cust.id).length} {customersArr.filter(c => c.referredByCustomerId === cust.id).length === 1 ? 'customer' : 'customers'}:</div>
                          <div className="space-y-1 pl-3">
                            {customersArr.filter(c => c.referredByCustomerId === cust.id).map(ref => (
                              <div key={ref.id} className="text-xs text-white/80 flex gap-3 items-center">
                                <span className="font-medium">{ref.name || ref.phone}</span>
                                <span className="opacity-70">({formatDate(ref.createdAt)})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (<div>Has not referred anyone.</div>)}
                    </div>
                  </div>
                </GlassCard>
              </div>
            );
          }
          // Standard grid row (not expanded)
          return row.map(cust => (
            <GlassCard
              key={cust.id}
              className="p-6 flex flex-col items-start justify-between shadow hover:shadow-xl transition min-h-[170px] bg-white/10 border-white/15 cursor-pointer relative"
              style={{ minHeight: 170, maxHeight: 260 }}
              onClick={() => setExpandedCustomerId(cust.id)}
            >
              <div className="flex justify-between items-start w-full">
                <div>
                  <div className="text-lg font-bold text-white mb-1 truncate max-w-full">{cust.name || <span className="italic text-slate-200">Unknown</span>}</div>
                  <div className="text-base text-sky-200 font-mono">{cust.phone || '-'}</div>
                  {cust.email && <div className="mt-1 text-base text-slate-400 truncate">{cust.email}</div>}
                </div>
                <button
                  className="ml-2 text-xl rounded bg-black/20 text-sky-300 hover:bg-black/40 px-2 pt-[2px] pb-[3px] focus:outline-none focus:ring-1 focus:ring-sky-400 transition"
                  aria-label="Show details"
                  tabIndex={0}
                  onClick={e => {e.stopPropagation(); setExpandedCustomerId(cust.id);}}
                >
                  <FiChevronDown />
                </button>
              </div>
              <div className="mt-3 text-xs text-white/50">Created: {formatDate(cust.createdAt)}</div>
            </GlassCard>
          ));
        })}
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10 select-none flex-wrap">
          <button
            className="px-3 py-1.5 bg-white/10 border border-white/15 rounded-xl text-white/70 hover:text-white disabled:opacity-40 font-semibold text-base"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >Prev</button>
          {pageWindow.map((num, idx) => num === '...'
            ? <span key={idx} className="mx-1 text-slate-400 text-lg">...</span>
            : <button
                key={num}
                className={`px-3 py-1 rounded-lg text-base font-semibold transition border-2 ${page === num ? 'bg-sky-500 border-sky-400 text-white' : 'bg-white/10 border-white/15 text-white/70 hover:text-white'}`}
                onClick={() => setPage(num)}
              >{num}</button>
          )}
          <button
            className="px-3 py-1.5 bg-white/10 border border-white/15 rounded-xl text-white/70 hover:text-white disabled:opacity-40 font-semibold text-base"
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
          >Next</button>
        </div>
      )}
    </div>
  );
};

export default CustomersTab;
