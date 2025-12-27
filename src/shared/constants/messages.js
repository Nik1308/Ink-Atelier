// Aftercare PDF URLs (public URLs)
export const TATTOO_AFTERCARE_PDF_URL = '/aftercare/tattoo-aftercare.pdf';
export const PIERCING_AFTERCARE_PDF_URL = '/aftercare/piercing-aftercare.pdf';

// Get the full public URL for aftercare PDFs
export function getAftercarePdfUrl(serviceType) {
  // Get the current origin and ensure we use http:// for localhost
  let baseUrl = window.location.origin;
  
  // Force http:// for localhost to avoid https:// issues in development
  if (baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1')) {
    baseUrl = baseUrl.replace(/^https?:/, 'http:');
  }
  
  if (serviceType === 'tattoo') {
    return `${baseUrl}${TATTOO_AFTERCARE_PDF_URL}`;
  } else if (serviceType === 'piercing') {
    return `${baseUrl}${PIERCING_AFTERCARE_PDF_URL}`;
  }
  return null;
}

export function getAdvancePaymentConfirmationMessage({ clientName = '', appointmentDate = '', advanceAmount = '', dueAmount = '' }) {
  // Format date and day
  let dateStr = appointmentDate;
  let dayStr = '';
  if (appointmentDate) {
    const dateObj = new Date(appointmentDate);
    if (!isNaN(dateObj)) {
      const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
      dayStr = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
      dateStr = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  }
  let approxPrice = '';
  if (advanceAmount && dueAmount) {
    const adv = Number(advanceAmount);
    const due = Number(dueAmount);
    const total = adv + due;
    approxPrice = `₹${total.toLocaleString()}`;
  } else if (advanceAmount) {
    approxPrice = `₹${Number(advanceAmount).toLocaleString()}`;
  } else if (dueAmount) {
    approxPrice = `₹${Number(dueAmount).toLocaleString()}`;
  }
  return `Hi${clientName ? ' ' + clientName : ''},\n\nThank you for choosing INK ATELIER!\n\nWe're happy to confirm your tattoo appointment for${dayStr ? ' ' + dayStr + ',' : ''} ${dateStr}.\n\nAppointment Details:\n• Advance Payment Received: ₹${advanceAmount ? Number(advanceAmount).toLocaleString() : ''} (non-refundable)\n• Approximate Price: ${approxPrice} (final price may vary based on size and design details)\n• Studio Location: HSR Layout, Bangalore\n\nOur team is committed to providing a professional, hygienic, and comfortable tattooing experience.\n\nWe look forward to seeing you on the ${dateStr.split(' ')[0]}! If there are any changes or updates, please let us know ahead of time.\n\nWarm regards,\nINK ATELIER\n📞 +91 9636 301 625 `;
}

