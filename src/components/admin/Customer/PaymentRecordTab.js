import React, { useState } from 'react';
import { PAYMENT_API_URL, CUSTOMER_API_URL, fetchApi } from '../../../utils';
import FormField from '../../forms/FormField';
import LoadingSpinner from '../../common/LoadingSpinner';

const initialForm = {
  phone: '',
  date: new Date().toISOString().slice(0, 10),
  amount: '',
  paymentType: '',
  service: '',
};

const PaymentRecordTab = () => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (!form.phone.match(/^\d{10}$/)) return 'Enter a valid 10-digit phone number.';
    if (!form.date) return 'Date is required.';
    if (!form.amount || isNaN(form.amount) || Number(form.amount) < 1) return 'Enter a valid amount.';
    if (!form.paymentType) return 'Select a payment type.';
    if (!form.service) return 'Select a service.';
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
      await fetchApi(PAYMENT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: customerId,
          payment_date: form.date,
          amount: Number(form.amount),
          payment_type: form.paymentType,
          service: form.service,
        }),
      });
      
      setSuccess('Payment record submitted successfully!');
      setForm(initialForm);
    } catch (err) {
      setError('Failed to submit payment record. Please try again.');
      // console.error('Payment submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex justify-center my-10">
      <form className="space-y-6 w-full max-w-[400px]" onSubmit={handleSubmit}>
        <FormField
          label="Customer Phone Number"
          name="phone"
          type="phone"
          value={form.phone}
          onChange={handleChange}
          required
          placeholder="10-digit mobile number"
          inputClassName="w-full max-w-[400px]"
        />
        
        <FormField
          label="Service"
          name="service"
          type="select"
          value={form.service}
          onChange={handleChange}
          required
          options={[
            { value: "tattoo", label: "Tattoo" },
            { value: "piercing", label: "Piercing" }
          ]}
          inputClassName="w-full max-w-[400px]"
        />
        
        <FormField
          label="Payment Date"
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
          inputClassName="w-full max-w-[400px]"
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
          inputClassName="w-full max-w-[400px]"
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
          inputClassName="w-full max-w-[400px]"
        />
        
        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md w-full max-w-[400px]">
            {error}
          </div>
        )}
        
        {success && (
          <div className="text-green-700 text-sm bg-green-50 p-3 rounded-md w-full max-w-[400px]">
            {success}
          </div>
        )}
        
        <div className="flex justify-start">
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Payment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentRecordTab; 