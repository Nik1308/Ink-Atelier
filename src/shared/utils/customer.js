import { fetchApi } from './fetch';
import { CUSTOMER_API_URL } from '../api/endpoints';
import { normalizePhoneNumber } from './phone';

/**
 * Looks up a customer by phone, or creates a new one if not found.
 * @param {string} phone - Customer phone number (optional)
 * @param {string} name - Customer name (optional, used if creating)
 * @returns {Promise<string|null>} - Customer ID or null if no phone
 */
export async function handleCustomerLookup(phone, name = '') {
  if (!phone) return null;
  try {
    const formattedPhone = normalizePhoneNumber(phone);
    if (!formattedPhone) {
      throw new Error('Invalid phone number format. Please enter with country code (e.g., +91xxxxxxxxxx)');
    }
    const customers = await fetchApi(CUSTOMER_API_URL, { method: 'GET' });
    const existingCustomer = Array.isArray(customers)
      ? customers.find(c => c.phone === formattedPhone)
      : null;
    if (existingCustomer) {
      return existingCustomer.id;
    } else {
      // Create new customer
      const newCustomer = await fetchApi(CUSTOMER_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name || 'Unknown Customer',
          phone: formattedPhone,
        }),
      });
      return newCustomer.id;
    }
  } catch (error) {
    throw new Error('Customer lookup/creation failed: ' + error.message);
  }
}

export function getCustomerById(customers, id) {
  return customers?.find((c) => c.id === id) || {};
}

export function getCustomerName(customers, id) {
  const customer = getCustomerById(customers, id);
  return customer.name || 'Unknown';
}

export function getCustomerPhone(customers, id) {
  const customer = getCustomerById(customers, id);
  return customer.phone || 'N/A';
} 