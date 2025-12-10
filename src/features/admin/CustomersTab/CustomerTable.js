import React from 'react';

function getAvatarLetter(name = '') {
  return name && name.length > 0 ? name[0].toUpperCase() : '';
}

const CustomerTable = ({ customers, getCustomerConsentForms, getCustomerPayments, onViewDetails }) => {
  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"> </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Consents</th>
            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Payments</th>
            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Lifetime Spend</th>
            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Referrals</th>
            <th className="px-6 py-3"> </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {customers.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center text-gray-400 py-8">No customers found.</td>
            </tr>
          ) : (
            customers.map((customer) => {
              const consents = getCustomerConsentForms ? getCustomerConsentForms(customer.id) : [];
              const payments = getCustomerPayments ? getCustomerPayments(customer.id) : [];
              const lifetimeSpend = payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
              const referrals = customers.filter(c => c.referredByCustomerId === customer.id).length || 0;

              return (
                <tr key={customer.id}>
                  {/* Avatar/Initials */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                      {getAvatarLetter(customer.name)}
                    </div>
                  </td>
                  {/* Name + Phone */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-gray-900">{customer.name}</div>
                    <div className="text-gray-500 text-sm">{customer.phone}</div>
                  </td>
                  {/* Consents */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="font-bold">{consents.length}</span>
                  </td>
                  {/* Payments */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="font-bold">{payments.length}</span>
                  </td>
                  {/* Lifetime Spend */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="font-bold">₹{lifetimeSpend.toLocaleString()}</span>
                  </td>
                  {/* Referrals */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="font-bold">{referrals}</span>
                  </td>
                  {/* View Details Button */}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      className="px-4 py-2 border border-indigo-500 text-indigo-600 font-semibold rounded hover:bg-indigo-50 transition text-sm"
                      onClick={() => onViewDetails(customer)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable; 