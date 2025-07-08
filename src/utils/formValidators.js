export function validatePhone(phone) {
  return /^\d{10}$/.test(phone);
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