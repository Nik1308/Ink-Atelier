import React from 'react';
import Tabs from '../../common/Tabs';
import ConsentFormsTable from './ConsentFormsTable';
import PaymentHistoryTable from './PaymentHistoryTable';

const CustomerTable = ({ 
  filteredCustomers, 
  selectedCustomer, 
  setSelectedCustomer, 
  activeTab, 
  setActiveTab,
  getCustomerConsentForms,
  getCustomerPayments,
  onDownload,
  downloading,
  onViewFormDetails
}) => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <table className="min-w-full divide-y divide-gray-200">
        <tbody className="bg-white divide-y divide-gray-100">
          {filteredCustomers.map((customer) => {
            const customerForms = getCustomerConsentForms(customer.id);
            const customerPayments = getCustomerPayments(customer.id);
            const totalSpending = customerPayments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
            const isSelected = selectedCustomer?.id === customer.id;
            
            return (
              <React.Fragment key={customer.id}>
                <tr className="hover:bg-gray-50 transition">
                  {/* Customer */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                        <span className="text-indigo-600 font-medium text-lg">
                          {customer.name?.charAt(0)?.toUpperCase() || 'C'}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 text-base">{customer.name}</span>
                        <span className="text-sm text-gray-500">{customer.phone}</span>
                      </div>
                    </div>
                  </td>
                  {/* Consents */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-500">Consents</span>
                      <span className="font-bold text-lg text-gray-800">{customerForms.length}</span>
                    </div>
                  </td>
                  {/* Payments */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-500">Payments</span>
                      <span className="font-bold text-lg text-gray-800">{customerPayments.length}</span>
                    </div>
                  </td>
                  {/* Lifetime Spend */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-500">Lifetime Spend</span>
                      <span className="font-bold text-lg text-green-700">₹{totalSpending}</span>
                    </div>
                  </td>
                  {/* Actions */}
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => {
                        if (selectedCustomer?.id === customer.id) {
                          setSelectedCustomer(null);
                        } else {
                          setSelectedCustomer(customer);
                          setActiveTab('details');
                        }
                      }}
                      className="text-indigo-600 hover:text-indigo-900 text-sm font-semibold border border-indigo-300 rounded px-3 py-1 transition"
                    >
                      {selectedCustomer?.id === customer.id ? 'Hide Details' : 'View Details'}
                    </button>
                  </td>
                </tr>
                {isSelected && (
                  <tr>
                    <td colSpan={5} className="bg-[#f7f5f2] p-6 border border-gray-200 mt-2">
                      <Tabs
                        tabs={[
                          { label: 'Customer Details', key: 'details', show: true },
                          { label: 'Consent Forms', key: 'consents', show: customerForms.length > 0 },
                          { label: 'Payment History', key: 'payments', show: customerPayments.length > 0 },
                        ]}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                      >
                        {{
                          details: <CustomerDetails customer={customer} />,
                          consents: customerForms.length > 0 && (
                            <ConsentFormsTable 
                              forms={customerForms}
                              onDownload={onDownload}
                              downloading={downloading}
                              onViewDetails={onViewFormDetails}
                            />
                          ),
                          payments: customerPayments.length > 0 && (
                            <PaymentHistoryTable payments={customerPayments} />
                          ),
                        }}
                      </Tabs>
                      {/* Show message when no data */}
                      {customerForms.length === 0 && customerPayments.length === 0 && activeTab !== 'details' && (
                        <div className="text-center py-8 text-gray-500">
                          <p>No consent forms or payment records found for this customer.</p>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const CustomerDetails = ({ customer }) => (
  <div className="space-y-2 text-base mb-6">
    <div>
      <span className="font-bold">Date of Birth:</span>
      <span className="ml-2">
        {customer.date_of_birth ? new Date(customer.date_of_birth).toLocaleDateString() : 'Not provided'}
      </span>
    </div>
    <div>
      <span className="font-bold">Created:</span>
      <span className="ml-2">
        {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : 'Unknown'}
      </span>
    </div>
    <div>
      <span className="font-bold">Email:</span>
      <span className="ml-2">{customer.email || 'Not provided'}</span>
    </div>
    <div>
      <span className="font-bold">Address:</span>
      <span className="ml-2">{customer.address || 'Not provided'}</span>
    </div>
  </div>
);

export default CustomerTable; 