import { useState } from 'react';
import { GENERATE_PDF_ONLY_URL } from '../../../utils/apiUrls';

export const usePdfDownload = () => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async (form) => {
    setDownloading(true);
    try {
      // Step 1: Generate PDF and get download URL
      const res = await fetch(GENERATE_PDF_ONLY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData: form, formType: form.type })
      });
      if (!res.ok) throw new Error('Failed to generate PDF');
      const data = await res.json();
      if (!data.downloadUrl) throw new Error('No download URL returned');

      // Step 2: Fetch the PDF as a blob
      const pdfRes = await fetch(data.downloadUrl);
      if (!pdfRes.ok) throw new Error('Failed to fetch PDF');
      const blob = await pdfRes.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${form.type}-consent-${form.id || Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download PDF.');
    } finally {
      setDownloading(false);
    }
  };

  return {
    downloading,
    handleDownload
  };
}; 