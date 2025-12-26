import React, { useState, useMemo } from 'react';
import DateRangeSelector from '../common/ui/DateRangeSelector';
import { getCustomerName, getCustomerPhone, getCustomerById } from '../../utils/customerUtils';
import { startOfDay, endOfDay, isWithinInterval, isSameDay } from 'date-fns';
import usePagination from '../common/hooks/usePagination';
import {
  getTattooAftercareMessage,
  getPiercingAftercareMessage,
  getReviewWhatsappMessage,
  getAdvancePaymentConfirmationMessage,
  getAftercarePdfUrl
} from '../../utils/constants';
import GlassCard from './components/GlassCard';
import { useLazyAdminResources } from './hooks/useLazyAdminResources';
import { API_BASE_URL } from '../../utils/apiUrls';
import { fetchApi } from '../../utils/Fetch';
import { getAuthToken, clearAuthData } from '../../utils/authUtils';

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

function AftercareInvoiceAndReviewButton({ invoiceId, phone, service, clientName }) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleSend = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get aftercare PDF URL
      const aftercareUrl = getAftercarePdfUrl(service);
      
      // Get invoice URL if invoice exists
      let invoiceUrl = null;
      if (invoiceId) {
        try {
          const response = await fetchApi(`${API_BASE_URL}/payment/invoice/${invoiceId}/download`, {
            method: 'GET',
          });
          invoiceUrl = response?.downloadUrl || null;
        } catch (err) {
          console.warn('Failed to fetch invoice URL:', err);
          // Continue without invoice URL
        }
      }

      // Build the combined message
      let serviceLabel = '';
      let thankYouMessage = '';
      
      if (service === 'tattoo') {
        serviceLabel = 'Tattoo Aftercare Guide';
        thankYouMessage = 'Thank you for choosing INK ATELIER for your tattoo — we truly appreciate your trust';
      } else if (service === 'piercing') {
        serviceLabel = 'Piercing Aftercare Guide';
        thankYouMessage = 'Thank you for choosing INK ATELIER for your piercing — we truly appreciate your trust';
      } else {
        serviceLabel = 'Aftercare Guide';
        thankYouMessage = 'Thank you for choosing INK ATELIER — we truly appreciate your trust';
      }

      let message = `Hi ${clientName},\n\n${thankYouMessage}.\n\nPlease follow the aftercare instructions here for smooth healing:\n\n${serviceLabel}\n${aftercareUrl || 'Aftercare PDF'}`;

      // Add invoice link if available
      if (invoiceUrl) {
        message += `\n\nYour invoice is available here:\n${invoiceUrl}`;
      }

      // Add review section
      message += `\n\nIf you had a great experience with us, we'd really appreciate a quick Google review — it truly helps our studio grow.\n\nhttps://g.page/r/CVWso4E-rCEsEBI/review`;

      // Add closing message
      message += `\n\nIf you need anything during healing, feel free to reach out anytime.\n\nWarm regards,\nINK ATELIER`;

      // Format phone number for WhatsApp
      const formattedPhone = phone.replace(/[^0-9]/g, '');
      
      // Open WhatsApp with the message
      window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`, '_blank');
    } catch (err) {
      setError('Failed to send');
      console.error('Aftercare, invoice and review send error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="px-4 py-1.5 rounded-xl bg-white text-black text-xs font-bold shadow hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={handleSend}
      disabled={loading}
      title={error || 'Send Message'}
    >
      {loading ? 'Loading...' : error || 'Send Message'}
    </button>
  );
}

const MessagesTab = () => {
  const { payments, advancePayments, customers } = useLazyAdminResources({
    enablePayments: true,
    enableAdvancePayments: true,
    enableCustomers: true,
  });
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
        const d = new Date(p.paymentDate || p.createdAt);
        const customer = getCustomerById(customers?.data || [], p.customerId);
        return (
          customer && customer.id &&
          (isWithinInterval(d, { start: startOfDay(startDate), end: endOfDay(endDate) }) ||
          isSameDay(d, startDate) ||
          isSameDay(d, endDate))
        );
      })
      .sort((a, b) => new Date(b.paymentDate || b.createdAt) - new Date(a.paymentDate || a.createdAt));
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
              <th className="px-2 py-3 text-center font-bold">Complete Message</th>
              <th className="px-2 py-3 text-center font-bold">Advance Payment</th>
            </tr>
          </thead>
          <tbody className="">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-9 py-12 text-left text-white/60 text-xl font-semibold">No messages found for selected range.</td>
              </tr>
            ) : paginatedData.map((msg, idx) => {
              let advanceEntry = null;
              if (msg.paymentType === 'Advance' && Array.isArray(advancePayments?.data)) {
                advanceEntry = advancePayments.data.find(ap =>
                  ap.customerId === msg.customerId &&
                  ap.fulfillment === false
                );
              }
              const appointmentDate = advanceEntry?.appointmentDate || msg.appointmentDate || msg.paymentDate || '';
              const advanceAmount = advanceEntry?.advanceAmount || msg.amount || msg.advanceAmount || '';
              const dueAmount = advanceEntry?.dueAmount || msg.dueAmount || '';
              return (
                <tr
                  key={msg.id || idx}
                  className={`bg-white/5 border-b border-white/15 last:border-b-0 transition text-white`}
                >
                  <td className="px-2 py-3 text-left font-extrabold text-white text-[1.18rem]">{getCustomerName(customers?.data || [], msg.customerId)}</td>
                  <td className="px-2 py-3 text-left font-mono text-sky-200 text-[1.13rem]">{getCustomerPhone(customers?.data || [], msg.customerId)}</td>
                  {/* <td className="px-2 py-3 text-left text-white/80 text-base">{msg.paymentDate ? new Date(msg.paymentDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}</td> */}
                  <td className="px-2 py-3 text-left text-white font-semibold text-base">
                    {msg.amount !== undefined ? `₹${parseFloat(msg.amount).toLocaleString()}` : '—'}
                  </td>
                  <td className="px-2 py-3 text-center">
                    {msg.paymentType !== 'Advance' && (
                      <AftercareInvoiceAndReviewButton
                        invoiceId={msg.invoice?.zohoInvoiceId && msg.invoice?.id ? msg.invoice.id : null}
                        phone={getCustomerPhone(customers?.data || [], msg.customerId)}
                        service={msg.service}
                        clientName={getCustomerName(customers?.data || [], msg.customerId)}
                      />
                    )}
                  </td>
                  <td className="px-2 py-3 text-center">
                    {msg.paymentType === 'Advance' ? (
                      (() => {
                        const rawName = getCustomerName(customers?.data || [], msg.customerId);
                        const clientName = rawName === 'Unknown' ? '' : rawName;
                        const phone = getCustomerPhone(customers?.data || [], msg.customerId);
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