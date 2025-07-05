import React, { useState, useRef } from 'react';
import Drawer from '../../common/Drawer';
import CustomerSearch from './CustomerSearch';
import CustomerTable from './CustomerTable';
import ConsentFormDetails from './ConsentFormDetails';
import LoadingSpinner from '../../common/LoadingSpinner';
import ErrorMessage from '../../common/ErrorMessage';
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
          <LoadingSpinner text="Loading customers..." />
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
        <ErrorMessage 
          error={error} 
          title="Error loading customers" 
          onRetry={onRefresh}
        />
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