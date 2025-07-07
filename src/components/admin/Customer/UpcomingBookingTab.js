import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ADVANCE_PAYMENT_API_URL, fetchApi } from '../../../utils';
import { CUSTOMER_API_URL } from '../../../utils/apiUrls';

const fetchUpcomingBookingsAndCustomers = async () => {
  const [bookingData, customerData] = await Promise.all([
    fetchApi(ADVANCE_PAYMENT_API_URL, { method: 'GET' }),
    fetchApi(CUSTOMER_API_URL, { method: 'GET' })
  ]);
  const upcoming = Array.isArray(bookingData)
    ? bookingData.filter(b => !b.fulfillment)
    : [];
  return {
    bookings: upcoming,
    customers: Array.isArray(customerData) ? customerData : [],
  };
};

const UpcomingBookingTab = () => {
  const queryClient = useQueryClient();
  const { data, isLoading: loading, error } = useQuery({
    queryKey: ['upcomingBookingsAndCustomers'],
    queryFn: fetchUpcomingBookingsAndCustomers,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const [fulfillingId, setFulfillingId] = useState(null);

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

  const bookings = data?.bookings || [];
  const customers = data?.customers || [];

  // Helper to get customer info by id
  const getCustomer = (customerId) => {
    if (!customerId) return {};
    return customers.find(c => c.id === customerId) || {};
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Upcoming Bookings</h2>
      {loading && <div className="py-8 text-center text-gray-500">Loading...</div>}
      {error && <div className="py-8 text-center text-red-500">{error.message || 'Failed to fetch upcoming bookings or customers.'}</div>}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed divide-y divide-gray-200 bg-white rounded-xl overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-1/6 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Customer Name</th>
                <th className="w-1/6 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Customer Phone</th>
                <th className="w-1/6 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Appointment Date</th>
                <th className="w-1/6 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Advance Amount</th>
                <th className="w-1/6 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Due Amount</th>
                <th className="w-1/6 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Service</th>
                <th className="w-1/6 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Fulfillment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-gray-400 py-8">No upcoming bookings found.</td>
                </tr>
              ) : (
                bookings.map(b => {
                  const customer = getCustomer(b.customer_id);
                  return (
                    <tr key={b.id} className="hover:bg-gray-50 transition">
                      <td className="w-1/6 px-4 py-3 text-center">{customer.name || '-'}</td>
                      <td className="w-1/6 px-4 py-3 text-center">{customer.phone || '-'}</td>
                      <td className="w-1/6 px-4 py-3 text-center">{b.appointment_date ? new Date(b.appointment_date).toLocaleDateString() : '-'}</td>
                      <td className="w-1/6 px-4 py-3 text-center">₹{b.advance_amount}</td>
                      <td className="w-1/6 px-4 py-3 text-center">₹{b.due_amount}</td>
                      <td className="w-1/6 px-4 py-3 text-center capitalize">{b.service}</td>
                      <td className="w-1/6 px-4 py-3 text-center">
                        <button
                          className="bg-indigo-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-indigo-700 disabled:opacity-50"
                          disabled={fulfillingId === b.id}
                          onClick={() => fulfillMutation.mutate(b)}
                        >
                          {fulfillingId === b.id ? 'Fulfilling...' : 'Fulfill'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UpcomingBookingTab; 