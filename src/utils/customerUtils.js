import { fetchApi } from './Fetch';
import { CUSTOMER_API_URL } from './apiUrls';

/**
 * Looks up a customer by phone, or creates a new one if not found.
 * @param {string} phone - Customer phone number (optional)
 * @param {string} name - Customer name (optional, used if creating)
 * @returns {Promise<string|null>} - Customer ID or null if no phone
 */
export async function handleCustomerLookup(phone, name = '') {
  if (!phone) return null;
  try {
    const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`;
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
          name: name || '',
          phone: formattedPhone,
          email: '',
          date_of_birth: '',
          address: '',
        }),
      });
      return newCustomer.id;
    }
  } catch (error) {
    throw new Error('Customer lookup/creation failed: ' + error.message);
  }
} 