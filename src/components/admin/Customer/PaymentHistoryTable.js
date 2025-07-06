import React, { useState, useMemo } from 'react';
import Pagination from '../../common/Pagination';

const PaymentHistoryTable = ({ payments }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const getPaymentDate = (payment) => {
    let paymentDateDisplay = 'Unknown';
    if (payment.payment_date) {
      try {
        paymentDateDisplay = new Date(payment.payment_date).toLocaleDateString();
      } catch {}
    }
    return paymentDateDisplay;
  };

  // Pagination logic
  const totalItems = payments.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  
  // Reset to first page when payments change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [payments]);

  // Get current page data
  const paginatedPayments = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return payments.slice(startIndex, endIndex);
  }, [payments, currentPage, ITEMS_PER_PAGE]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);

  return (
    <div>
      <table className="min-w-full table-fixed divide-y divide-gray-200 bg-white rounded-xl overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-1/3 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">Date</th>
            <th className="w-1/3 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Amount</th>
            <th className="w-1/3 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Type</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {paginatedPayments.map((payment) => (
            <tr key={`payment-${payment.id}`}>
              <td className="w-1/3 px-4 py-3 text-left">{getPaymentDate(payment)}</td>
              <td className="w-1/3 px-4 py-3 text-center">₹{payment.amount}</td>
              <td className="w-1/3 px-4 py-3 text-right">{payment.payment_type}</td>
            </tr>
          ))}
          {paginatedPayments.length === 0 && (
            <tr>
              <td colSpan={3} className="text-center text-gray-400 py-8">No payment history found.</td>
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
  );
};

export default PaymentHistoryTable; 