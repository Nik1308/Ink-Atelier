import React, { useState } from 'react';
import GlassCard from '../components/GlassCard';
import { Tabs } from '../../../shared';
import StandardPaymentForm from './PaymentRecordTab/StandardPaymentForm';
import AdvancePaymentForm from './PaymentRecordTab/AdvancePaymentForm';
import ExpenseForm from './PaymentRecordTab/ExpenseForm';

const tabDefs = [
  { label: 'Standard Payment', key: 'standard', show: true },
  { label: 'Advance Payment', key: 'advance', show: true },
  { label: 'Expense', key: 'expense', show: true },
];

const PaymentsTab = () => {
  const [activeTab, setActiveTab] = useState('standard');
  return (
    <div className="flex flex-col items-center min-h-[60vh] py-12">
      <div className="w-full max-w-2xl flex flex-col items-center drop-shadow-2xl rounded-3xl border border-white/30 bg-white/15 dark:bg-black/30 p-0">
        {/* Premium Tabs UI */}
        <div className="flex flex-row justify-center mt-8 gap-4 mb-10 w-full">
          {tabDefs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-2 text-lg font-bold rounded-full transition backdrop-blur-lg
                ${activeTab === tab.key
                  ? 'bg-white/80 text-black shadow border border-white/70'
                  : 'bg-white/10 text-white/70 hover:bg-white/30 border border-white/20'}
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="w-full flex flex-col px-8 pb-10">
          {/* Glassy Card with generous spacing for forms */}
          <div className="w-full max-w-full">
            {activeTab === 'standard' && <StandardPaymentForm glass />} 
            {activeTab === 'advance' && <AdvancePaymentForm glass />} 
            {activeTab === 'expense' && <ExpenseForm glass />} 
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsTab; 