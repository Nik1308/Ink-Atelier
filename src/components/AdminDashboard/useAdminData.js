import { useState, useEffect } from 'react';
import { fetchCustomers, fetchConsentForms, fetchPayments } from './adminDataService';

export const useAdminData = (userData, activeTab) => {
  const [customers, setCustomers] = useState([]);
  const [consentForms, setConsentForms] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userData && activeTab === 'customers') {
      loadData();
    }
  }, [userData, activeTab]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [customersData, formsData, paymentsData] = await Promise.all([
        fetchCustomers(),
        fetchConsentForms(),
        fetchPayments()
      ]);
      
      setCustomers(customersData);
      setConsentForms(formsData);
      setPayments(paymentsData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadData();
  };

  return {
    customers,
    consentForms,
    payments,
    loading,
    error,
    refreshData
  };
}; 