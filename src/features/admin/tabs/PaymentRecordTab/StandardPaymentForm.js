import React, { useState, useEffect } from 'react';
import { PAYMENT_API_URL } from '../../../../shared/api';
import { fetchApi } from '../../../../shared/utils/fetch';
import { handleCustomerLookup } from '../../../../shared/utils/customer';
import { validatePhone, validateRequired, validateNumber } from '../../../../shared/utils/validators';
import { FormField } from '../../../../shared';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

const initialStandardForm = {
  name: '',
  phone: '',
  date: new Date().toISOString().slice(0, 10),
  paymentType: '',
  service: '',
  items: [{ name: '', amount: '', gst: '', quantity: '1', taxable: true }],
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

  const handleItemChange = (index, field, value) => {
    setForm((prev) => {
      const newItems = [...(prev.items || [])];
      const updatedItem = { ...newItems[index], [field]: value };
      
      // Auto-calculate GST if taxable checkbox is toggled or amount changes
      if (field === 'taxable' || field === 'amount') {
        if (updatedItem.taxable && updatedItem.amount) {
          // Calculate 5% GST of amount
          updatedItem.gst = (parseFloat(updatedItem.amount || 0) * 0.05).toFixed(2);
        } else if (field === 'taxable' && !updatedItem.taxable) {
          // If unchecked, set GST to 0
          updatedItem.gst = '0';
        }
      }
      
      // For quantity, allow empty value during editing but don't enforce min yet
      if (field === 'quantity') {
        // Allow empty string, but if it's a number, ensure it's at least 1
        if (value !== '' && value !== null && value !== undefined) {
          const numValue = parseFloat(value);
          if (!isNaN(numValue) && numValue < 1) {
            updatedItem.quantity = '1';
          } else {
            updatedItem.quantity = value;
          }
        } else {
          updatedItem.quantity = value; // Allow empty for clearing
        }
      }
      
      newItems[index] = updatedItem;
      
      // Calculate totals from items (use 1 as default for empty quantity)
      const totalAmount = newItems.reduce((sum, item) => sum + (parseFloat(item.amount || 0) * parseFloat(item.quantity || 1)), 0);
      const totalGST = newItems.reduce((sum, item) => sum + (parseFloat(item.gst || 0) * parseFloat(item.quantity || 1)), 0);
      return {
        ...prev,
        items: newItems,
      };
    });
    setError(null);
  };

  const handleQuantityBlur = (index) => {
    setForm((prev) => {
      const newItems = [...(prev.items || [])];
      const item = newItems[index];
      // If quantity is empty or invalid, set to 1
      if (!item.quantity || item.quantity === '' || parseFloat(item.quantity) < 1) {
        item.quantity = '1';
        newItems[index] = item;
        return {
          ...prev,
          items: newItems,
        };
      }
      return prev;
    });
  };

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [...(prev.items || []), { name: '', amount: '', gst: '', quantity: '1', taxable: true }],
    }));
  };

  const removeItem = (index) => {
    setForm((prev) => {
      const newItems = prev.items?.filter((_, i) => i !== index) || [];
      return {
        ...prev,
        items: newItems.length > 0 ? newItems : [{ name: '', amount: '', gst: '', quantity: '1', taxable: true }],
      };
    });
  };

  const validate = () => {
    if (!validateRequired(form.name)) return 'Customer name is required.';
    if (!validateRequired(form.phone)) return 'Phone number is required.';
    if (!validatePhone(form.phone)) return 'Enter a valid phone number with country code (e.g., +919876543210).';
    if (!validateRequired(form.date)) return 'Date is required.';
    if (!validateRequired(form.paymentType)) return 'Select a payment type.';
    if (!validateRequired(form.service)) return 'Select a service.';
    
    // Validate items
    if (!form.items || form.items.length === 0) {
      return 'At least one item is required.';
    }
    
    const invalidItems = form.items.filter(item => !item.name || !item.amount || !item.gst || !item.quantity);
    if (invalidItems.length > 0) {
      return 'All item fields (name, amount, GST, quantity) are required.';
    }
    
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
      const customerId = await handleCustomerLookup(form.phone, form.name);
      
      // Calculate totals from items
      const totalAmount = form.items.reduce((sum, item) => sum + (parseFloat(item.amount || 0) * parseFloat(item.quantity || 1)), 0);
      const totalGST = form.items.reduce((sum, item) => sum + (parseFloat(item.gst || 0) * parseFloat(item.quantity || 1)), 0);
      
      await fetchApi(PAYMENT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: customerId,
          payment_date: form.date,
          amount: totalAmount,
          gst: totalGST,
          payment_type: form.paymentType,
          service: form.service,
          items: form.items.map(item => ({
            name: item.name,
            amount: parseFloat(item.amount || 0),
            gst: parseFloat(item.gst || 0),
            quantity: parseFloat(item.quantity || 1),
          })),
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

  // Calculate totals for display
  const totalAmount = form.items.reduce((sum, item) => sum + (parseFloat(item.amount || 0) * parseFloat(item.quantity || 1)), 0);
  const totalGST = form.items.reduce((sum, item) => sum + (parseFloat(item.gst || 0) * parseFloat(item.quantity || 1)), 0);
  const grandTotal = totalAmount + totalGST;

  return (
    <form className="space-y-6 w-full max-w-2xl mx-auto" onSubmit={handleSubmit}>
      {/* Phone Number - Full Width */}
      <FormField
        label="Customer Phone Number"
        name="phone"
        type="phone"
        value={form.phone}
        onChange={handleChange}
        required
        placeholder="Country code and number (e.g., 919876543210)"
        inputClassName="w-full"
        labelClassName="text-white font-semibold"
      />
      
      {/* Name and Date in one row */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Customer Name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="Enter customer name"
          inputClassName="w-full"
          labelClassName="text-white font-semibold"
        />
        <FormField
          label="Payment Date"
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
          inputClassName="w-full"
          labelClassName="text-white font-semibold"
        />
      </div>
      
      {/* Service and Payment Type in one row */}
      <div className="grid grid-cols-2 gap-4">
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
          inputClassName="w-full"
          labelClassName="text-white font-semibold"
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
          inputClassName="w-full"
          labelClassName="text-white font-semibold"
        />
      </div>
      
      {/* Items Section */}
      <div className="border-t border-white/20 pt-4 mt-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-lg">Items</h3>
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition text-sm font-semibold"
          >
            <FiPlus className="text-sm" />
            Add Item
          </button>
        </div>

        <div className="space-y-4">
          {(form.items || []).map((item, index) => (
            <div key={index} className="bg-white/10 rounded-lg p-4 border border-white/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/80 text-sm font-medium">Item {index + 1}</span>
                {(form.items || []).length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-400 hover:text-red-300 transition"
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                )}
              </div>
              <div className="space-y-3">
                <FormField
                  label="Item Name"
                  name={`item-name-${index}`}
                  type="text"
                  value={item.name || ''}
                  onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                  required
                  placeholder="Enter item name"
                  inputClassName="w-full bg-white text-gray-900 border-gray-300"
                  labelClassName="text-white font-semibold text-sm"
                />
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    id={`taxable-${index}`}
                    checked={item.taxable || false}
                    onChange={(e) => handleItemChange(index, 'taxable', e.target.checked)}
                    className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor={`taxable-${index}`} className="text-sm font-medium text-white cursor-pointer">
                    Taxable (5% GST)
                  </label>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <FormField
                    label="Quantity"
                    name={`item-quantity-${index}`}
                    type="number"
                    value={item.quantity || ''}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    onBlur={() => handleQuantityBlur(index)}
                    required
                    min="1"
                    step="1"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    placeholder="Qty"
                    inputClassName="bg-white text-gray-900 border-gray-300"
                    labelClassName="text-white font-semibold text-sm"
                  />
                  <FormField
                    label="Amount (₹)"
                    name={`item-amount-${index}`}
                    type="number"
                    value={item.amount || ''}
                    onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                    required
                    min="0"
                    placeholder="Amount"
                    inputClassName="bg-white text-gray-900 border-gray-300"
                    labelClassName="text-white font-semibold text-sm"
                  />
                  <FormField
                    label="GST (₹)"
                    name={`item-gst-${index}`}
                    type="number"
                    value={item.gst || ''}
                    onChange={(e) => handleItemChange(index, 'gst', e.target.value)}
                    required
                    min="0"
                    placeholder="GST"
                    inputClassName="bg-white text-gray-900 border-gray-300"
                    labelClassName="text-white font-semibold text-sm"
                    readOnly={item.taxable}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total Summary */}
        <div className="mt-6 pt-4 border-t border-white/20">
          <div className="flex justify-between items-center text-white mb-2">
            <span className="font-semibold">Total Amount:</span>
            <span className="font-bold text-lg">₹{totalAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-white mb-2">
            <span className="font-semibold">Total GST:</span>
            <span className="font-bold text-lg">₹{totalGST.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-white mt-3 pt-3 border-t border-white/30">
            <span className="font-bold text-base">Grand Total:</span>
            <span className="font-bold text-xl">₹{grandTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>
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
          className="w-full py-3 mt-2 rounded-xl shadow-lg text-lg font-bold bg-white text-black border border-white/60 hover:bg-gray-100 focus:outline-none disabled:opacity-50 transition"
        >
          {loading ? 'Submitting...' : 'Submit Payment'}
        </button>
      </div>
    </form>
  );
};

export default StandardPaymentForm; 