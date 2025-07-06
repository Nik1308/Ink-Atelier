import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserData, clearAuthData } from '../utils/authUtils';
import { useAdminData } from '../components/admin/Customer/hooks/useAdminData';
import CustomersTab from '../components/admin/Customer/CustomersTab';
import PaymentRecordTab from '../components/admin/Customer/PaymentRecordTab';
import LedgerTab from '../components/admin/Customer/LedgerTab';
import LoadingSpinner from '../components/common/LoadingSpinner';
import PageHeader from '../components/common/PageHeader';
import SEO from '../components/SEO/SEO';

const AdminPage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('customers');
  const navigate = useNavigate();

  // Use custom hook for admin data
  const { customers, consentForms, payments, loading: dataLoading, error, refreshData } = useAdminData(userData, activeTab);

  useEffect(() => {
    const userData = getUserData();

    if (!userData) {
      navigate('/login');
      return;
    }

    setUserData(userData);
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    clearAuthData();
    navigate('/login');
  };

  if (loading) {
    return (
      <>
        <SEO 
          title="Admin Dashboard - Ink Atelier"
          description="Admin dashboard for Ink Atelier. Manage customers, consent forms, and payment records."
          keywords="admin dashboard, customer management, ink atelier admin, tattoo studio management"
          image="/assets/images/logo.jpg"
          url="https://inkatelier.in/admin"
          type="website"
        />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </>
    );
  }

  if (!userData) {
    return (
      <>
        <SEO 
          title="Access Denied - Ink Atelier"
          description="Please log in to access the admin dashboard."
          keywords="admin login, access denied, ink atelier admin"
          image="/assets/images/logo.jpg"
          url="https://inkatelier.in/admin"
          type="website"
        />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Please log in to access your account.</p>
            <button
              onClick={() => navigate('/login')}
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Go to Login
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO 
        title="Admin Dashboard - Ink Atelier"
        description={`Admin dashboard for ${userData?.name || 'Admin'}. Manage customers, consent forms, and payment records at Ink Atelier.`}
        keywords="admin dashboard, customer management, consent forms, payment records, ink atelier admin, tattoo studio management"
        image="/assets/images/logo.jpg"
        url="https://inkatelier.in/admin"
        type="website"
      />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <PageHeader
            title="Admin Dashboard"
            subtitle={`Welcome back, ${userData?.name || 'Admin'}!`}
            action={
              <button
                onClick={handleLogout}
                className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Sign Out
              </button>
            }
          />

          {/* Navigation Tabs */}
          <div className="px-4 sm:px-0">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('customers')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'customers'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Customers
                </button>
                <button
                  onClick={() => setActiveTab('payment-record')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'payment-record'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Payment Record
                </button>
                {/* <button
                  onClick={() => setActiveTab('ledger')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'ledger'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Ledger
                </button> */}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow rounded-lg p-6">
              {activeTab === 'customers' && (
                <CustomersTab 
                  customers={customers} 
                  consentForms={consentForms}
                  payments={payments}
                  loading={dataLoading}
                  error={error}
                  onRefresh={refreshData}
                />
              )}
              {activeTab === 'payment-record' && (
                <PaymentRecordTab />
              )}
              {/* {activeTab === 'ledger' && (
                <LedgerTab payments={payments} />
              )} */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPage; 