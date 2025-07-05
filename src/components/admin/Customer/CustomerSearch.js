import React from 'react';

const CustomerSearch = ({ searchQuery, setSearchQuery, searchInputRef }) => {
  return (
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
  );
};

export default CustomerSearch; 