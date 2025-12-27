import React, { useState } from 'react';
import { Table } from '../../../../shared';
import { getCustomerName, getCustomerPhone } from '../../../../shared/utils/customer';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '../../../../shared/utils/fetch';
import { ADVANCE_PAYMENT_API_URL } from '../../../../shared/api';

const UpcomingBookingTab = ({ bookings, customers }) => {
  const [fulfillingId, setFulfillingId] = useState(null);
  const queryClient = useQueryClient();

  const fulfillMutation = useMutation({
    mutationFn: async (booking) => {
      setFulfillingId(booking.id);
      await fetchApi(`${ADVANCE_PAYMENT_API_URL}/${booking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fulfillment: true }),
      });
    },
    onSuccess: () => {
      setFulfillingId(null);
      queryClient.invalidateQueries(['upcomingBookingsAndCustomers']);
    },
    onError: () => {
      setFulfillingId(null);
      // Optionally show error toast
    }
  });

  const columns = [
    { header: 'Customer Name', accessor: 'customerId', cellClassName: 'text-left', render: (b) => getCustomerName(customers, b.customerId) },
    { header: 'Customer Phone', accessor: 'customerPhone', cellClassName: 'text-center', render: (b) => getCustomerPhone(customers, b.customerId) },
    { header: 'Appointment Date', accessor: 'appointmentDate', cellClassName: 'text-center', render: (b) => b.appointmentDate ? new Date(b.appointmentDate).toLocaleDateString() : 'N/A' },
    { header: 'Advance Amount', accessor: 'advanceAmount', cellClassName: 'text-center', render: (b) => b.advanceAmount ? `₹${b.advanceAmount}` : '—' },
    { header: 'Due Amount', accessor: 'dueAmount', cellClassName: 'text-center', render: (b) => b.dueAmount ? `₹${b.dueAmount}` : '—' },
    { header: 'Service', accessor: 'service', cellClassName: 'text-center', render: (b) => b.service || '—' },
    {
      header: 'Fulfillment',
      accessor: 'fulfillment',
      cellClassName: 'text-right',
      render: (b) => (
        <button
          className="bg-indigo-600 text-white px-4 py-1 rounded font-semibold text-sm hover:bg-indigo-700 transition disabled:opacity-60"
          disabled={fulfillingId === b.id || b.fulfillment}
          onClick={() => fulfillMutation.mutate(b)}
        >
          {fulfillingId === b.id ? 'Fulfilling...' : b.fulfillment ? 'Fulfilled' : 'Fulfill'}
        </button>
      ),
    },
  ];

  // Only show bookings that are not fulfilled
  const unfulfilledBookings = Array.isArray(bookings) ? bookings.filter(b => !b.fulfillment) : [];

  return (
    <Table
      columns={columns}
      data={unfulfilledBookings}
      emptyState="No upcoming bookings found."
    />
  );
};

export default UpcomingBookingTab; 