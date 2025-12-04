import React, { useState, useMemo } from 'react';
import DateRangeSelector from '../common/ui/DateRangeSelector';
import { getCustomerName, getCustomerPhone, getCustomerById } from '../../utils/customerUtils';
import { startOfDay, endOfDay, isWithinInterval, isSameDay } from 'date-fns';
import usePagination from '../common/hooks/usePagination';
import {
  getTattooAftercareMessage,
  getPiercingAftercareMessage,
  getReviewWhatsappMessage,
  getAdvancePaymentConfirmationMessage
} from '../../utils/constants';
import GlassCard from './components/GlassCard';
import { useAdminResources } from './hooks/useAdminResources';

function ButtonWhatsApp({ phone, message, label }) {
  const [loading, setLoading] = React.useState(false);
  const formattedPhone = phone.replace(/[^0-9]/g, '');
  // Only opens WhatsApp, no PATCH or sent/sentLabel logic
  const handleClick = async () => {
    setLoading(true);
    try {
      window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`, '_blank');
    } finally {
      setLoading(false);
    }
  };
  return (
    <button
      className="px-4 py-1.5 rounded-xl bg-white text-black text-xs font-bold shadow hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={handleClick}
      disabled={loading}
      style={{ minWidth: 140 }}
    >
      {loading ? 'Opening...' : label}
    </button>
  );
}

const MessagesTab = () => {
  const { payments, advancePayments, customers } = useAdminResources();
  const [dateRange, setDateRange] = useState([
    { startDate: startOfDay(new Date()), endDate: endOfDay(new Date()), key: 'selection' }
  ]);

  // Combine and filter payments by date
  const filteredMessages = useMemo(() => {
    const { startDate, endDate } = dateRange[0];
    const all = [
      ...(payments?.data || [])
    ];
    return all
      .filter((p) => {
        const d = new Date(p.payment_date || p.created_at);
        const customer = getCustomerById(customers?.data || [], p.customer_id);
        return (
          customer && customer.id &&
          (isWithinInterval(d, { start: startOfDay(startDate), end: endOfDay(endDate) }) ||
          isSameDay(d, startDate) ||
          isSameDay(d, endDate))
        );
      })
      .sort((a, b) => new Date(b.payment_date || b.created_at) - new Date(a.payment_date || a.created_at));
  }, [payments?.data, dateRange, customers?.data]);

  // Pagination
  const ITEMS_PER_PAGE = 10;
  const {
    paginatedData,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
  } = usePagination(filteredMessages, ITEMS_PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto pt-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7">
        <h1 className="text-white text-3xl md:text-4xl font-semibold tracking-tight mb-2 md:mb-0">Messages</h1>
        <DateRangeSelector dateRange={dateRange} setDateRange={setDateRange} months={1} direction="horizontal" />
      </div>
      <table className="w-full min-w-[1050px] rounded-2xl overflow-hidden border-collapse">
          <thead className="bg-white/10 rounded-2xl">
            <tr className="text-white/80 text-lg font-bold ">
              <th className="px-2 py-3 text-left font-bold">Name</th>
              <th className="px-2 py-3 text-left font-bold">Phone</th>
              {/* <th className="px-2 py-3 text-left font-bold">Date</th> */}
              <th className="px-2 py-3 text-left font-bold">Amount</th>
              <th className="px-2 py-3 text-center font-bold">Aftercare</th>
              <th className="px-2 py-3 text-center font-bold">Review</th>
              <th className="px-2 py-3 text-center font-bold">Advance Payment</th>
            </tr>
          </thead>
          <tbody className="">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-9 py-12 text-left text-white/60 text-xl font-semibold">No messages found for selected range.</td>
              </tr>
            ) : paginatedData.map((msg, idx) => {
              let advanceEntry = null;
              if (msg.payment_type === 'Advance' && Array.isArray(advancePayments?.data)) {
                advanceEntry = advancePayments.data.find(ap =>
                  ap.customer_id === msg.customer_id &&
                  ap.fulfillment === false
                );
              }
              const appointmentDate = advanceEntry?.appointment_date || msg.appointment_date || msg.payment_date || '';
              const advanceAmount = advanceEntry?.advance_amount || msg.amount || msg.advance_amount || '';
              const dueAmount = advanceEntry?.due_amount || msg.due_amount || '';
              return (
                <tr
                  key={msg.id || idx}
                  className={`bg-white/5 border-b border-white/15 last:border-b-0 transition text-white`}
                >
                  <td className="px-2 py-3 text-left font-extrabold text-white text-[1.18rem]">{getCustomerName(customers?.data || [], msg.customer_id)}</td>
                  <td className="px-2 py-3 text-left font-mono text-sky-200 text-[1.13rem]">{getCustomerPhone(customers?.data || [], msg.customer_id)}</td>
                  {/* <td className="px-2 py-3 text-left text-white/80 text-base">{msg.payment_date ? new Date(msg.payment_date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}</td> */}
                  <td className="px-2 py-3 text-left text-white font-semibold text-base">
                    {msg.amount !== undefined ? `₹${parseFloat(msg.amount).toLocaleString()}` : '—'}
                  </td>
                  <td className="px-2 py-3 text-center">
                    {msg.payment_type !== 'Advance' && (
                      <ButtonWhatsApp
                        phone={getCustomerPhone(customers?.data || [], msg.customer_id)}
                        message={msg.service === 'tattoo' ? getTattooAftercareMessage(getCustomerName(customers?.data || [], msg.customer_id)) : (msg.service === 'piercing' ? getPiercingAftercareMessage(getCustomerName(customers?.data || [], msg.customer_id)) : `Hi${getCustomerName(customers?.data || [], msg.customer_id) ? ' ' + getCustomerName(customers?.data || [], msg.customer_id) : ''},\n\nAftercare instructions will be provided by your artist.`)}
                        label="Aftercare Message"
                      />
                    )}
                  </td>
                  <td className="px-2 py-3 text-center">
                    {msg.payment_type !== 'Advance' && (
                      <ButtonWhatsApp
                        phone={getCustomerPhone(customers?.data || [], msg.customer_id)}
                        message={getReviewWhatsappMessage(getCustomerName(customers?.data || [], msg.customer_id))}
                        label="Review Message"
                      />
                    )}
                  </td>
                  <td className="px-2 py-3 text-center">
                    {msg.payment_type === 'Advance' ? (
                      (() => {
                        const rawName = getCustomerName(customers?.data || [], msg.customer_id);
                        const clientName = rawName === 'Unknown' ? '' : rawName;
                        const phone = getCustomerPhone(customers?.data || [], msg.customer_id);
                        const formattedPhone = phone.replace(/[^0-9]/g, '');
                        const confirmationMessage = getAdvancePaymentConfirmationMessage({
                          clientName,
                          appointmentDate,
                          advanceAmount,
                          dueAmount
                        });
                        return (
                          <button
                            className="px-4 py-1.5 rounded-xl bg-white text-black text-xs font-bold shadow hover:bg-gray-100 transition"
                            onClick={() => window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(confirmationMessage)}`, '_blank')}
                          >
                            Advance Payment Confirmation
                          </button>
                        );
                      })()
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10 mb-3 select-none flex-wrap">
            <button
              className="px-3 py-1.5 bg-white/10 border border-white/15 rounded-xl text-white/70 hover:text-white disabled:opacity-40 font-semibold text-base"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >Prev</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`px-3 py-1 rounded-lg text-base font-semibold transition border-2 ${currentPage === i + 1 ? 'bg-sky-500 border-sky-400 text-white' : 'bg-white/10 border-white/15 text-white/70 hover:text-white'}`}
                onClick={() => setCurrentPage(i + 1)}
              >{i + 1}</button>
            ))}
            <button
              className="px-3 py-1.5 bg-white/10 border border-white/15 rounded-xl text-white/70 hover:text-white disabled:opacity-40 font-semibold text-base"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >Next</button>
          </div>
        )}
  </div>
);
};

export default MessagesTab; 