import React from 'react';
import { useState } from 'react';
import Tabs from '../../common/ui/Tabs';
import StandardPaymentForm from './StandardPaymentForm';
import AdvancePaymentForm from './AdvancePaymentForm';
import ExpenseForm from './ExpenseForm';

const PaymentRecordTab = () => {
  const [activeTab, setActiveTab] = useState('standard');

  return (
    <div className="max-w-xl mx-auto my-10">
      <Tabs
        tabs={[
          { label: 'Standard Payment', key: 'standard', show: true },
          { label: 'Advance Payment', key: 'advance', show: true },
          { label: 'Expense', key: 'expense', show: true },
        ]}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      >
        {{
          standard: <StandardPaymentForm />,
          advance: <AdvancePaymentForm />,
          expense: <ExpenseForm />,
        }}
      </Tabs>
    </div>
  );
};

export default PaymentRecordTab; 