import { useMemo } from 'react';

export const useCustomerData = (customers, consentForms, payments, searchQuery) => {
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      const nameMatch = customer.name?.toLowerCase().includes(query);
      const phoneMatch = customer.phone?.includes(searchQuery);
      return nameMatch || phoneMatch;
    });
  }, [customers, searchQuery]);

  const getCustomerConsentForms = (customerId) => {
    return consentForms.filter(form => form.customer_id === customerId);
  };

  const getCustomerPayments = (customerId) => {
    return payments.filter(payment => payment.customer_id === customerId);
  };

  return {
    filteredCustomers,
    getCustomerConsentForms,
    getCustomerPayments
  };
}; 