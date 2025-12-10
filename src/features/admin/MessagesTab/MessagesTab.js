import React, { useState, useMemo } from 'react';
import DateRangeSelector from '../../common/ui/DateRangeSelector';
import Table from '../../common/ui/Table';
import { getCustomerName, getCustomerPhone, getCustomerById } from '../../../utils/customerUtils';
import { startOfDay, endOfDay, isWithinInterval, isSameDay } from 'date-fns';
import usePagination from '../../common/hooks/usePagination';
import {
  getTattooAftercareMessage,
  getPiercingAftercareMessage,
  getReviewWhatsappMessage,
  getAdvancePaymentConfirmationMessage
} from '../../../utils/constants';
import { fetchApi } from '../../../utils/Fetch';
import { CUSTOMER_API_URL } from '../../../utils/apiUrls';

// Helper button component for PATCH + WhatsApp
function ButtonWithPatchAndWhatsApp({
  customerId,
  phone,
  clientName,
  message,
  field,
  sent,
  label,
  sentLabel
}) {
  const [loading, setLoading] = React.useState(false);
  const formattedPhone = phone.replace(/[^0-9]/g, '');
  const handleClick = async () => {
    setLoading(true);
    try {
      await fetchApi(`${CUSTOMER_API_URL}/${customerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: true })
      });
      window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`, '_blank');
    } finally {
      setLoading(false);
    }
  };
  return (
    <button
      className="px-3 py-1 rounded bg-indigo-100 text-indigo-700 text-xs font-semibold hover:bg-indigo-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={handleClick}
      disabled={sent || loading}
    >
      {sent ? sentLabel : loading ? 'Sending...' : label}
    </button>
  );
}

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
      // ...(advancePayments || []),
    ];
    return all
      .filter((p) => {
        const d = new Date(p.paymentDate || p.createdAt);
        // Only include if customer exists
        const customer = getCustomerById(customers, p.customerId);
        return (
          customer && customer.id &&
          (isWithinInterval(d, { start: startOfDay(startDate), end: endOfDay(endDate) }) ||
          isSameDay(d, startDate) ||
          isSameDay(d, endDate))
        );
      })
      .sort((a, b) => new Date(b.paymentDate || b.createdAt) - new Date(a.paymentDate || a.createdAt));
  }, [payments, advancePayments, dateRange, customers]);

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

  const columns = [
    { header: 'Customer Name', accessor: 'customerId', render: (msg) => getCustomerName(customers, msg.customerId), cellClassName: 'text-left', headerClassName: 'text-left' },
    { header: 'Phone', accessor: 'customerId', render: (msg) => getCustomerPhone(customers, msg.customerId), cellClassName: 'text-center', headerClassName: 'text-center' },
    { header: 'Payment Amount', accessor: 'amount', render: (msg) => {
      const amount = msg.amount !== undefined ? msg.amount : msg.advanceAmount;
      return amount ? `₹${parseFloat(amount).toLocaleString()}` : '—';
    }, cellClassName: 'text-center', headerClassName: 'text-center' },
    {
      header: '',
      accessor: 'aftercare',
      cellClassName: 'text-center',
      headerClassName: 'text-center',
      render: (msg) => {
        if (msg.paymentType === 'Advance') return null;
        const phone = getCustomerPhone(customers, msg.customerId);
        const rawName = getCustomerName(customers, msg.customerId);
        const clientName = rawName === 'Unknown' ? '' : rawName;
        let aftercareMessage = '';
        if (msg.service === 'tattoo') {
          aftercareMessage = getTattooAftercareMessage(clientName);
        } else if (msg.service === 'piercing') {
          aftercareMessage = getPiercingAftercareMessage(clientName);
        } else {
          aftercareMessage = `Hi${clientName ? ' ' + clientName : ''},\n\nAftercare instructions will be provided by your artist.`;
        }
        const customer = customers.find(c => c.id === msg.customerId);
        const aftercareSent = customer && customer.aftercare_msg;
        return (
          <ButtonWithPatchAndWhatsApp
            customerId={msg.customerId}
            phone={phone}
            clientName={clientName}
            message={aftercareMessage}
            field="aftercare_msg"
            sent={aftercareSent}
            label="Aftercare Message"
            sentLabel="Aftercare Sent"
          />
        );
      },
    },
    {
      header: '',
      accessor: 'advance',
      cellClassName: 'text-center',
      headerClassName: 'text-center',
      render: (msg) => {
        if (msg.paymentType === 'Advance') {
          const phone = getCustomerPhone(customers, msg.customerId);
          const rawName = getCustomerName(customers, msg.customerId);
          const clientName = rawName === 'Unknown' ? '' : rawName;
          const formattedPhone = phone.replace(/[^0-9]/g, '');

          // Find matching advance payment entry
          let advanceEntry = null;
          if (Array.isArray(advancePayments)) {
            advanceEntry = advancePayments.find(ap =>
              ap.customerId === msg.customerId &&
              ap.fulfillment === false
            );
          }

          const appointmentDate = advanceEntry?.appointmentDate || msg.appointmentDate || msg.paymentDate || '';
          const advanceAmount = advanceEntry?.advanceAmount || msg.amount || msg.advanceAmount || '';
          const dueAmount = advanceEntry?.dueAmount || msg.dueAmount || '';

          const confirmationMessage = getAdvancePaymentConfirmationMessage({
            clientName,
            appointmentDate,
            advanceAmount,
            dueAmount
          });
          const waUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(confirmationMessage)}`;
          return (
            <button
              className="px-3 py-1 rounded bg-indigo-100 text-indigo-700 text-xs font-semibold hover:bg-indigo-200 transition"
              onClick={() => window.open(waUrl, '_blank')}
            >
              Advance Payment Confirmation
            </button>
          );
        }
        return null;
      },
    },
    {
      header: '',
      accessor: 'review',
      cellClassName: 'text-center',
      headerClassName: 'text-center',
      render: (msg) => {
        if (msg.paymentType === 'Advance') return null;
        const phone = getCustomerPhone(customers, msg.customerId);
        const rawName = getCustomerName(customers, msg.customerId);
        const clientName = rawName === 'Unknown' ? '' : rawName;
        const customer = customers.find(c => c.id === msg.customerId);
        const reviewSent = customer && customer.review_msg;
        return (
          <ButtonWithPatchAndWhatsApp
            customerId={msg.customerId}
            phone={phone}
            clientName={clientName}
            message={getReviewWhatsappMessage(clientName)}
            field="review_msg"
            sent={reviewSent}
            label="Review Message"
            sentLabel="Review Sent"
          />
        );
      },
    },
  ];

  return (
    <div className="space-y-8">
      {/* Date Range Selector */}
      <DateRangeSelector dateRange={dateRange} setDateRange={setDateRange} />

      {/* Messages Table */}
      <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
        <Table columns={columns} data={paginatedData} emptyState="No messages found for selected range." />
        {totalPages > 1 && (
          <div className="mt-4">
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>
                Showing {startIndex + 1} to {endIndex} of {totalItems} results
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded border ${currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded border ${currentPage === i + 1 ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded border ${currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesTab; 