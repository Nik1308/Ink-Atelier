import { INSTAGRAM_USER_ID, ACCESS_TOKEN } from "./secrets";

export const INSTAGRAM_API_URL = `https://graph.instagram.com/${INSTAGRAM_USER_ID}/media?fields=id,caption,media_url,permalink,media_type,thumbnail_url,timestamp&access_token=${ACCESS_TOKEN}&limit=10`;

export const TATTOO_CONSENT_FORM_API_URL = "https://x8ki-letl-twmt.n7.xano.io/api:kpJdX1YB/tattoo_consent_form";

export const UPLOAD_IMAGE_API_URL = "https://x8ki-letl-twmt.n7.xano.io/api:kpJdX1YB/upload/image";

export const CUSTOMER_API_URL = "https://x8ki-letl-twmt.n7.xano.io/api:kpJdX1YB/customer";

export const PIERCING_CONSENT_FORM_API_URL = "https://x8ki-letl-twmt.n7.xano.io/api:kpJdX1YB/piercing_consent_form";

export const PAYMENT_API_URL = "https://x8ki-letl-twmt.n7.xano.io/api:kpJdX1YB/payment";
 
// Backend PDF and WhatsApp service URLs
export const BACKEND_BASE_URL = "http://localhost:5001";
export const GENERATE_CONSENT_PDF_URL = `${BACKEND_BASE_URL}/api/generate-consent-pdf`;
export const GENERATE_PDF_ONLY_URL = `${BACKEND_BASE_URL}/api/generate-pdf-only`;
export const SEND_WHATSAPP_MESSAGE_URL = `${BACKEND_BASE_URL}/api/send-whatsapp-message`;

// Authentication API URLs
export const XANO_BASE_URL = "https://x8ki-letl-twmt.n7.xano.io/api:kpJdX1YB";
export const LOGIN_API_URL = `${XANO_BASE_URL}/auth/login`;
export const LOGOUT_API_URL = `${XANO_BASE_URL}/auth/logout`;
 
// Add more API URLs here as needed 