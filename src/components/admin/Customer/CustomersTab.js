import React, { useState, useRef, useMemo } from 'react';
import Drawer from '../../common/Drawer';
import CustomerSearch from './CustomerSearch';
import CustomerTable from './CustomerTable';
import ConsentFormDetails from './ConsentFormDetails';
import LoadingSpinner from '../../common/LoadingSpinner';
import ErrorMessage from '../../common/ErrorMessage';
import Pagination from '../../common/Pagination';
import { useCustomerData } from './hooks/useCustomerData';
import { usePdfDownload } from './hooks/usePdfDownload';

const CustomersTab = ({ customers, consentForms, payments, loading, error, onRefresh }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [selectedForm, setSelectedForm] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const searchInputRef = useRef(null);
  
  const ITEMS_PER_PAGE = 10;

  const { filteredCustomers, getCustomerConsentForms, getCustomerPayments } = useCustomerData(
    customers, 
    consentForms, 
    payments, 
    searchQuery
  );

  // Sort customers by created_at descending (newest first)
  const sortedFilteredCustomers = [...filteredCustomers].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateB - dateA;
  });

  // Pagination logic
  const totalItems = sortedFilteredCustomers.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  
  // Reset to first page when search query changes
  React.useEffect(() => {
    setCurrentPage(1);
    setSelectedCustomer(null); // Clear selected customer when search changes
  }, [searchQuery]);

  // Get current page data
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return sortedFilteredCustomers.slice(startIndex, endIndex);
  }, [sortedFilteredCustomers, currentPage, ITEMS_PER_PAGE]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);

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
          {totalItems > 0 && (
            <span className="ml-2 text-indigo-600 font-medium">
              ({totalItems} customer{totalItems !== 1 ? 's' : ''})
            </span>
          )}
        </p>
      </div>

      <CustomerSearch 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchInputRef={searchInputRef}
      />

      <CustomerTable
        filteredCustomers={paginatedCustomers}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
          startIndex={startIndex}
          endIndex={endIndex}
        />
      )}

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