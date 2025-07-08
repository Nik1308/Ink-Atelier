import React, { useState, useEffect } from 'react';
import { PAYMENT_API_URL, fetchApi, handleCustomerLookup } from '../../../utils';
import { validatePhone, validateRequired, validateNumber } from '../../../utils/formValidators';
import FormField from '../../forms/components/FormField';

const initialStandardForm = {
  phone: '',
  date: new Date().toISOString().slice(0, 10),
  amount: '',
  paymentType: '',
  service: '',
};

const StandardPaymentForm = () => {
  const [form, setForm] = useState(initialStandardForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Auto-dismiss success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (form.phone && !validatePhone(form.phone)) return 'Enter a valid 10-digit phone number.';
    if (!validateRequired(form.date)) return 'Date is required.';
    if (!validateNumber(form.amount)) return 'Enter a valid amount.';
    if (!validateRequired(form.paymentType)) return 'Select a payment type.';
    if (!validateRequired(form.service)) return 'Select a service.';
    return null;
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
      let customerId = null;
      if (form.phone) {
        customerId = await handleCustomerLookup(form.phone);
      }
      await fetchApi(PAYMENT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: customerId,
          payment_date: form.date,
          amount: Number(form.amount),
          payment_type: form.paymentType,
          service: form.service,
        }),
      });
      setSuccess('Payment record submitted successfully!');
      setForm(initialStandardForm);
    } catch (err) {
      setError('Failed to submit payment record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6 w-full max-w-[400px] mx-auto" onSubmit={handleSubmit}>
      <FormField
        label="Customer Phone Number"
        name="phone"
        type="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="10-digit mobile number (optional)"
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
          { value: 'tattoo', label: 'Tattoo' },
          { value: 'piercing', label: 'Piercing' },
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
          { value: 'UPI', label: 'UPI' },
          { value: 'Cash', label: 'Cash' },
          { value: 'Card', label: 'Card' },
        ]}
        inputClassName="w-full max-w-[400px]"
      />
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md w-full max-w-[400px]">{error}</div>
      )}
      {success && (
        <div className="text-green-700 text-sm bg-green-50 p-3 rounded-md w-full max-w-[400px]">{success}</div>
      )}
      <div className="flex justify-start">
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Payment'}
        </button>
      </div>
    </form>
  );
};

export default StandardPaymentForm; 