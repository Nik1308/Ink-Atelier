export * from './auth';
export * from './fetch';
export * from './phone';
export * from './countryCodes';
export * from './validators';
export * from './instagram';
// Export customer utils - this handleCustomerLookup takes (phone, name)
export { handleCustomerLookup, getCustomerById, getCustomerName, getCustomerPhone } from './customer';
// Export consentFormOperations functions
export { handleCustomerLookupForForm, submitTattooConsentForm, submitPiercingConsentForm } from './consentFormOperations';

