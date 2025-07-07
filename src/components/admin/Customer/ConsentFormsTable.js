import React from 'react';

const ConsentFormsTable = ({ forms, customers = [], onDownload, downloading, onViewDetails, currentPage = 1, onPageChange, totalItems, itemsPerPage = 10, showCustomerPhone = false }) => {
  const getSummaryDate = (form) => {
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
    return summaryDateDisplay;
  };

  // Helper to get customer phone by customer_id
  const getCustomerPhone = (form) => {
    if (!form.customer_id) return '-';
    const customer = customers.find(c => c.id === form.customer_id);
    return customer?.phone || '-';
  };

  // Helper to get customer name by customer_id
  const getCustomerName = (form) => {
    if (!form.customer_id) return '-';
    const customer = customers.find(c => c.id === form.customer_id);
    return customer?.name || '-';
  };

  return (
    <div>
      <table className="min-w-full table-fixed divide-y divide-gray-200 bg-white rounded-xl overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-1/6 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">Type</th>
            {showCustomerPhone && (
              <>
                <th className="w-1/6 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Customer Name</th>
                <th className="w-1/6 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Customer Phone</th>
              </>
            )}
            <th className="w-1/6 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Date</th>
            <th className="w-1/6 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Location/Type</th>
            <th className="w-1/6 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Artist</th>
            <th className="w-1/6 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {forms.length === 0 ? (
            <tr>
              <td colSpan={showCustomerPhone ? 7 : 5} className="text-center text-gray-400 py-8">
                No consent forms found for selected range.
              </td>
            </tr>
          ) : (
            forms.map((form) => (
              <tr key={`${form.type}-${form.id}`}> 
                <td className="w-1/6 px-4 py-3 text-left">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    form.type === 'tattoo' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {form.type === 'tattoo' ? 'Tattoo' : 'Piercing'}
                  </span>
                </td>
                {showCustomerPhone && (
                  <>
                    <td className="w-1/6 px-4 py-3 text-center">{getCustomerName(form)}</td>
                    <td className="w-1/6 px-4 py-3 text-center">{getCustomerPhone(form)}</td>
                  </>
                )}
                <td className="w-1/6 px-4 py-3 text-center">{getSummaryDate(form)}</td>
                <td className="w-1/6 px-4 py-3 text-center">
                  {form.type === 'tattoo'
                    ? form.tattoo_location
                    : `${form.piercing_type} - ${form.piercing_subtype}`}
                </td>
                <td className="w-1/6 px-4 py-3 text-center">
                  {form.type === 'tattoo' ? form.tattoo_artist : form.piercing_artist}
                </td>
                <td className="w-1/6 px-4 py-3 text-center">
                  <div className="flex flex-col items-center space-y-2">
                    <button
                      className="text-indigo-600 hover:text-indigo-900 text-xs font-semibold px-2 py-1 rounded transition"
                      onClick={() => onViewDetails(form)}
                    >
                      View Details
                    </button>
                    <button
                      className="text-indigo-600 hover:text-indigo-900 text-xs font-semibold px-2 py-1 rounded transition"
                      onClick={() => onDownload(form)}
                      disabled={downloading}
                    >
                      {downloading ? 'Downloading...' : 'Download'}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ConsentFormsTable; 