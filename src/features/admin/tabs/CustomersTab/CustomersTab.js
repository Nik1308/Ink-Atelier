import React, { useState, useRef, useMemo } from 'react';
import { Drawer, LoadingSpinner, ErrorMessage, Pagination } from '../../../../shared';
import CustomerSearch from './CustomerSearch';
import CustomerTable from './CustomerTable';
import ConsentFormDetails from '../ConsentFormsTab/ConsentFormDetails';
import { useCustomerData } from '../../hooks/useCustomerData';
import { usePdfDownload } from '../../hooks/usePdfDownload';
import CustomerDetailsSidebar from './CustomerDetailsSidebar';

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

  // Sort customers by createdAt descending (newest first)
  const sortedFilteredCustomers = [...filteredCustomers].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
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
        customers={paginatedCustomers}
        getCustomerConsentForms={getCustomerConsentForms}
        getCustomerPayments={getCustomerPayments}
        onViewDetails={setSelectedCustomer}
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

      {/* Customer Details Drawer */}
      <Drawer
        open={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        maxWidth="max-w-[90vw]"
      >
        {selectedCustomer && (
          <CustomerDetailsSidebar
            customer={selectedCustomer}
            getCustomerConsentForms={getCustomerConsentForms}
            getCustomerPayments={getCustomerPayments}
            onClose={() => setSelectedCustomer(null)}
            allCustomers={customers}
          />
        )}
      </Drawer>
    </div>
  );
};

export default CustomersTab; 