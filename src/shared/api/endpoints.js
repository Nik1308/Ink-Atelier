import { INSTAGRAM_USER_ID, ACCESS_TOKEN } from "../../utils/secrets";

// API Base URL
export const API_BASE_URL = "https://inkatelier-backend-production.up.railway.app";

// Instagram API
export const INSTAGRAM_API_URL = `https://graph.facebook.com/${INSTAGRAM_USER_ID}/media?fields=id,caption,media_url,permalink,media_type,thumbnail_url,timestamp&access_token=${ACCESS_TOKEN}&limit=12`;

// Consent Forms
export const TATTOO_CONSENT_FORM_API_URL = `${API_BASE_URL}/tattoo_consent_form`;
export const PIERCING_CONSENT_FORM_API_URL = `${API_BASE_URL}/piercing_consent_form`;

// Customer
export const CUSTOMER_API_URL = `${API_BASE_URL}/customer`;

// Payments
export const PAYMENT_API_URL = `${API_BASE_URL}/payment`;
export const ADVANCE_PAYMENT_API_URL = `${API_BASE_URL}/advance_payment`;

// Leads
export const LEADS_API_URL = `${API_BASE_URL}/leads`;

// Expenses
export const EXPENSE_API_URL = `${API_BASE_URL}/expense`;

// File Upload
export const UPLOAD_IMAGE_API_URL = `${API_BASE_URL}/upload/image`;

// PDF Generation
export const GENERATE_CONSENT_PDF_URL = `${API_BASE_URL}/generate-consent-pdf`;
export const GENERATE_PDF_ONLY_URL = `${API_BASE_URL}/generate-pdf-only`;

// WhatsApp
export const SEND_WHATSAPP_MESSAGE_URL = `${API_BASE_URL}/send-whatsapp-message`;

// Authentication
export const LOGIN_API_URL = `${API_BASE_URL}/auth/login`;
export const LOGOUT_API_URL = `${API_BASE_URL}/auth/logout`;

// Invoice
export const getInvoiceDownloadUrl = (invoiceId) => `${API_BASE_URL}/payment/invoice/${invoiceId}/download`;
