import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PAYMENT_API_URL, CUSTOMER_API_URL, fetchApi } from '../../utils';
import FormField from '../../components/forms/FormField';
import FormSection from '../../components/forms/FormSection';

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
            name: "",
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
          <FormField
            label="Customer Phone Number"
            name="phone"
            type="phone"
            value={form.phone}
            onChange={handleChange}
            required
            placeholder="10-digit mobile number"
          />
          <FormField
            label="Payment Date"
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            required
          />
          <FormField
            label="Amount (₹)"
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
            required
            min="1"
            placeholder="Enter amount"
          />
          <FormField
            label="Payment Type"
            name="paymentType"
            type="select"
            value={form.paymentType}
            onChange={handleChange}
            required
            options={[
              { value: "UPI", label: "UPI" },
              { value: "Cash", label: "Cash" },
              { value: "Card", label: "Card" }
            ]}
          />
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