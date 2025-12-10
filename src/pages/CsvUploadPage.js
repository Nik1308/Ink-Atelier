import React, { useState } from 'react';
import { PAYMENT_API_URL, CUSTOMER_API_URL, fetchApi } from '../utils';

function downloadCsvFromRows(rows, filename = 'failed_entries.csv') {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(','), ...rows.map(row => headers.map(h => `"${(row[h] ?? '').replace(/"/g, '""')}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const CsvUploadPage = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState({ current: 0, total: 0, message: '' });
  const [errors, setErrors] = useState([]);
  const [successCount, setSuccessCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [failedRows, setFailedRows] = useState([]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
    } else {
      setFile(null);
    }
  };

  const parseCSV = (csvText) => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    // Validate required headers
    const requiredHeaders = ['name', 'phone', 'date', 'amount', 'paymenttype', 'service'];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
    }

    // Accept optional dob column
    const hasDob = headers.includes('dob');

    const data = [];
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',').map(v => v.trim());
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        data.push(row);
      }
    }
    
    return data;
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return null;
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    // If it's 10 digits, add +91 prefix
    if (cleaned.length === 10) {
      return `+91${cleaned}`;
    }
    // If it already has country code, return as is
    if (cleaned.startsWith('91') && cleaned.length === 12) {
      return `+${cleaned}`;
    }
    // If it's 11 digits and starts with 0, remove 0 and add +91
    if (cleaned.length === 11 && cleaned.startsWith('0')) {
      return `+91${cleaned.substring(1)}`;
    }
    return null;
  };

  const convertDateFormat = (dateString) => {
    if (!dateString) return null;
    
    // Handle DD/MM/YY format
    const ddMmYyMatch = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2})$/);
    if (ddMmYyMatch) {
      const [, day, month, year] = ddMmYyMatch;
      // Convert 2-digit year to 4-digit year (assuming 20xx for years 00-29, 19xx for 30-99)
      const fullYear = parseInt(year) < 30 ? `20${year}` : `19${year}`;
      return `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    // Handle DD/MM/YYYY format
    const ddMmYyyyMatch = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (ddMmYyyyMatch) {
      const [, day, month, year] = ddMmYyyyMatch;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    // Handle DD-MM-YY format (backward compatibility)
    const ddMmYyDashMatch = dateString.match(/^(\d{1,2})-(\d{1,2})-(\d{2})$/);
    if (ddMmYyDashMatch) {
      const [, day, month, year] = ddMmYyDashMatch;
      const fullYear = parseInt(year) < 30 ? `20${year}` : `19${year}`;
      return `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    // Handle DD-MM-YYYY format (backward compatibility)
    const ddMmYyyyDashMatch = dateString.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
    if (ddMmYyyyDashMatch) {
      const [, day, month, year] = ddMmYyyyDashMatch;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    // If it's already in YYYY-MM-DD format, return as is
    const yyyyMmDdMatch = dateString.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (yyyyMmDdMatch) {
      return dateString;
    }
    
    throw new Error(`Invalid date format: ${dateString}. Expected DD/MM/YY, DD/MM/YYYY, DD-MM-YY, DD-MM-YYYY, or YYYY-MM-DD`);
  };

  const handleCustomerLookup = async (phoneNumber) => {
    if (!phoneNumber) return null;
    
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      if (!formattedPhone) return null;
      
      // Query all customers
      const customers = await fetchApi(CUSTOMER_API_URL, { method: "GET" });
      const existingCustomer = Array.isArray(customers) 
        ? customers.find(c => c.phone === formattedPhone)
        : null;

      if (existingCustomer) {
        return existingCustomer.id;
      } else {
        return null; // Don't create customer if phone is missing
      }
    } catch (error) {
      return null;
    }
  };

  const createCustomer = async (name, phone, createdDate, dob) => {
    if (!phone) return null;
    try {
      const formattedPhone = formatPhoneNumber(phone);
      if (!formattedPhone) return null;
      let dateOfBirth = null;
      if (dob) {
        try {
          dateOfBirth = convertDateFormat(dob); // Always convert, supports DD/MM/YY
        } catch {
          dateOfBirth = null;
        }
      }
      const newCustomer = await fetchApi(CUSTOMER_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || "Unknown Customer",
          phone: formattedPhone,
          email: '',
          date_of_birth: dateOfBirth, // Use dob if available, always formatted
          address: '',
          created_at: createdDate, // Set created_at to the CSV date
        }),
      });
      return newCustomer.id;
    } catch (error) {
      return null;
    }
  };

  const createPayment = async (customerId, date, amount, paymentType, service) => {
    try {
      // Parse the date and set it as created_at
      const paymentDate = new Date(date);
      if (isNaN(paymentDate.getTime())) {
        throw new Error('Invalid date format');
      }

      await fetchApi(PAYMENT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: customerId, // can be null
          payment_date: date,
          amount: Number(amount),
          payment_type: paymentType,
          service: service.toLowerCase(),
          created_at: date, // Set created_at to the CSV date
        }),
      });
      return true;
    } catch (error) {
      return false;
    }
  };

  const processRow = async (row, index) => {
    const { name, phone, date, amount, paymenttype, service, dob } = row;
    
    setProgress({ current: index + 1, total: progress.total, message: `Processing row ${index + 1}...` });
    
    // Convert date format
    let convertedDate;
    try {
      convertedDate = convertDateFormat(date);
    } catch (error) {
      throw new Error(`Date format error: ${error.message}`);
    }
    
    let customerId = null;
    
    // If phone number exists, handle customer creation/lookup
    if (phone && phone.trim()) {
      // First try to find existing customer
      customerId = await handleCustomerLookup(phone);
      // If not found, create new customer
      if (!customerId) {
        customerId = await createCustomer(name, phone, convertedDate, dob);
      }
    }
    // Always try to create payment, even if customerId is null
    const paymentSuccess = await createPayment(customerId, convertedDate, amount, paymenttype, service);
    if (!paymentSuccess) {
      throw new Error(`Failed to create payment for row ${index + 1}`);
    }
  };

  // Helper function to add delay between requests
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      return;
    }

    setProcessing(true);
    setErrors([]);
    setFailedRows([]);
    setSuccessCount(0);
    setErrorCount(0);

    try {
      const text = await file.text();
      const data = parseCSV(text);
      if (data.length === 0) {
        throw new Error('No data found in CSV file.');
      }
      setProgress({ current: 0, total: data.length, message: 'Starting processing...' });
      let _successCount = 0;
      let _errorCount = 0;
      const _errors = [];
      const _failedRows = [];
      for (let i = 0; i < data.length; i++) {
        try {
          await processRow(data[i], i);
          _successCount++;
          // Add 10 second delay between requests to avoid 429 rate limit
          if (i < data.length - 1) {
            setProgress({ current: i + 1, total: data.length, message: `Processing row ${i + 1}... Waiting 10 seconds for rate limit...` });
            await delay(10000);
          }
        } catch (error) {
          _errorCount++;
          _errors.push(`Row ${i + 1}: ${error.message}`);
          // Attach error reason to row
          _failedRows.push({ ...data[i], error: error.message });
          if (i < data.length - 1) {
            setProgress({ current: i + 1, total: data.length, message: `Error on row ${i + 1}. Waiting 10 seconds for rate limit...` });
            await delay(10000);
          }
        }
      }
      setSuccessCount(_successCount);
      setErrorCount(_errorCount);
      setErrors(_errors);
      setFailedRows(_failedRows);
      setProgress({ current: data.length, total: data.length, message: 'Processing complete!' });
    } catch (error) {
      setProgress({ current: progress.total, total: progress.total, message: 'An error occurred while processing the CSV file.' });
      setErrors([error.message]);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">CSV Bulk Upload</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label className="block font-medium mb-2">Select CSV File</label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={processing}
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <button
          type="submit"
          disabled={!file || processing}
          className="bg-indigo-600 text-white px-6 py-2 rounded font-semibold hover:bg-indigo-700 disabled:opacity-50"
        >
          {processing ? 'Processing...' : 'Upload & Process'}
        </button>
      </form>
      <div className="mt-6">
        {progress.total > 0 && (
          <div className="mb-2 text-sm text-gray-700">
            {progress.message} <br />
            {progress.current} / {progress.total} rows processed
          </div>
        )}
        {successCount > 0 && (
          <div className="text-green-700 bg-green-50 p-3 rounded mb-2 text-sm">
            Successfully processed {successCount} record{successCount !== 1 ? 's' : ''}.
          </div>
        )}
        {errorCount > 0 && (
          <div className="text-red-700 bg-red-50 p-3 rounded mb-2 text-sm">
            {errorCount} record{errorCount !== 1 ? 's' : ''} failed.<br />
            <ul className="list-disc ml-6">
              {errors.map((err, idx) => <li key={idx}>{err}</li>)}
            </ul>
            {failedRows.length > 0 && (
              <button
                className="mt-2 bg-amber-500 text-white px-4 py-1 rounded hover:bg-amber-600"
                onClick={() => downloadCsvFromRows(failedRows)}
              >
                Download Failed Entries CSV
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CsvUploadPage;