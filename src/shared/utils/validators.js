import { validateInternationalPhone, normalizePhoneNumber } from './phone';

export function validatePhone(phone) {
  // Support both old 10-digit format (for backward compatibility) and international format
  if (/^\d{10}$/.test(phone)) {
    return true; // Old format - will be normalized to +91
  }
  return validateInternationalPhone(phone);
}

export function validateRequired(value) {
  return value !== undefined && value !== null && value !== '';
}

export function validateNumber(value) {
  return !isNaN(value) && Number(value) > 0;
}

export function validateEmail(email) {
  // Basic email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
} 