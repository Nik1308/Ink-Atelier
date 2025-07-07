import { useState } from 'react';
import { EXPENSE_API_URL, fetchApi } from '../../../utils';
import FormField from '../../forms/FormField';

const initialExpenseForm = {
  expenseDate: new Date().toISOString().slice(0, 10),
  amount: '',
  purpose: '',
  paymentMethod: '',
};

const ExpenseForm = () => {
  const [expenseForm, setExpenseForm] = useState(initialExpenseForm);
  const [expenseLoading, setExpenseLoading] = useState(false);
  const [expenseError, setExpenseError] = useState(null);
  const [expenseSuccess, setExpenseSuccess] = useState(null);

  const handleExpenseChange = (e) => {
    const { name, value } = e.target;
    setExpenseForm((f) => ({ ...f, [name]: value }));
  };

  const validateExpense = () => {
    if (!expenseForm.expenseDate) return 'Expense date is required.';
    if (!expenseForm.amount || isNaN(expenseForm.amount) || Number(expenseForm.amount) < 1) return 'Enter a valid amount.';
    if (!expenseForm.purpose) return 'Purpose is required.';
    if (!expenseForm.paymentMethod) return 'Select a payment method.';
    return null;
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    setExpenseError(null);
    setExpenseSuccess(null);
    setExpenseLoading(true);
    const validationError = validateExpense();
    if (validationError) {
      setExpenseError(validationError);
      setExpenseLoading(false);
      return;
    }
    try {
      await fetchApi(EXPENSE_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expense_date: expenseForm.expenseDate,
          amount: Number(expenseForm.amount),
          purpose: expenseForm.purpose,
          payment_method: expenseForm.paymentMethod,
        }),
      });
      setExpenseSuccess('Expense recorded successfully!');
      setExpenseForm(initialExpenseForm);
    } catch (err) {
      setExpenseError('Failed to submit expense. Please try again.');
    } finally {
      setExpenseLoading(false);
    }
  };

  return (
    <form className="space-y-6 w-full max-w-[400px] mx-auto" onSubmit={handleExpenseSubmit}>
      <FormField
        label="Expense Date"
        name="expenseDate"
        type="date"
        value={expenseForm.expenseDate}
        onChange={handleExpenseChange}
        required
        inputClassName="w-full max-w-[400px]"
      />
      <FormField
        label="Amount (₹)"
        name="amount"
        type="number"
        value={expenseForm.amount}
        onChange={handleExpenseChange}
        required
        min="1"
        placeholder="Enter amount"
        inputClassName="w-full max-w-[400px]"
      />
      <FormField
        label="Purpose"
        name="purpose"
        type="text"
        value={expenseForm.purpose}
        onChange={handleExpenseChange}
        required
        placeholder="Purpose of expense"
        inputClassName="w-full max-w-[400px]"
      />
      <FormField
        label="Payment Method"
        name="paymentMethod"
        type="select"
        value={expenseForm.paymentMethod}
        onChange={handleExpenseChange}
        required
        options={[
          { value: 'UPI', label: 'UPI' },
          { value: 'Cash', label: 'Cash' },
          { value: 'Card', label: 'Card' },
        ]}
        inputClassName="w-full max-w-[400px]"
      />
      {expenseError && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md w-full max-w-[400px]">{expenseError}</div>
      )}
      {expenseSuccess && (
        <div className="text-green-700 text-sm bg-green-50 p-3 rounded-md w-full max-w-[400px]">{expenseSuccess}</div>
      )}
      <div className="flex justify-start">
        <button
          type="submit"
          disabled={expenseLoading}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {expenseLoading ? 'Submitting...' : 'Submit Expense'}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm; 