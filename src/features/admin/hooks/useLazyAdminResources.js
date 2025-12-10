import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '../../../utils/Fetch';
import { 
  PAYMENT_API_URL, 
  ADVANCE_PAYMENT_API_URL, 
  CUSTOMER_API_URL, 
  TATTOO_CONSENT_FORM_API_URL, 
  PIERCING_CONSENT_FORM_API_URL, 
  EXPENSE_API_URL,
  LEADS_API_URL
} from '../../../utils/apiUrls';

function mergeConsentForms(tattooForms, piercingForms) {
  const allForms = [
    ...(Array.isArray(tattooForms) ? tattooForms.map(form => ({ ...form, type: 'tattoo' })) : []),
    ...(Array.isArray(piercingForms) ? piercingForms.map(form => ({ ...form, type: 'piercing' })) : [])
  ];
  // Sort by createdAt descending (newest first)
  return allForms.sort((a, b) => {
    const aDate = new Date(a.createdAt || a.tattooDate || a.piercingDate || 0);
    const bDate = new Date(b.createdAt || b.tattooDate || b.piercingDate || 0);
    return bDate - aDate;
  });
}

/**
 * Lazy-loading admin resources hook
 * Only fetches data when enabled is true
 */
export function useLazyAdminResources(options = {}) {
  const {
    enableCustomers = false,
    enablePayments = false,
    enableAdvancePayments = false,
    enableTattooConsents = false,
    enablePiercingConsents = false,
    enableExpenses = false,
    enableLeads = false,
  } = options;

  const customers = useQuery({
    queryKey: ['customers', enableCustomers],
    queryFn: () => fetchApi(CUSTOMER_API_URL, { method: 'GET' }),
    enabled: enableCustomers,
    staleTime: 30 * 1000, // 30 seconds - data is fresh for 30s, then refetches on mount
    refetchInterval: enableCustomers ? 5 * 60 * 1000 : false,
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Refetch when component mounts (tab changes)
  });

  const payments = useQuery({
    queryKey: ['payments', enablePayments],
    queryFn: () => fetchApi(PAYMENT_API_URL, { method: 'GET' }),
    enabled: enablePayments,
    staleTime: 30 * 1000, // 30 seconds - data is fresh for 30s, then refetches on mount
    refetchInterval: enablePayments ? 5 * 60 * 1000 : false,
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Refetch when component mounts (tab changes)
  });

  const advancePayments = useQuery({
    queryKey: ['advancePayments', enableAdvancePayments],
    queryFn: () => fetchApi(ADVANCE_PAYMENT_API_URL, { method: 'GET' }),
    enabled: enableAdvancePayments,
    staleTime: 30 * 1000, // 30 seconds - data is fresh for 30s, then refetches on mount
    refetchInterval: enableAdvancePayments ? 5 * 60 * 1000 : false,
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Refetch when component mounts (tab changes)
  });

  const tattooConsents = useQuery({
    queryKey: ['tattooConsents', enableTattooConsents],
    queryFn: () => fetchApi(TATTOO_CONSENT_FORM_API_URL, { method: 'GET' }),
    enabled: enableTattooConsents,
    staleTime: 30 * 1000, // 30 seconds - data is fresh for 30s, then refetches on mount
    refetchInterval: enableTattooConsents ? 5 * 60 * 1000 : false,
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Refetch when component mounts (tab changes)
  });

  const piercingConsents = useQuery({
    queryKey: ['piercingConsents', enablePiercingConsents],
    queryFn: () => fetchApi(PIERCING_CONSENT_FORM_API_URL, { method: 'GET' }),
    enabled: enablePiercingConsents,
    staleTime: 30 * 1000, // 30 seconds - data is fresh for 30s, then refetches on mount
    refetchInterval: enablePiercingConsents ? 5 * 60 * 1000 : false,
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Refetch when component mounts (tab changes)
  });

  const expenses = useQuery({
    queryKey: ['expenses', enableExpenses],
    queryFn: () => fetchApi(EXPENSE_API_URL, { method: 'GET' }),
    enabled: enableExpenses,
    staleTime: 30 * 1000, // 30 seconds - data is fresh for 30s, then refetches on mount
    refetchInterval: enableExpenses ? 5 * 60 * 1000 : false,
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Refetch when component mounts (tab changes)
  });

  const leads = useQuery({
    queryKey: ['leads', enableLeads],
    queryFn: () => fetchApi(LEADS_API_URL, { method: 'GET' }),
    enabled: enableLeads,
    staleTime: 30 * 1000, // 30 seconds - data is fresh for 30s, then refetches on mount
    refetchInterval: enableLeads ? 5 * 60 * 1000 : false,
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Refetch when component mounts (tab changes)
  });

  // Combine and normalize consent forms with type
  const consentForms = mergeConsentForms(tattooConsents.data, piercingConsents.data);

  return {
    customers,
    payments,
    advancePayments,
    tattooConsents,
    piercingConsents,
    consentForms,
    expenses,
    leads,
  };
}

