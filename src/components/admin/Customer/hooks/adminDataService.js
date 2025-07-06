import { fetchApi, CUSTOMER_API_URL, TATTOO_CONSENT_FORM_API_URL, PIERCING_CONSENT_FORM_API_URL, PAYMENT_API_URL } from '../../../../utils';

export const fetchCustomers = async () => {
  try {
    // console.log('Fetching customers from:', CUSTOMER_API_URL);
    const response = await fetchApi(CUSTOMER_API_URL, { method: 'GET' });
    // console.log('Customers response:', response);
    return Array.isArray(response) ? response : [];
  } catch (error) {
    // console.error('Error fetching customers:', error);
    throw new Error('Failed to fetch customers');
  }
};

export const fetchConsentForms = async () => {
  try {
    // console.log('Fetching consent forms...');
    const [tattooForms, piercingForms] = await Promise.all([
      fetchApi(TATTOO_CONSENT_FORM_API_URL, { method: 'GET' }),
      fetchApi(PIERCING_CONSENT_FORM_API_URL, { method: 'GET' })
    ]);

    // console.log('Tattoo forms:', tattooForms);
    // console.log('Piercing forms:', piercingForms);

    const allForms = [
      ...(Array.isArray(tattooForms) ? tattooForms.map(form => ({ ...form, type: 'tattoo' })) : []),
      ...(Array.isArray(piercingForms) ? piercingForms.map(form => ({ ...form, type: 'piercing' })) : [])
    ];

    // console.log('All forms:', allForms);
    return allForms;
  } catch (error) {
    // console.error('Error fetching consent forms:', error);
    throw new Error('Failed to fetch consent forms');
  }
};

export const fetchPayments = async () => {
  try {
    // console.log('Fetching payments from:', PAYMENT_API_URL);
    const response = await fetchApi(PAYMENT_API_URL, { method: 'GET' });
    // console.log('Payments response:', response);
    return Array.isArray(response) ? response : [];
  } catch (error) {
    // console.error('Error fetching payments:', error);
    throw new Error('Failed to fetch payments');
  }
}; 