import React, { useState, useRef } from 'react';
import Drawer from './Drawer';
import { GENERATE_PDF_ONLY_URL } from '../../utils/apiUrls';

const CustomersTab = ({ customers, consentForms, payments, loading, error, onRefresh }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerForm, setDrawerForm] = useState(null);
  const [drawerCustomer, setDrawerCustomer] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const searchInputRef = useRef(null);

  const getCustomerConsentForms = (customerId) => {
    return consentForms.filter(form => form.customer_id === customerId);
  };

  const getCustomerPayments = (customerId) => {
    return payments.filter(payment => payment.customer_id === customerId);
  };

  const filteredCustomers = customers.filter(customer => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const nameMatch = customer.name?.toLowerCase().includes(query);
    const phoneMatch = customer.phone?.includes(searchQuery);
    return nameMatch || phoneMatch;
  });

  const handleView = (form) => {
    setDrawerForm(form);
    // Find the customer for this form
    const customer = customers.find(c => c.id === form.customer_id);
    setDrawerCustomer(customer || null);
    setDrawerOpen(true);
  };

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

  // Render all details for tattoo or piercing consent form, with customer info at top
  const renderConsentFormDetails = (form, customer) => {
    if (!form) return null;
    const isTattoo = form.type === 'tattoo';
    // Date signed fallback logic
    let dateSigned = form.date_signed;
    if (!dateSigned && form.created_at) dateSigned = form.created_at;
    let dateSignedDisplay = 'Unknown';
    if (dateSigned) {
      try {
        dateSignedDisplay = new Date(dateSigned).toLocaleDateString();
      } catch {}
    }
    return (
      <div className="space-y-8">
        <h2 className="text-2xl font-bold mb-4">{isTattoo ? 'Tattoo Consent Form' : 'Piercing Consent Form'}</h2>
        {/* Customer Info */}
        {customer && (
          <div className="mb-2">
            <div className="bg-gray-100 px-4 py-2 rounded font-semibold text-lg mb-3">Customer Information</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-base">
              <div><span className="font-bold">Name:</span> <span className="font-normal">{customer.name}</span></div>
              <div><span className="font-bold">Date of Birth:</span> <span className="font-normal">{customer.date_of_birth}</span></div>
              <div><span className="font-bold">Address:</span> <span className="font-normal">{customer.address}</span></div>
              <div><span className="font-bold">Phone:</span> <span className="font-normal">{customer.phone}</span></div>
              <div><span className="font-bold">Email:</span> <span className="font-normal">{customer.email}</span></div>
            </div>
          </div>
        )}
        <hr className="my-2 border-gray-300" />
        {/* Form Info */}
        {isTattoo ? (
          <>
            <div className="bg-gray-100 px-4 py-2 rounded font-semibold text-lg mb-3">Tattoo Design Information</div>
            <div className="space-y-2 text-base">
              <div><span className="font-bold">Location on Body:</span> <span className="font-normal">{form.tattoo_location}</span></div>
              <div><span className="font-bold">Tattoo Artist:</span> <span className="font-normal">{form.tattoo_artist}</span></div>
              <div><span className="font-bold">Date of Tattoo:</span> <span className="font-normal">{form.tattoo_date}</span></div>
              {form.tattoo_design && form.tattoo_design.url && (
                <div><span className="font-bold">Design Image:</span><br /><img src={form.tattoo_design.url} alt="Tattoo Design" className="max-h-40 mt-2 border rounded" /></div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="bg-gray-100 px-4 py-2 rounded font-semibold text-lg mb-3">Piercing Information</div>
            <div className="space-y-2 text-base">
              <div><span className="font-bold">Type:</span> <span className="font-normal">{form.piercing_type}</span></div>
              <div><span className="font-bold">Subtype:</span> <span className="font-normal">{form.piercing_subtype}</span></div>
              <div><span className="font-bold">Piercing Artist:</span> <span className="font-normal">{form.piercing_artist}</span></div>
              <div><span className="font-bold">Date of Piercing:</span> <span className="font-normal">{form.piercing_date}</span></div>
            </div>
          </>
        )}
        <hr className="my-2 border-gray-300" />
        <div className="bg-gray-100 px-4 py-2 rounded font-semibold text-lg mb-3">Health Information</div>
        <div className="space-y-2 text-base">
          <div><span className="font-bold">Medications:</span> <span className="font-normal">{form.medications || (form.has_medications ? 'Yes' : 'No')}</span></div>
          {form.medicationsList && <div><span className="font-bold">Medications List:</span> <span className="font-normal">{form.medicationsList || form.medications_list}</span></div>}
          <div><span className="font-bold">Allergies:</span> <span className="font-normal">{form.allergies || (form.has_allergies ? 'Yes' : 'No')}</span></div>
          {form.allergiesList && <div><span className="font-bold">Allergies List:</span> <span className="font-normal">{form.allergiesList || form.allergies_list}</span></div>}
          <div><span className="font-bold">Medical Conditions:</span> <span className="font-normal">{form.medicalConditions || (form.has_medical_conditions ? 'Yes' : 'No')}</span></div>
          {form.medicalConditionsList && <div><span className="font-bold">Medical Conditions List:</span> <span className="font-normal">{form.medicalConditionsList || form.medical_conditions_list}</span></div>}
          <div><span className="font-bold">Alcohol/Drugs in last 24h:</span> <span className="font-normal">{form.alcoholDrugs || (form.alcohol_drugs ? 'Yes' : 'No')}</span></div>
          <div><span className="font-bold">Pregnant/Nursing:</span> <span className="font-normal">{form.pregnantNursing || (form.pregnant_nursing ? 'Yes' : 'No')}</span></div>
        </div>
        <hr className="my-2 border-gray-300" />
        <div className="bg-gray-100 px-4 py-2 rounded font-semibold text-lg mb-3">Consent</div>
        <div className="space-y-2 text-base">
          <div><span className="font-bold">Agreed:</span> <span className="font-normal">{form.agree ? 'Yes' : 'No'}</span></div>
          <div><span className="font-bold">Date Signed:</span> <span className="font-normal">{dateSignedDisplay}</span></div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Customer Management</h3>
          <p className="mt-1 text-sm text-gray-500">
            View and manage all customer information and their consent forms.
          </p>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading customers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Customer Management</h3>
          <p className="mt-1 text-sm text-gray-500">
            View and manage all customer information and their consent forms.
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading customers</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={onRefresh}
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {renderConsentFormDetails(drawerForm, drawerCustomer)}
      </Drawer>
      <div>
        <h3 className="text-lg font-medium text-gray-900">Customer Management</h3>
        <p className="mt-1 text-sm text-gray-500">
          View and manage all customer information and their consent forms.
        </p>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search Customers</label>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Search by name or phone number..."
          />
        </div>
      </div>

      {/* Customer List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No customers found</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredCustomers.map((customer) => {
              const customerForms = getCustomerConsentForms(customer.id);
              const customerPayments = getCustomerPayments(customer.id);
              const totalSpending = customerPayments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
              return (
                <li key={customer.id} className="px-6 py-4">
                  <div className="flex flex-row items-center w-full">
                    {/* Column 1: Avatar + Name/Phone as two sub-columns */}
                    <div className="flex flex-row items-center w-1/3 min-w-0">
                      {/* Sub-column 1: Avatar */}
                      <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                        <span className="text-indigo-600 font-medium text-lg">
                          {customer.name?.charAt(0)?.toUpperCase() || 'C'}
                        </span>
                      </div>
                      {/* Sub-column 2: Name and Phone */}
                      <div className="flex flex-col justify-center">
                        <span className="text-lg font-medium text-gray-900 truncate">{customer.name}</span>
                        <span className="text-sm text-gray-500 truncate">{customer.phone}</span>
                      </div>
                    </div>
                    {/* Column 2: Lifetime Spend */}
                    <div className="flex flex-col items-center justify-center w-1/3">
                      {customerPayments.length > 0 && (
                        <>
                          <span className="text-xs text-gray-500">Lifetime Spend</span>
                          <span className="text-green-700 font-bold text-lg">₹{totalSpending}</span>
                        </>
                      )}
                    </div>
                    {/* Column 3: Counts and Actions */}
                    <div className="flex flex-col items-end justify-center w-1/3">
                      <span className="text-sm text-gray-500">{customerForms.length} consent form{customerForms.length !== 1 ? 's' : ''}</span>
                      <span className="text-sm text-gray-500">{customerPayments.length} payment{customerPayments.length !== 1 ? 's' : ''}</span>
                      <button
                        onClick={() => setSelectedCustomer(selectedCustomer?.id === customer.id ? null : customer)}
                        className="mt-2 text-indigo-600 hover:text-indigo-900 text-sm font-medium border border-indigo-300 rounded px-2 py-1"
                      >
                        {selectedCustomer?.id === customer.id ? 'Hide Details' : 'View Details'}
                      </button>
                    </div>
                  </div>

                  {/* Customer Details and Consent Forms */}
                  {selectedCustomer?.id === customer.id && (
                    <div className="mt-4 pl-0">
                      <div className="bg-[#f7f5f2] rounded-2xl p-6 shadow-lg border border-gray-200">
                        {/* Customer Details Section */}
                        <h4 className="text-xl font-bold mb-4 border-b pb-2 border-gray-200">Customer Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-base mb-6">
                          <div>
                            <span className="font-medium text-gray-700">Date of Birth:</span>
                            <span className="ml-2 text-gray-900">
                              {customer.date_of_birth ? new Date(customer.date_of_birth).toLocaleDateString() : 'Not provided'}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Created:</span>
                            <span className="ml-2 text-gray-900">
                              {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : 'Unknown'}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Email:</span>
                            <span className="ml-2 text-gray-900">{customer.email || 'Not provided'}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Address:</span>
                            <span className="ml-2 text-gray-900">{customer.address || 'Not provided'}</span>
                          </div>
                        </div>

                        {/* Consent Forms */}
                        {customerForms.length > 0 && (
                          <div className="mt-8">
                            <h4 className="text-lg font-bold mb-4 border-b pb-2 border-gray-200">Consent Forms</h4>
                            <div className="space-y-4">
                              {customerForms.map((form) => {
                                // Date logic for summary card
                                let summaryDate = null;
                                if (form.type === 'piercing') {
                                  summaryDate = form.piercing_date || form.date_signed || form.created_at;
                                } else if (form.type === 'tattoo') {
                                  summaryDate = form.tattoo_date || form.date_signed || form.created_at;
                                }
                                let summaryDateDisplay = 'Unknown';
                                if (summaryDate) {
                                  try {
                                    summaryDateDisplay = new Date(summaryDate).toLocaleDateString();
                                  } catch {}
                                }

                                return (
                                  <div key={`${form.type}-${form.id}`} className="bg-white border border-gray-200 rounded-xl p-5 shadow flex flex-col md:flex-row md:items-center justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-3 mb-2">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                          form.type === 'tattoo' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                                        }`}>
                                          {form.type === 'tattoo' ? 'Tattoo' : 'Piercing'}
                                        </span>
                                        <span className="text-sm text-gray-500">{summaryDateDisplay}</span>
                                      </div>
                                      <div className="text-base text-gray-900">
                                        {form.type === 'tattoo' ? (
                                          <>
                                            <div><span className="font-semibold">Location:</span> {form.tattoo_location}</div>
                                            <div><span className="font-semibold">Artist:</span> {form.tattoo_artist}</div>
                                          </>
                                        ) : (
                                          <>
                                            <div><span className="font-semibold">Type:</span> {form.piercing_type} - {form.piercing_subtype}</div>
                                            <div><span className="font-semibold">Artist:</span> {form.piercing_artist}</div>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex flex-row space-x-4 mt-4 md:mt-0 md:ml-6">
                                      <button
                                        className="text-indigo-600 hover:text-indigo-900 text-sm font-semibold px-2 py-1 rounded transition"
                                        onClick={() => { handleView(form); }}
                                      >
                                        View
                                      </button>
                                      <button
                                        className="text-indigo-600 hover:text-indigo-900 text-sm font-semibold px-2 py-1 rounded transition"
                                        onClick={() => { handleDownload(form); }}
                                        disabled={downloading}
                                      >
                                        {downloading ? 'Downloading...' : 'Download'}
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Payment History */}
                        {customerPayments.length > 0 && (
                          <div className="mt-8">
                            <h4 className="text-lg font-bold mb-4 border-b pb-2 border-gray-200">Payment History</h4>
                            <div className="space-y-4">
                              {customerPayments.map((payment) => {
                                let paymentDateDisplay = 'Unknown';
                                if (payment.payment_date) {
                                  try {
                                    paymentDateDisplay = new Date(payment.payment_date).toLocaleDateString();
                                  } catch {}
                                }

                                return (
                                  <div key={`payment-${payment.id}`} className="bg-white border border-gray-200 rounded-xl p-5 shadow flex flex-col md:flex-row md:items-center justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-3 mb-2">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                          Payment
                                        </span>
                                        <span className="text-sm text-gray-500">{paymentDateDisplay}</span>
                                      </div>
                                      <div className="text-base text-gray-900">
                                        <div><span className="font-semibold">Amount:</span> ₹{payment.amount}</div>
                                        <div><span className="font-semibold">Type:</span> {payment.payment_type}</div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CustomersTab; 