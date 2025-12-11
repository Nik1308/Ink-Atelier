import React, { useState, useEffect } from 'react';
import Drawer from '../../common/ui/Drawer';
import FormField from '../../forms/components/FormField';
import { PAYMENT_API_URL, TATTOO_CONSENT_FORM_API_URL, PIERCING_CONSENT_FORM_API_URL } from '../../../utils/apiUrls';
import { fetchApi } from '../../../utils/Fetch';
import { handleCustomerLookup } from '../../../utils/customerUtils';
import { FiPlus, FiTrash2, FiX } from 'react-icons/fi';

function formatDateForInput(date) {
  if (!date) return '';
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getFormUniqueId(form) {
  const formType = form.type || 'unknown';
  if (form.id) {
    return `${formType}-${form.id}`;
  }
  return `${formType}-${form.createdAt || 'no-date'}`;
}

const PaymentDrawer = ({ open, onClose, form, customer, onSuccess }) => {
  const [paymentForm, setPaymentForm] = useState({
    phone: '',
    service: '',
    date: '',
    paymentType: '',
    items: [{ name: '', amount: '', gst: '', quantity: '1', taxable: true }],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Initialize form when drawer opens
  useEffect(() => {
    if (open && form) {
      const phone = (customer && customer.phone) ? customer.phone : '';
      const service = form.type === 'tattoo' ? 'tattoo' : 'piercing';
      const dateFromForm = form.tattooDate || form.piercingDate;
      const date = dateFromForm ? formatDateForInput(dateFromForm) : new Date().toISOString().split('T')[0];
      
      setPaymentForm({
        phone,
        service,
        date,
        paymentType: '',
        items: [{ name: '', amount: '', gst: '', quantity: '1', taxable: true }],
      });
      setError(null);
      setSuccess(null);
    }
  }, [open, form, customer]);

  // Auto-dismiss success message
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
        if (onSuccess) onSuccess();
        onClose();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [success, onSuccess, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleItemChange = (index, field, value) => {
    setPaymentForm((prev) => {
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
      
      newItems[index] = updatedItem;
      
      // Calculate totals from items
      const totalAmount = newItems.reduce((sum, item) => sum + (parseFloat(item.amount || 0) * parseFloat(item.quantity || 1)), 0);
      const totalGST = newItems.reduce((sum, item) => sum + (parseFloat(item.gst || 0) * parseFloat(item.quantity || 1)), 0);
      return {
        ...prev,
        items: newItems,
      };
    });
    setError(null);
  };

  const addItem = () => {
    setPaymentForm((prev) => ({
      ...prev,
      items: [...(prev.items || []), { name: '', amount: '', gst: '', quantity: '1', taxable: true }],
    }));
  };

  const removeItem = (index) => {
    setPaymentForm((prev) => {
      const newItems = prev.items?.filter((_, i) => i !== index) || [];
      return {
        ...prev,
        items: newItems.length > 0 ? newItems : [{ name: '', amount: '', gst: '', quantity: '1', taxable: true }],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const { phone, service, date, paymentType, items } = paymentForm;

    // Validation
    if (!phone || !service || !date || !paymentType) {
      setError('All required fields must be filled.');
      setLoading(false);
      return;
    }

    // Validate items
    if (!items || items.length === 0) {
      setError('At least one item is required.');
      setLoading(false);
      return;
    }

    const invalidItems = items.filter(item => !item.name || !item.amount || !item.gst || !item.quantity);
    if (invalidItems.length > 0) {
      setError('All item fields (name, amount, GST, quantity) are required.');
      setLoading(false);
      return;
    }

    try {
      let customerId = customer?.id || form?.customerId;
      
      // Try to get customer ID by phone if not set
      if (!customerId && phone) {
        customerId = await handleCustomerLookup(phone.replace('+91', ''));
        if (!customerId) {
          setError('Could not find or create customer for payment');
          setLoading(false);
          return;
        }
      }

      // Calculate totals from items
      const totalAmount = items.reduce((sum, item) => sum + (parseFloat(item.amount || 0) * parseFloat(item.quantity || 1)), 0);
      const totalGST = items.reduce((sum, item) => sum + (parseFloat(item.gst || 0) * parseFloat(item.quantity || 1)), 0);

      await fetchApi(PAYMENT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: customerId,
          payment_date: date,
          amount: totalAmount,
          gst: totalGST,
          payment_type: paymentType,
          service: service,
          items: items.map(item => ({
            name: item.name,
            amount: parseFloat(item.amount || 0),
            gst: parseFloat(item.gst || 0),
            quantity: parseFloat(item.quantity || 1),
          })),
        })
      });

      // PATCH consent form for payment = true
      if (form) {
        let patchUrl = '';
        if (form.type === 'tattoo') patchUrl = `${TATTOO_CONSENT_FORM_API_URL}/${form.id}`;
        else if (form.type === 'piercing') patchUrl = `${PIERCING_CONSENT_FORM_API_URL}/${form.id}`;
        if (patchUrl) {
          await fetchApi(patchUrl, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ payment: true })
          });
        }
      }

      setSuccess('Payment recorded successfully!');
      setLoading(false);
    } catch (err) {
      setError('Failed to record payment. Try again.');
      setLoading(false);
    }
  };

  const totalAmount = paymentForm.items?.reduce((sum, item) => sum + (parseFloat(item.amount || 0) * parseFloat(item.quantity || 1)), 0) || 0;
  const totalGST = paymentForm.items?.reduce((sum, item) => sum + (parseFloat(item.gst || 0) * parseFloat(item.quantity || 1)), 0) || 0;
  const grandTotal = totalAmount + totalGST;

  return (
    <Drawer open={open} onClose={onClose} maxWidth="max-w-2xl" side="right">
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Record Payment</h2>
          {/* <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
            aria-label="Close drawer"
          >
            <FiX className="text-2xl" />
          </button> */}
        </div>

        <form className="flex-1 flex flex-col overflow-hidden" onSubmit={handleSubmit}>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {/* Mobile Number and Service in one row */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Mobile Number"
                labelClassName="text-gray-700 font-semibold"
                name="phone"
                type="phone"
                value={(paymentForm.phone || '').replace(/^\+91/, '')}
                required
                inputClassName="bg-white text-gray-900 border-gray-300"
                readOnly
              />
              <FormField
                label="Service"
                labelClassName="text-gray-700 font-semibold"
                name="service"
                type="text"
                value={paymentForm.service || ''}
                required
                inputClassName="bg-white text-gray-900 border-gray-300"
                readOnly
              />
            </div>

            {/* Date and Payment Type in one row */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Date"
                labelClassName="text-gray-700 font-semibold"
                name="date"
                type="date"
                value={paymentForm.date || ''}
                required
                inputClassName="bg-white text-gray-900 border-gray-300"
                readOnly
              />
              <FormField
                label="Payment Type"
                labelClassName="text-gray-700 font-semibold"
                name="paymentType"
                type="select"
                value={paymentForm.paymentType || ''}
                required
                options={[
                  { value: 'UPI', label: 'UPI' },
                  { value: 'Cash', label: 'Cash' },
                  { value: 'Card', label: 'Card' },
                ]}
                inputClassName="bg-white text-gray-900 border-gray-300"
                onChange={handleChange}
              />
            </div>

            {/* Items Section */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900 font-semibold text-lg">Items</h3>
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
                {(paymentForm.items || []).map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-600 text-sm font-medium">Item {index + 1}</span>
                      {(paymentForm.items || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-700 transition"
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
                        inputClassName="bg-white text-gray-900 border-gray-300"
                        labelClassName="text-gray-700 font-semibold text-sm"
                      />
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="checkbox"
                          id={`taxable-${index}`}
                          checked={item.taxable || false}
                          onChange={(e) => handleItemChange(index, 'taxable', e.target.checked)}
                          className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <label htmlFor={`taxable-${index}`} className="text-sm font-medium text-gray-700 cursor-pointer">
                          Taxable (5% GST)
                        </label>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <FormField
                          label="Quantity"
                          name={`item-quantity-${index}`}
                          type="number"
                          value={item.quantity || '1'}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          required
                          min="1"
                          placeholder="Qty"
                          inputClassName="bg-white text-gray-900 border-gray-300"
                          labelClassName="text-gray-700 font-semibold text-sm"
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
                          labelClassName="text-gray-700 font-semibold text-sm"
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
                          labelClassName="text-gray-700 font-semibold text-sm"
                          readOnly={item.taxable}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Summary */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center text-gray-700 mb-2">
                  <span className="font-semibold">Total Amount:</span>
                  <span className="font-bold text-lg">₹{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-gray-700 mb-2">
                  <span className="font-semibold">Total GST:</span>
                  <span className="font-bold text-lg">₹{totalGST.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-gray-900 mt-3 pt-3 border-t border-gray-300">
                  <span className="font-bold text-base">Grand Total:</span>
                  <span className="font-bold text-xl">₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Error and Success Messages */}
          <div className="mt-4 space-y-2">
            {error && (
              <div className="bg-red-50 text-red-800 px-4 py-3 rounded-lg text-sm font-semibold border border-red-200">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 text-green-800 px-4 py-3 rounded-lg text-sm font-semibold border border-green-200">
                {success}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-lg font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow transition"
            >
              {loading ? 'Recording...' : 'Submit Payment'}
            </button>
          </div>
        </form>
      </div>
    </Drawer>
  );
};

export default PaymentDrawer;

