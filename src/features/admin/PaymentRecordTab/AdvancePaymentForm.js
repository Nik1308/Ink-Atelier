import React, { useState, useEffect } from 'react';
import { ADVANCE_PAYMENT_API_URL, PAYMENT_API_URL, fetchApi, handleCustomerLookup } from '../../../utils';
import { validatePhone, validateRequired, validateNumber } from '../../../utils/formValidators';
import FormField from '../../forms/components/FormField';

const initialAdvanceForm = {
  name: '',
  phone: '',
  appointmentDate: '',
  advanceAmount: '',
  totalQuotePrice: '',
  service: '',
  paymentDate: '',
};

const AdvancePaymentForm = () => {
  const [advanceForm, setAdvanceForm] = useState(initialAdvanceForm);
  const [advanceLoading, setAdvanceLoading] = useState(false);
  const [advanceError, setAdvanceError] = useState(null);
  const [advanceSuccess, setAdvanceSuccess] = useState(null);

  // Auto-dismiss advanceSuccess message after 3 seconds
  useEffect(() => {
    if (advanceSuccess) {
      const timer = setTimeout(() => setAdvanceSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [advanceSuccess]);

  const handleAdvanceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAdvanceForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const validateAdvance = () => {
    if (!validateRequired(advanceForm.name)) return 'Customer name is required.';
    if (!validatePhone(advanceForm.phone)) return 'Enter a valid phone number with country code (e.g., +919876543210).';
    if (!validateRequired(advanceForm.appointmentDate)) return 'Appointment date is required.';
    if (!validateNumber(advanceForm.advanceAmount)) return 'Enter a valid advance amount.';
    if (!validateNumber(advanceForm.totalQuotePrice)) return 'Enter a valid total quote price.';
    if (!validateRequired(advanceForm.service)) return 'Select a service.';
    return null;
  };

  const handleAdvanceSubmit = async (e) => {
    e.preventDefault();
    setAdvanceError(null);
    setAdvanceSuccess(null);
    const validationError = validateAdvance();
    if (validationError) {
      setAdvanceError(validationError);
      return;
    }
    setAdvanceLoading(true);
    try {
      // 1. Lookup or create customer
      const customerId = await handleCustomerLookup(advanceForm.phone, advanceForm.name);
      // 2. Fire advance payment API
      await fetchApi(ADVANCE_PAYMENT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: customerId,
          appointment_date: advanceForm.appointmentDate,
          advance_amount: Number(advanceForm.advanceAmount),
          due_amount: Number(advanceForm.totalQuotePrice),
          service: advanceForm.service,
          fulfillment: false,
        }),
      });
      // 3. Fire normal payment API for advance amount
      await fetchApi(PAYMENT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: customerId,
          payment_date: advanceForm.paymentDate,
          amount: Number(advanceForm.advanceAmount),
          payment_type: 'Advance',
          service: advanceForm.service,
        }),
      });
      setAdvanceSuccess('Advance payment recorded successfully!');
      setAdvanceForm(initialAdvanceForm);
    } catch (err) {
      setAdvanceError('Failed to submit advance payment. Please try again.');
    } finally {
      setAdvanceLoading(false);
    }
  };

  return (
    <form className="space-y-6 w-full max-w-[400px] mx-auto" onSubmit={handleAdvanceSubmit}>
      <FormField
        label="Customer Name"
        name="name"
        type="text"
        value={advanceForm.name}
        onChange={handleAdvanceChange}
        required
        placeholder="Customer name"
        inputClassName="w-full max-w-[400px]"
        labelClassName="text-white font-semibold"
      />
      <FormField
        label="Customer Phone Number"
        name="phone"
        type="phone"
        value={advanceForm.phone}
        onChange={handleAdvanceChange}
        required
        placeholder="Country code and number (e.g., 919876543210)"
        inputClassName="w-full max-w-[400px]"
        labelClassName="text-white font-semibold"
      />
      <div className="flex gap-4">
        <FormField
          label="Appointment Date"
          name="appointmentDate"
          type="date"
          value={advanceForm.appointmentDate}
          onChange={handleAdvanceChange}
          required
          inputClassName="w-full"
          labelClassName="text-white font-semibold"
        />
        <FormField
          label="Payment Date"
          name="paymentDate"
          type="date"
          value={advanceForm.paymentDate}
          onChange={handleAdvanceChange}
          required
          inputClassName="w-full"
          labelClassName="text-white font-semibold"
        />
      </div>
      <div className="flex gap-4">
        <FormField
          label="Advance Amount (₹)"
          name="advanceAmount"
          type="number"
          value={advanceForm.advanceAmount}
          onChange={handleAdvanceChange}
          required
          min="1"
          placeholder="Enter advance amount"
          inputClassName="w-full"
          labelClassName="text-white font-semibold"
        />
        <FormField
          label="Due Amount (₹)"
          name="totalQuotePrice"
          type="number"
          value={advanceForm.totalQuotePrice}
          onChange={handleAdvanceChange}
          required
          min="1"
          placeholder="Enter due amount"
          inputClassName="w-full"
          labelClassName="text-white font-semibold"
        />
      </div>
      <FormField
        label="Service"
        name="service"
        type="select"
        value={advanceForm.service}
        onChange={handleAdvanceChange}
        required
        options={[
          { value: 'tattoo', label: 'Tattoo' },
          { value: 'piercing', label: 'Piercing' },
        ]}
        inputClassName="w-full max-w-[400px]"
        labelClassName="text-white font-semibold"
      />
      {advanceError && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md w-full max-w-[400px]">{advanceError}</div>
      )}
      {advanceSuccess && (
        <div className="text-green-700 text-sm bg-green-50 p-3 rounded-md w-full max-w-[400px]">{advanceSuccess}</div>
      )}
      <div className="flex justify-start">
        <button
          type="submit"
          disabled={advanceLoading}
          className="w-full py-3 mt-2 rounded-xl shadow-lg text-lg font-bold bg-white text-black border border-white/60 hover:bg-gray-100 focus:outline-none disabled:opacity-50 transition"
        >
          {advanceLoading ? 'Submitting...' : 'Submit Advance Payment'}
        </button>
      </div>
    </form>
  );
};

export default AdvancePaymentForm; 