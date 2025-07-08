import React, { useState } from 'react';
import Drawer from '../../common/ui/Drawer';
import ConsentFormDetails from '../ConsentFormsTab/ConsentFormDetails';
import PaymentHistoryTable from '../CustomersTab/PaymentHistoryTable';

function getAvatarLetter(name = '') {
  return name && name.length > 0 ? name[0].toUpperCase() : '';
}

const tabList = [
  { key: 'details', label: 'Customer Details' },
  { key: 'consents', label: 'Consent Forms' },
  { key: 'payments', label: 'Payment History' },
  { key: 'referrals', label: 'Referrals' },
];

export default function CustomerDetailsSidebar({ customer, getCustomerConsentForms, getCustomerPayments, onClose, allCustomers = [] }) {
  const [activeTab, setActiveTab] = useState('details');
  const [selectedConsent, setSelectedConsent] = useState(null);
  const consents = getCustomerConsentForms(customer.id) || [];
  const payments = getCustomerPayments(customer.id) || [];
  const lifetimeSpend = payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
  const referredCustomers = allCustomers.filter(c => c.referred_by_customer_id === customer.id);
  const referrals = referredCustomers.length;

  return (
    <div className="w-[90vw] max-w-full h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-2xl mr-4">
            {getAvatarLetter(customer.name)}
          </div>
          <div>
            <div className="font-semibold text-lg text-gray-900">{customer.name}</div>
            <div className="text-gray-500 text-sm">{customer.phone}</div>
          </div>
        </div>
        <button
          className="px-4 py-2 border border-indigo-500 text-indigo-600 font-semibold rounded hover:bg-indigo-50 transition text-sm"
          onClick={onClose}
        >
          Hide Details
        </button>
      </div>
      {/* Summary */}
      <div className="flex justify-between px-6 py-4 border-b bg-slate-100">
        <div className="text-center">
          <div className="text-xs text-gray-500">Consents</div>
          <div className="font-bold text-lg">{consents.length}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">Payments</div>
          <div className="font-bold text-lg">{payments.length}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">Lifetime Spend</div>
          <div className="font-bold text-lg">₹{lifetimeSpend.toLocaleString()}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">Referrals</div>
          <div className="font-bold text-lg">{referrals}</div>
        </div>
      </div>
      {/* Tabs */}
      <div className="flex border-b bg-gray-50">
        {tabList.map((tab) => (
          <button
            key={tab.key}
            className={`flex-1 py-3 font-semibold text-base bg-slate-100 border-b-2 transition ${activeTab === tab.key ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-black'}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto pt-6 bg-gray-50">
        {activeTab === 'details' && (
          <div className="space-y-3 px-6">
            {customer.date_of_birth && (
              <div><span className="font-bold">Date of Birth:</span> <span className="ml-1">{customer.date_of_birth}</span></div>
            )}
            {customer.email && (
              <div><span className="font-bold">Email:</span> <span className="ml-1">{customer.email}</span></div>
            )}
            {customer.address && (
              <div><span className="font-bold">Address:</span> <span className="ml-1">{customer.address}</span></div>
            )}
            {customer.heard_about_us && (
              <div><span className="font-bold">Heard About Us:</span> <span className="ml-1">{customer.heard_about_us}</span></div>
            )}
          </div>
        )}
        {activeTab === 'consents' && (
          <div>
            {consents.length === 0 ? (
              <div className="text-gray-500 text-center">No consent forms found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Location/Type</th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Artist</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {consents.map((form, index) => {
                      const isTattoo = form.type === 'tattoo';
                      return (
                        <tr key={`customer-consent-${customer.id}-${form.id || form.created_at || index}`}>
                          {/* Type as pill */}
                          <td className="px-6 py-4 whitespace-nowrap text-left">
                            <span className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold">
                              {isTattoo ? 'Tattoo' : 'Piercing'}
                            </span>
                          </td>
                          {/* Date */}
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {isTattoo
                              ? (form.tattoo_date ? new Date(form.tattoo_date).toLocaleDateString() : 'N/A')
                              : (form.piercing_date ? new Date(form.piercing_date).toLocaleDateString() : 'N/A')}
                          </td>
                          {/* Location/Type multiline */}
                          <td className="px-6 py-4 whitespace-pre-line text-center">
                            {isTattoo
                              ? (form.tattoo_location || '—')
                              : (form.piercing_type
                                  ? form.piercing_type + ' -' + (form.piercing_subtype ? `\n${form.piercing_subtype}` : '')
                                  : '—')}
                          </td>
                          {/* Artist */}
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {isTattoo
                              ? (form.tattoo_artist || '—')
                              : (form.piercing_artist || '—')}
                          </td>
                          {/* Actions */}
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex flex-col gap-1 items-end">
                              <button
                                className="text-indigo-600 font-semibold hover:underline text-sm"
                                onClick={() => setSelectedConsent(form)}
                              >
                                View Details
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {activeTab === 'payments' && (
          <div>
            {payments.length === 0 ? (
              <div className="text-gray-500 text-center">No payments found.</div>
            ) : (
              <PaymentHistoryTable payments={payments} />
            )}
          </div>
        )}
        {activeTab === 'referrals' && (
          <div>
            {referrals > 0 ? (
              <div>
                <table className="w-full min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="w-1/3 px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="w-1/3 px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="w-1/3 px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {referredCustomers.map((rc, index) => (
                      <tr key={`customer-referral-${customer.id}-${rc.id || index}`}>
                        <td className="w-1/3 px-6 py-4 whitespace-nowrap text-left">{rc.created_at ? new Date(rc.created_at).toLocaleDateString() : 'N/A'}</td>
                        <td className="w-1/3 px-6 py-4 whitespace-nowrap text-center">{rc.name}</td>
                        <td className="w-1/3 px-6 py-4 whitespace-nowrap text-right">{rc.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-gray-500 text-center">No referrals found.</div>
            )}
          </div>
        )}
      </div>
      {/* Consent Form Details Drawer */}
      <Drawer open={!!selectedConsent} onClose={() => setSelectedConsent(null)}>
        {selectedConsent && (
          <ConsentFormDetails form={selectedConsent} />
        )}
      </Drawer>
    </div>
  );
} 