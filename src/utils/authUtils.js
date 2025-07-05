// Authentication utility functions

/**
 * Store authentication token with expiration date (90 days from now)
 * @param {string} token - The authentication token
 * @param {object} userData - User data to store
 */
export const storeAuthToken = (token, userData = {}) => {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 90); // 90 days from now
  
  localStorage.setItem('authToken', token);
  localStorage.setItem('userData', JSON.stringify(userData));
  localStorage.setItem('tokenExpiration', expirationDate.toISOString());
};

/**
 * Check if the current authentication token is valid
 * @returns {boolean} - True if token exists and is not expired
 */
export const isTokenValid = () => {
  const token = localStorage.getItem('authToken');
  const expirationDate = localStorage.getItem('tokenExpiration');
  
  if (!token || !expirationDate) {
    return false;
  }
  
  const now = new Date();
  const expiration = new Date(expirationDate);
  
  return now < expiration;
};

/**
 * Get the current authentication token if valid
 * @returns {string|null} - The token if valid, null otherwise
 */
export const getAuthToken = () => {
  if (isTokenValid()) {
    return localStorage.getItem('authToken');
  }
  
  // Clear expired token
  clearAuthData();
  return null;
};

/**
 * Get stored user data
 * @returns {object|null} - User data if available, null otherwise
 */
export const getUserData = () => {
  if (isTokenValid()) {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }
  
  return null;
};

/**
 * Clear all authentication data
 */
export const clearAuthData = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
  localStorage.removeItem('tokenExpiration');
};

/**
 * Get token expiration date
 * @returns {Date|null} - Expiration date if available, null otherwise
 */
export const getTokenExpiration = () => {
  const expirationDate = localStorage.getItem('tokenExpiration');
  return expirationDate ? new Date(expirationDate) : null;
};

/**
 * Get days remaining until token expires
 * @returns {number} - Days remaining (negative if expired)
 */
export const getDaysUntilExpiration = () => {
  const expiration = getTokenExpiration();
  if (!expiration) return -1;
  
  const now = new Date();
  const diffTime = expiration - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * Check if token will expire soon (within 7 days)
 * @returns {boolean} - True if token expires within 7 days
 */
export const isTokenExpiringSoon = () => {
  const daysRemaining = getDaysUntilExpiration();
  return daysRemaining >= 0 && daysRemaining <= 7;
}; 