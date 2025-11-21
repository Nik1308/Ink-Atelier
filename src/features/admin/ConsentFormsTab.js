import React, { useState, useMemo } from 'react';
import { useAdminResources } from './hooks/useAdminResources';
import GlassCard from './components/GlassCard';
import DateRangeSelector from '../common/ui/DateRangeSelector';
import { PAYMENT_API_URL } from '../../utils/apiUrls';
import { fetchApi } from '../../utils/Fetch';
import { getCustomerById, handleCustomerLookup } from '../../utils/customerUtils';
import FormField from '../forms/components/FormField';
import { startOfDay, endOfDay, isWithinInterval, isSameDay } from 'date-fns';
import { FiChevronDown, FiChevronUp, FiX } from 'react-icons/fi';
import GlassModal from '../common/ui/GlassModal';

function fieldTruthy(val) {
  if (typeof val === 'boolean') return val;
  const v = String(val || '').trim().toLowerCase();
  return v && v !== 'no' && v !== 'false' && v !== 'null' && v !== 'undefined' && v !== '-';
}
function formatDate(date) {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
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
function chunkArray(arr, chunkSize) {
  const out = [];
  for (let i = 0; i < arr.length; i += chunkSize) out.push(arr.slice(i, i + chunkSize));
  return out;
}
const ITEMS_PER_PAGE = 12;
const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'tattoo', label: 'Tattoo' },
  { key: 'piercing', label: 'Piercing' },
  { key: 'medical', label: 'Medical' }
];
function getColumns() {
  if (typeof window !== 'undefined') {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }
  return 3;
}
const ConsentFormsTab = () => {
  const { consentForms, customers } = useAdminResources();
  const [dateRange, setDateRange] = useState([
    { startDate: startOfDay(new Date()), endDate: endOfDay(new Date()), key: 'selection' }
  ]);
  const [formType, setFormType] = useState('all');
  const [page, setPage] = useState(1);
  const [expandedFormId, setExpandedFormId] = useState(null);
  const [columns, setColumns] = useState(getColumns());
  const [modalForm, setModalForm] = useState({ open: false, form: null, error: null, loading: false, success: null });

  React.useEffect(() => {
    function handleResize() { setColumns(getColumns()); }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filterByHealth = form => {
    return (
      form.has_allergies === true ||
      (form.allergies && String(form.allergies).toLowerCase() === 'yes') ||
      fieldTruthy(form.allergies_list) ||
      form.has_medications === true ||
      (form.medications && String(form.medications).toLowerCase() === 'yes') ||
      fieldTruthy(form.medications_list) ||
      form.has_medical_conditions === true ||
      (form.medical_conditions && String(form.medical_conditions).toLowerCase() === 'yes') ||
      fieldTruthy(form.medical_conditions_list) ||
      form.alcohol_drugs === true || (typeof form.alcohol_drugs === 'string' && String(form.alcohol_drugs).toLowerCase() === 'yes') ||
      form.pregnant_nursing === true || (typeof form.pregnant_nursing === 'string' && String(form.pregnant_nursing).toLowerCase() === 'yes')
    );
  };
  // Filter forms by date range and type
  const filteredForms = useMemo(() => {
    if (!consentForms) return [];
    const { startDate, endDate } = dateRange[0];
    return consentForms.filter(f => {
      let correctType = formType === 'all' || f.type === formType;
      if (formType === 'medical') correctType = filterByHealth(f);
      if (!correctType) return false;
      const d = f.created_at; // ONLY use created_at for filtering now
      if (!d) return false;
      const dateObj = new Date(d);
      return (
        isWithinInterval(dateObj, { start: startOfDay(startDate), end: endOfDay(endDate) }) ||
        isSameDay(dateObj, startOfDay(startDate)) ||
        isSameDay(dateObj, endOfDay(endDate))
      );
    });
  }, [consentForms, dateRange, formType]);

  // Pagination
  const totalPages = Math.ceil(filteredForms.length / ITEMS_PER_PAGE);
  const pageForms = filteredForms.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const pageWindow = getPaginationWindow(page, totalPages);
  React.useEffect(() => { setPage(1); setExpandedFormId(null); }, [dateRange, formType]);
  React.useEffect(() => { if (page > totalPages) setPage(totalPages || 1); }, [page, totalPages]);

  const openPaymentModal = (form, customer) => {
    // Auto-fill defaults
    const phone = (customer && customer.phone) ? customer.phone : '';
    const service = form.type === 'tattoo'
      ? `tattoo`
      : `piercing`;
    const date = form.tattoo_date || form.piercing_date || new Date().toISOString().split('T')[0];
    setModalForm({
      open: true,
      form: {
        phone,
        service,
        date,
        amount: '',
        gst: '',
        paymentType: '',
      },
      error: null,
      loading: false,
      success: null,
      c_id: customer?.id || form.customer_id
    });
  };
  const closePaymentModal = () => setModalForm({ open: false, form: null, error: null, loading: false, success: null });

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setModalForm((mf) => ({ ...mf, form: { ...mf.form, [name]: value }, error: null, success: null }));
  };
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setModalForm((mf) => ({ ...mf, error: null, loading: true, success: null }));
    const { phone, service, date, amount, gst, paymentType } = modalForm.form || {};
    // Validation
    if (!phone || !service || !date || !amount || !gst || !paymentType) {
      setModalForm((mf) => ({ ...mf, error: 'All fields (Amount, GST, Payment Type) are required.', loading: false }));
      return;
    }
    let customerId = modalForm.c_id;
    // Try to get customer ID by phone if not set
    if (!customerId && phone) {
      customerId = await handleCustomerLookup(phone.replace('+91', ''));
      if (!customerId) {
        setModalForm(mf => ({ ...mf, error: 'Could not find or create customer for payment', loading: false }));
        return;
      }
    }
    try {
      await fetchApi(PAYMENT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: customerId,
          payment_date: date,
          amount: Number(amount),
          gst: Number(gst),
          payment_type: paymentType,
          service: service,
        })
      });
      setModalForm(mf => ({ ...mf, loading: false, error: null, success: 'Payment recorded successfully!' }));
    } catch (err) {
      setModalForm(mf => ({ ...mf, loading: false, error: 'Failed to record payment. Try again.' }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto pt-4 pb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7">
        <h1 className="text-white text-3xl md:text-4xl font-semibold tracking-tight">Consent Forms</h1>
        <DateRangeSelector dateRange={dateRange} setDateRange={setDateRange} months={1} direction="horizontal" />
      </div>
      {/* Filters Bar */}
      <div className="flex items-center gap-4 md:gap-6 mb-8">
        {FILTERS.map(f => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFormType(f.key)}
            className={`px-5 py-2 rounded-xl font-semibold text-base transition shadow border border-white/15 backdrop-blur-lg
            ${formType === f.key
              ? (f.key === 'tattoo' ? 'bg-sky-700 text-white border-sky-400 font-bold' 
                : f.key === 'piercing' ? 'bg-pink-700 text-white border-pink-400 font-bold' 
                : f.key === 'medical' ? 'bg-rose-700 text-white border-rose-400 font-bold' 
                : 'bg-white/20 text-white font-bold border-sky-500')
              : (f.key === 'medical' ? 'bg-black/30 text-rose-300 border-rose-400 hover:text-white hover:bg-rose-700' : 'bg-black/30 text-white/70 hover:text-white hover:bg-black/60')}`}
            style={{ minWidth: 122 }}
          >
            {f.label}
          </button>
        ))}
      </div>
      {(pageForms.length === 0) ? (
        <GlassCard className="w-full max-w-xl mx-auto min-h-[150px] flex items-center justify-center bg-white/10 border-white/20">
          <span className="text-xl md:text-2xl font-semibold text-white/70">No consent forms found in this range.</span>
        </GlassCard>
      ) : (
        <table className="w-full glass-table rounded-2xl overflow-hidden bg-white/10">
          <thead className="bg-white/10">
            <tr className="text-left text-white/80 text-base font-semibold">
              <th className="px-4 py-3">Type</th>
              <th className="px-2 py-3">Name</th>
              <th className="px-2 py-3 whitespace-nowrap">Phone</th>
              <th className="px-2 py-3">Date</th>
              <th className="px-2 py-3">Service</th>
              <th className="px-2 py-3"></th> {/* Button */}
              <th className="px-2 py-3 text-right"></th> {/* Chevron */}
            </tr>
          </thead>
          <tbody>
            {pageForms.map((form, i) => {
              const isTattoo = form.type === 'tattoo';
              const customer = customers?.data?.find(c => c.id === form.customer_id) || {};
              const uniqueId = form.id || form.created_at || i;
              const expanded = expandedFormId === uniqueId;
              const health_flag =
                form.has_allergies === true || (form.allergies && String(form.allergies).toLowerCase() === 'yes') || fieldTruthy(form.allergies_list) ||
                form.has_medications === true || (form.medications && String(form.medications).toLowerCase() === 'yes') || fieldTruthy(form.medications_list) ||
                form.has_medical_conditions === true || (form.medical_conditions && String(form.medical_conditions).toLowerCase() === 'yes') || fieldTruthy(form.medical_conditions_list) ||
                form.alcohol_drugs === true || (typeof form.alcohol_drugs === 'string' && String(form.alcohol_drugs).toLowerCase() === 'yes') ||
                form.pregnant_nursing === true || (typeof form.pregnant_nursing === 'string' && String(form.pregnant_nursing).toLowerCase() === 'yes');
              return <>
                <tr key={uniqueId} className={`backdrop-blur-lg bg-white/5 border-b border-white/15 hover:bg-white/10 transition ${expanded ? 'ring-2 ring-sky-400' : ''}`} style={{ verticalAlign: 'middle' }}>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${isTattoo ? 'bg-blue-900 text-sky-200' : 'bg-pink-900 text-pink-200'}`}>{isTattoo ? 'Tattoo' : 'Piercing'}</span>
                    {health_flag && (
                      <span title="Health Info Present" aria-label="Health Info Present" className="inline-flex items-center gap-1 px-1.5 ml-2 py-[2px] rounded-lg font-bold text-[11px] bg-rose-700 text-rose-100 border border-rose-200 animate-pulse align-middle"><svg width="9" height="9" viewBox="0 0 20 20" fill="none" className="inline mr-0.5 -mt-0.5"><circle cx="10" cy="10" r="8" fill="#f43f5e" stroke="#fecaca" strokeWidth="2" /></svg>H</span>
                    )}
                  </td>
                  <td className="px-2 py-3 font-semibold text-white text-base whitespace-nowrap">{customer.name || 'Unknown'}</td>
                  <td className="px-2 py-3 font-mono text-sky-200 text-base whitespace-nowrap">{(customer.phone || '').replace(/^\+91/, '')}</td>
                  <td className="px-2 py-3 whitespace-nowrap text-base text-white/80">{isTattoo ? (form.tattoo_date ? formatDate(form.tattoo_date) : form.created_at ? formatDate(form.created_at) : '—') : (form.piercing_date ? formatDate(form.piercing_date) : form.created_at ? formatDate(form.created_at) : '—')}</td>
                  <td className="px-2 py-3 whitespace-nowrap text-sm text-white/90">{isTattoo ? (form.tattoo_location || '-') : (form.piercing_type || '-')}</td>
                  <td className="px-2 text-center">
                    <button type="button" className="px-4 py-1.5 rounded-lg font-semibold border-none bg-white text-black text-xs tracking-tight shadow hover:bg-gray-100 focus:outline-none" onClick={e => { e.stopPropagation(); openPaymentModal(form, customer); }}>Record Payment</button>
                  </td>
                  <td className="px-2 text-right">
                    <button onClick={e => { e.stopPropagation(); setExpandedFormId(expanded ? null : uniqueId); }} aria-label={expanded ? 'Hide details' : 'Show details'} className={`text-2xl rounded-full p-[3px] ml-1 transition ${expanded ? 'bg-sky-700 text-white' : 'bg-black/20 text-sky-300 hover:bg-sky-500 hover:text-white'}`}>{expanded ? <FiChevronUp /> : <FiChevronDown />}</button>
                  </td>
                </tr>
                {expanded && (
                  <tr className="backdrop-blur bg-white/10">
                    <td colSpan={8} className="p-0">
                      {/* Expanded row content matches previous expanded GlassCard details—see prior implementation for details and payment modal. */}
                      {/* ...reuse the expanded details rendering here ... */}
                      <div className="px-6 py-6"><div className="border-t border-white/20 pt-4 animate-fadeIn">
                        {isTattoo ? (
                          <>
                            <div className="mb-2 text-lg font-semibold text-sky-400">Tattoo Consent Details</div>
                            <div className="flex flex-col gap-2 text-white/90 text-base">
                              {form.tattoo_location && <span><span className="font-semibold text-sky-200">Location:</span> {form.tattoo_location}</span>}
                              {form.tattoo_description && <span><span className="font-semibold text-sky-200">Description:</span> {form.tattoo_description}</span>}
                              {form.tattoo_artist && <span><span className="font-semibold text-amber-300">Artist:</span> {form.tattoo_artist}</span>}
                              {form.tattoo_size && <span><span className="font-semibold text-sky-200">Size:</span> {form.tattoo_size}</span>}
                              {form.signed_by && <span><span className="font-semibold text-cyan-300">Signed by:</span> {form.signed_by}</span>}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="mb-2 text-lg font-semibold text-pink-300">Piercing Consent Details</div>
                            <div className="flex flex-col gap-2 text-white/90 text-base">
                              {form.piercing_type && <span><span className="font-semibold text-pink-200">Type:</span> {form.piercing_type}</span>}
                              {form.piercing_subtype && <span><span className="font-semibold text-pink-200">Sub-type:</span> {form.piercing_subtype}</span>}
                              {form.piercing_anatomy && <span><span className="font-semibold text-pink-200">Anatomy:</span> {form.piercing_anatomy}</span>}
                              {form.piercing_description && <span><span className="font-semibold text-pink-200">Description:</span> {form.piercing_description}</span>}
                              {form.piercing_artist && <span><span className="font-semibold text-amber-300">Artist:</span> {form.piercing_artist}</span>}
                              {form.signed_by && <span><span className="font-semibold text-cyan-300">Signed by:</span> {form.signed_by}</span>}
                            </div>
                          </>
                        )}
                        {health_flag && (
                          <div className="mt-6 border-t border-white/20 pt-4">
                            <div className="mb-2 text-base font-semibold text-red-200">Health Information</div>
                            <ul className="list-inside text-white/90 text-sm space-y-1">
                              {/* Compute and display health fields for this expanded form as in previous logic */}
                              {/* ...reuse existing health info extraction... */}
                            </ul>
                          </div>
                        )}
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                          {form.id && <span className="text-xs text-white/60">Form ID: {form.id}</span>}
                        </div>
                      </div></div>
                    </td>
                  </tr>
                )}
              </>;
            })}
          </tbody>
        </table>
      )}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8 select-none flex-wrap">
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
      <GlassModal open={modalForm.open} onClose={closePaymentModal}>
        <h2 className="text-xl text-white font-bold mb-2">Record Payment</h2>
        <form className="w-full mt-2 flex flex-col gap-3" onSubmit={handlePaymentSubmit}>
          <FormField label="Mobile Number" labelClassName="text-white/90" name="phone" type="phone" value={(modalForm.form?.phone || '').replace(/^\+91/, '')} required inputClassName="bg-white/10 text-white border-white/20" readOnly />
          <FormField label="Service" labelClassName="text-white/90" name="service" type="text" value={modalForm.form?.service || ''} required inputClassName="bg-white/10 text-white border-white/20" readOnly />
          <FormField label="Date" labelClassName="text-white/90" name="date" type="date" value={modalForm.form?.date || ''} required inputClassName="bg-white/10 text-white border-white/20" readOnly />
          <FormField label="Amount (₹)" labelClassName="text-white/90" name="amount" type="number" value={modalForm.form?.amount || ''} required min={1} inputClassName="bg-white/10 text-white border-white/20" onChange={handleModalChange} />
          <FormField label="GST (₹)" labelClassName="text-white/90" name="gst" type="number" value={modalForm.form?.gst || ''} required min={0} inputClassName="bg-white/10 text-white border-white/20" onChange={handleModalChange} />
          <FormField label="Payment Type" labelClassName="text-white/90" name="paymentType" type="select" value={modalForm.form?.paymentType || ''} required options={[
            { value: 'UPI', label: 'UPI' },
            { value: 'Cash', label: 'Cash' },
            { value: 'Card', label: 'Card' },
          ]} inputClassName="bg-white/10 text-white border-white/20" onChange={handleModalChange} />
          {modalForm.error && <div className="bg-rose-100 text-red-800 px-3 py-2 my-1 w-full rounded text-sm font-semibold">{modalForm.error}</div>}
          {modalForm.success && <div className="bg-green-100 text-green-800 px-3 py-2 my-1 w-full rounded text-sm font-semibold">{modalForm.success}</div>}
          <button
            type="submit"
            disabled={modalForm.loading}
            className="w-full mt-1 py-2 text-lg font-bold rounded-lg bg-white text-black hover:bg-gray-100 disabled:opacity-50 shadow"
          >
            {modalForm.loading ? 'Recording...' : 'Submit Payment'}
          </button>
        </form>
      </GlassModal>
    </div>
  );
};

export default ConsentFormsTab; 