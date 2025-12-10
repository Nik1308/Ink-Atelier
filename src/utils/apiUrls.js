import { INSTAGRAM_USER_ID, ACCESS_TOKEN } from "./secrets";

export const INSTAGRAM_API_URL = `https://graph.instagram.com/${INSTAGRAM_USER_ID}/media?fields=id,caption,media_url,permalink,media_type,thumbnail_url,timestamp&access_token=${ACCESS_TOKEN}&limit=10`;

// API Base URL
export const API_BASE_URL = "https://inkatelier-backend-production.up.railway.app";

export const TATTOO_CONSENT_FORM_API_URL = `${API_BASE_URL}/tattoo_consent_form`;

export const UPLOAD_IMAGE_API_URL = `${API_BASE_URL}/upload/image`;

export const CUSTOMER_API_URL = `${API_BASE_URL}/customer`;

export const PIERCING_CONSENT_FORM_API_URL = `${API_BASE_URL}/piercing_consent_form`;

export const PAYMENT_API_URL = `${API_BASE_URL}/payment`;

export const ADVANCE_PAYMENT_API_URL = `${API_BASE_URL}/advance_payment`;

export const LEADS_API_URL = `${API_BASE_URL}/leads`;

export const EXPENSE_API_URL = `${API_BASE_URL}/expense`;
 
// Backend PDF and WhatsApp service URLs
export const GENERATE_CONSENT_PDF_URL = `${API_BASE_URL}/generate-consent-pdf`;
export const GENERATE_PDF_ONLY_URL = `${API_BASE_URL}/generate-pdf-only`;
export const SEND_WHATSAPP_MESSAGE_URL = `${API_BASE_URL}/send-whatsapp-message`;

// Authentication API URLs
export const LOGIN_API_URL = `${API_BASE_URL}/auth/login`;
export const LOGOUT_API_URL = `${API_BASE_URL}/auth/logout`;
 
// Add more API URLs here as needed 