import React, { useState } from 'react';
import Table from '../../common/ui/Table';
import { getCustomerName, getCustomerPhone } from '../../../utils/customerUtils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '../../../utils/Fetch';
import { ADVANCE_PAYMENT_API_URL } from '../../../utils/apiUrls';

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
    { header: 'Customer Name', accessor: 'customer_id', cellClassName: 'text-left', render: (b) => getCustomerName(customers, b.customer_id) },
    { header: 'Customer Phone', accessor: 'customer_phone', cellClassName: 'text-center', render: (b) => getCustomerPhone(customers, b.customer_id) },
    { header: 'Appointment Date', accessor: 'appointment_date', cellClassName: 'text-center', render: (b) => b.appointment_date ? new Date(b.appointment_date).toLocaleDateString() : 'N/A' },
    { header: 'Advance Amount', accessor: 'advance_amount', cellClassName: 'text-center', render: (b) => b.advance_amount ? `₹${b.advance_amount}` : '—' },
    { header: 'Due Amount', accessor: 'due_amount', cellClassName: 'text-center', render: (b) => b.due_amount ? `₹${b.due_amount}` : '—' },
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