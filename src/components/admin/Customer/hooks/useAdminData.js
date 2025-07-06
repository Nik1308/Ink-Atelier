import { useQuery } from '@tanstack/react-query';
import { fetchCustomers, fetchConsentForms, fetchPayments } from './adminDataService';

// Fetch all admin data in one go
async function fetchAdminData() {
  const [customers, consentForms, payments] = await Promise.all([
    fetchCustomers(),
    fetchConsentForms(),
    fetchPayments(),
  ]);
  return { customers, consentForms, payments };
}

export const useAdminData = () => {
  const {
    data,
    isLoading: loading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['adminData'],
    queryFn: fetchAdminData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Manual refresh method
  const refreshData = () => {
    refetch();
  };

  return {
    customers: data?.customers || [],
    consentForms: data?.consentForms || [],
    payments: data?.payments || [],
    loading: loading || isFetching,
    error: error ? error.message : null,
    refreshData,
  };
}; 