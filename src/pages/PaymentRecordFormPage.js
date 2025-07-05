import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PAYMENT_API_URL, CUSTOMER_API_URL } from '../utils/apiUrls';
import { fetchApi } from '../utils/Fetch';

const initialForm = {
  phone: '',
  date: new Date().toISOString().slice(0, 10),
  amount: '',
  paymentType: '',
};

const PaymentRecordFormPage = () => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (!form.phone.match(/^\d{10}$/)) return 'Enter a valid 10-digit phone number.';
    if (!form.date) return 'Date is required.';
    if (!form.amount || isNaN(form.amount) || Number(form.amount) < 1) return 'Enter a valid amount.';
    if (!form.paymentType) return 'Select a payment type.';
    return null;
  };

  const handleCustomerLookup = async (phoneNumber, setError) => {
    try {
      const formattedPhone = phoneNumber.startsWith("+91") ? phoneNumber : `+91${phoneNumber}`;
      
      // Query all customers
      const customers = await fetchApi(CUSTOMER_API_URL, { method: "GET" });
      const existingCustomer = Array.isArray(customers) 
        ? customers.find(c => c.phone === formattedPhone)
        : null;

      if (existingCustomer) {
        return existingCustomer.id;
      } else {
        // Create new customer with minimal info
        const newCustomer = await fetchApi(CUSTOMER_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: `Customer (${phoneNumber})`,
            phone: formattedPhone,
            email: '',
            date_of_birth: '',
            address: '',
          }),
        });
        return newCustomer.id;
      }
    } catch (error) {
      const errorMessage = "Customer lookup/creation failed: " + error.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      // Step 1: Handle customer lookup/creation
      const customerId = await handleCustomerLookup(form.phone, setError);

      // Step 2: Submit payment record
      const response = await fetchApi(PAYMENT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: customerId,
          payment_date: form.date,
          amount: Number(form.amount),
          payment_type: form.paymentType,
        }),
      });
      
      setSuccess('Payment record submitted successfully!');
      setForm(initialForm);
    } catch (err) {
      setError('Failed to submit payment record. Please try again.');
      console.error('Payment submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#f7f5f2] flex flex-col items-center justify-center py-16 px-2">
      <div className="bg-white rounded-2xl shadow-2xl border-2 border-black max-w-md w-full p-10 mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Payment Record Form</h2>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Phone Number <span className="text-red-500">*</span></label>
            <div className="flex items-center">
              <span className="bg-gray-200 border border-gray-400 rounded-l px-3 py-2 text-gray-700 select-none">+91</span>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                required
                pattern="\d{10}"
                maxLength={10}
                className="bg-offwhite text-black border-t border-b border-r border-gray-400 rounded-r px-3 py-2 w-full focus:outline-none"
                style={{ borderLeft: 'none' }}
                placeholder="10-digit mobile number"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date <span className="text-red-500">*</span></label>
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
              className="bg-offwhite text-black border border-gray-400 rounded px-3 py-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹) <span className="text-red-500">*</span></label>
            <input
              name="amount"
              type="number"
              min="1"
              value={form.amount}
              onChange={handleChange}
              required
              className="bg-offwhite text-black border border-gray-400 rounded px-3 py-2 w-full"
              placeholder="Enter amount"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Type <span className="text-red-500">*</span></label>
            <select
              name="paymentType"
              value={form.paymentType}
              onChange={handleChange}
              required
              className="bg-offwhite text-black border border-gray-400 rounded px-3 py-2 w-full"
            >
              <option value="" disabled>Select payment type</option>
              <option value="UPI">UPI</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
            </select>
          </div>
          {error && <div className="text-red-600 text-center">{error}</div>}
          {success && <div className="text-green-700 text-center">{success}</div>}
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-offwhite rounded-full px-6 py-2 font-bold shadow hover:bg-gray-800 transition mt-2 disabled:opacity-60"
          >
            {loading ? 'Submitting...' : 'Submit Payment'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default PaymentRecordFormPage; 