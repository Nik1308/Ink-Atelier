import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '../../../utils/Fetch';
import { PAYMENT_API_URL, ADVANCE_PAYMENT_API_URL, CUSTOMER_API_URL, TATTOO_CONSENT_FORM_API_URL, PIERCING_CONSENT_FORM_API_URL } from '../../../utils/apiUrls';

function mergeConsentForms(tattooForms, piercingForms) {
  const allForms = [
    ...(Array.isArray(tattooForms) ? tattooForms.map(form => ({ ...form, type: 'tattoo' })) : []),
    ...(Array.isArray(piercingForms) ? piercingForms.map(form => ({ ...form, type: 'piercing' })) : [])
  ];
  // Sort by created_at descending (newest first)
  return allForms.sort((a, b) => {
    const aDate = new Date(a.created_at || a.tattoo_date || a.piercing_date || 0);
    const bDate = new Date(b.created_at || b.tattoo_date || b.piercing_date || 0);
    return bDate - aDate;
  });
}

export function useAdminResources() {
  const customers = useQuery({
    queryKey: ['customers'],
    queryFn: () => fetchApi(CUSTOMER_API_URL, { method: 'GET' }),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  const payments = useQuery({
    queryKey: ['payments'],
    queryFn: () => fetchApi(PAYMENT_API_URL, { method: 'GET' }),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  const advancePayments = useQuery({
    queryKey: ['advancePayments'],
    queryFn: () => fetchApi(ADVANCE_PAYMENT_API_URL, { method: 'GET' }),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  const tattooConsents = useQuery({
    queryKey: ['tattooConsents'],
    queryFn: () => fetchApi(TATTOO_CONSENT_FORM_API_URL, { method: 'GET' }),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  const piercingConsents = useQuery({
    queryKey: ['piercingConsents'],
    queryFn: () => fetchApi(PIERCING_CONSENT_FORM_API_URL, { method: 'GET' }),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
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
  };
} 