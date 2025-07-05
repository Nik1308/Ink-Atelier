import React from 'react';

const PaymentHistoryTable = ({ payments }) => {
  const getPaymentDate = (payment) => {
    let paymentDateDisplay = 'Unknown';
    if (payment.payment_date) {
      try {
        paymentDateDisplay = new Date(payment.payment_date).toLocaleDateString();
      } catch {}
    }
    return paymentDateDisplay;
  };

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
          {payments.map((payment) => (
            <tr key={`payment-${payment.id}`}>
              <td className="w-1/3 px-4 py-3 text-left">{getPaymentDate(payment)}</td>
              <td className="w-1/3 px-4 py-3 text-center">₹{payment.amount}</td>
              <td className="w-1/3 px-4 py-3 text-right">{payment.payment_type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistoryTable; 