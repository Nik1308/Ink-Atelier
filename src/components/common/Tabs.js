import React from 'react';

const Tabs = ({ tabs, activeTab, setActiveTab, children }) => {
  return (
    <div>
      <div className="flex space-x-4 mb-6 border-b border-gray-200">
        {tabs.filter(tab => tab.show !== false).map(tab => (
          <button
            key={tab.key}
            className={`px-4 py-2 font-semibold text-sm focus:outline-none transition border-b-2 ${activeTab === tab.key ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-black'}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>
        {children[activeTab]}
      </div>
    </div>
  );
};

export default Tabs; 