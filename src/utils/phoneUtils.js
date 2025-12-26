/**
 * Phone number utility functions for international support
 */

/**
 * Normalizes a phone number to international format (ensures it starts with +)
 * @param {string} phone - Phone number in any format
 * @returns {string|null} - Normalized phone number with + prefix, or null if invalid
 */
export function normalizePhoneNumber(phone) {
  if (!phone) return null;
  
  // Remove all whitespace and special characters except + and digits
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // If it already starts with +, return as is (after cleaning)
  if (cleaned.startsWith('+')) {
    return cleaned;
  }
  
  // If it starts with 00 (international format without +), replace with +
  if (cleaned.startsWith('00')) {
    return '+' + cleaned.substring(2);
  }
  
  // If it's a 10-digit number (likely Indian), add +91 for backward compatibility
  if (/^\d{10}$/.test(cleaned)) {
    return `+91${cleaned}`;
  }
  
  // If it's 11-12 digits starting with 91 (Indian without +), add +
  if (/^91\d{10}$/.test(cleaned)) {
    return `+${cleaned}`;
  }
  
  // If it's 11 digits starting with 0 (Indian landline format), remove 0 and add +91
  if (/^0\d{10}$/.test(cleaned)) {
    return `+91${cleaned.substring(1)}`;
  }
  
  // For other formats, try to detect country code
  // If it's all digits and 7-15 digits long, assume it needs a country code
  // For now, we'll require explicit + prefix for international numbers
  if (/^\d{7,15}$/.test(cleaned)) {
    // Could be international, but we don't know the country code
    // Return null to require explicit + format
    return null;
  }
  
  // If it already has +, return cleaned version
  if (cleaned.includes('+')) {
    return cleaned;
  }
  
  // If we can't determine, return null (user should enter with +)
  return null;
}

/**
 * Formats phone number for display (removes country code for display if needed)
 * @param {string} phone - Full international phone number
 * @param {boolean} showFull - If true, show full number; if false, hide country code
 * @returns {string} - Formatted phone number for display
 */
export function formatPhoneForDisplay(phone, showFull = false) {
  if (!phone) return '';
  
  if (showFull) {
    return phone;
  }
  
  // Remove + prefix for display (optional - can be customized)
  return phone.replace(/^\+/, '');
}

/**
 * Validates if a phone number is in valid international format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid international format
 */
export function validateInternationalPhone(phone) {
  if (!phone) return false;
  
  // Must start with + and have 7-15 digits after country code
  // Pattern: + followed by 1-3 digit country code, then 4-14 digits
  const internationalPattern = /^\+[1-9]\d{6,14}$/;
  
  return internationalPattern.test(phone);
}

/**
 * Extracts country code from phone number by matching against known country codes
 * @param {string} phone - International phone number
 * @param {Array} countryCodes - Array of country code objects with 'code' property
 * @returns {string|null} - Country code (e.g., "+91", "+1", "+44") or null
 */
export function extractCountryCode(phone, countryCodes = []) {
  if (!phone || !phone.startsWith('+')) return null;
  
  if (!countryCodes || countryCodes.length === 0) {
    // Fallback: try to extract 1-3 digits
    const withoutPlus = phone.substring(1);
    const match = withoutPlus.match(/^(\d{1,3})/);
    return match ? '+' + match[1] : null;
  }
  
  // Sort country codes by length (longest first) to match longer codes first
  const sortedCodes = [...countryCodes].sort((a, b) => b.code.length - a.code.length);
  
  // Try to match against known country codes
  for (const country of sortedCodes) {
    if (phone.startsWith(country.code)) {
      return country.code;
    }
  }
  
  return null;
}

/**
 * Gets the phone number without country code
 * @param {string} phone - International phone number
 * @param {Array} countryCodes - Array of country code objects with 'code' property
 * @returns {string} - Phone number without country code
 */
export function getPhoneWithoutCountryCode(phone, countryCodes = []) {
  if (!phone || !phone.startsWith('+')) return phone;
  
  if (!countryCodes || countryCodes.length === 0) {
    // Fallback: try to remove 1-3 digits
    const withoutPlus = phone.substring(1);
    const match = withoutPlus.match(/^\d{1,3}(.+)$/);
    return match ? match[1] : withoutPlus;
  }
  
  // Sort country codes by length (longest first) to match longer codes first
  const sortedCodes = [...countryCodes].sort((a, b) => b.code.length - a.code.length);
  
  // Try to match and remove known country codes
  for (const country of sortedCodes) {
    if (phone.startsWith(country.code)) {
      return phone.substring(country.code.length);
    }
  }
  
  // If no match, return without the +
  return phone.substring(1);
}

