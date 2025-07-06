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
        {/* <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Consents</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Payments</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Lifetime Spend</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Referrals</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead> */}
        <tbody className="bg-white divide-y divide-gray-100">
          {filteredCustomers.map((customer) => {
            const customerForms = getCustomerConsentForms(customer.id);
            const customerPayments = getCustomerPayments(customer.id);
            const totalSpending = customerPayments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
            const isSelected = selectedCustomer?.id === customer.id;
            const referralCount = filteredCustomers.filter(c => c.referred_by_customer_id === customer.id).length;
            const referredCustomers = filteredCustomers.filter(c => c.referred_by_customer_id === customer.id);
            
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
                      <span className="font-bold text-lg text-black">{customerForms.length}</span>
                    </div>
                  </td>
                  {/* Payments */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-500">Payments</span>
                      <span className="font-bold text-lg text-black">{customerPayments.length}</span>
                    </div>
                  </td>
                  {/* Lifetime Spend */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-500">Lifetime Spend</span>
                      <span className="font-bold text-lg text-black">₹{totalSpending}</span>
                    </div>
                  </td>
                  {/* Referrals */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-500">Referrals</span>
                      <span className="font-bold text-lg text-black">{referralCount}</span>
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
                    <td colSpan={6} className="bg-[#f7f5f2] p-6 border border-gray-200 mt-2">
                      <Tabs
                        tabs={[
                          { label: 'Customer Details', key: 'details', show: true },
                          { label: 'Consent Forms', key: 'consents', show: customerForms.length > 0 },
                          { label: 'Payment History', key: 'payments', show: customerPayments.length > 0 },
                          { label: 'Referrals', key: 'referrals', show: referredCustomers.length > 0 },
                        ]}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                      >
                        {{
                          details: <CustomerDetails customer={customer} heardAboutUs={customer.heard_about_us} />,
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
                          referrals: referredCustomers.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-4">Referred Customers</h4>
                              <table className="min-w-full table-fixed divide-y divide-gray-200 bg-white rounded-xl overflow-hidden">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="w-1/3 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">Date</th>
                                    <th className="w-1/3 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Name</th>
                                    <th className="w-1/3 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Phone</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                  {referredCustomers.map(rc => (
                                    <tr key={rc.id}>
                                      <td className="w-1/3 px-4 py-3 text-left">{rc.created_at ? new Date(rc.created_at).toLocaleDateString() : 'Unknown'}</td>
                                      <td className="w-1/3 px-4 py-3 text-center">{rc.name || 'N/A'}</td>
                                      <td className="w-1/3 px-4 py-3 text-right">{rc.phone}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ),
                        }}
                      </Tabs>
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

const CustomerDetails = ({ customer, heardAboutUs }) => (
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
    <div>
      <span className="font-bold">Heard About Us:</span>
      <span className="ml-2">{heardAboutUs || 'Not provided'}</span>
    </div>
  </div>
);

export default CustomerTable; 