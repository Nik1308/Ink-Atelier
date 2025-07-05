import React, { useState, useRef } from 'react';
import Drawer from '../../common/Drawer';
import CustomerSearch from './CustomerSearch';
import CustomerTable from './CustomerTable';
import ConsentFormDetails from './ConsentFormDetails';
import { useCustomerData } from './hooks/useCustomerData';
import { usePdfDownload } from './hooks/usePdfDownload';

const CustomersTab = ({ customers, consentForms, payments, loading, error, onRefresh }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [selectedForm, setSelectedForm] = useState(null);
  const searchInputRef = useRef(null);

  const { filteredCustomers, getCustomerConsentForms, getCustomerPayments } = useCustomerData(
    customers, 
    consentForms, 
    payments, 
    searchQuery
  );

  const { downloading, handleDownload } = usePdfDownload();

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
      <div>
        <h3 className="text-lg font-medium text-gray-900">Customer Management</h3>
        <p className="mt-1 text-sm text-gray-500">
          View and manage all customer information and their consent forms.
        </p>
      </div>

      <CustomerSearch 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchInputRef={searchInputRef}
      />

      <CustomerTable
        filteredCustomers={filteredCustomers}
        selectedCustomer={selectedCustomer}
        setSelectedCustomer={setSelectedCustomer}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        getCustomerConsentForms={getCustomerConsentForms}
        getCustomerPayments={getCustomerPayments}
        onDownload={handleDownload}
        downloading={downloading}
        onViewFormDetails={setSelectedForm}
      />

      {/* Consent Form Details Drawer */}
      <Drawer
        open={!!selectedForm}
        onClose={() => setSelectedForm(null)}
      >
        {selectedForm && <ConsentFormDetails form={selectedForm} />}
      </Drawer>
    </div>
  );
};

export default CustomersTab; 