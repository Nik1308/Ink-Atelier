import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserData, clearAuthData } from '../utils/authUtils';
import { CustomersTab, PaymentRecordTab, LedgerTab, ConsentFormsTab, UpcomingBookingTab, MessagesTab } from '../features/admin';
import { useAdminResources } from '../features/admin/hooks';
import { LoadingSpinner, PageHeader, SEO } from '../features/common/ui';

const AdminPage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('customers');
  const navigate = useNavigate();

  const {
    customers,
    payments,
    advancePayments,
    tattooConsents,
    piercingConsents,
    consentForms,
    expenses,
  } = useAdminResources();

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
                <button
                  onClick={() => setActiveTab('ledger')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'ledger'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Ledger
                </button>
                <button
                  onClick={() => setActiveTab('all-consents')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'all-consents'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  All Consent Forms
                </button>
                <button
                  onClick={() => setActiveTab('upcoming-booking')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'upcoming-booking'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Upcoming Booking
                </button>
                <button
                  onClick={() => setActiveTab('messages')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'messages'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Messages
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow rounded-lg p-6">
              {activeTab === 'customers' && (
                <CustomersTab 
                  customers={customers.data || []}
                  consentForms={consentForms}
                  payments={payments.data || []}
                  loading={customers.isLoading || payments.isLoading || tattooConsents.isLoading || piercingConsents.isLoading}
                  error={customers.error?.message || payments.error?.message || tattooConsents.error?.message || piercingConsents.error?.message}
                  onRefresh={() => {
                    customers.refetch();
                    payments.refetch();
                    tattooConsents.refetch();
                    piercingConsents.refetch();
                  }}
                />
              )}
              {activeTab === 'payment-record' && (
                <PaymentRecordTab customers={customers.data || []} />
              )}
              {activeTab === 'ledger' && (
                <LedgerTab payments={payments.data || []} expenses={expenses?.data || []} customers={customers.data || []} />
              )}
              {activeTab === 'all-consents' && (
                <ConsentFormsTab
                  customers={customers.data || []}
                  forms={consentForms}
                  key="all-consents-tab"
                />
              )}
              {activeTab === 'upcoming-booking' && (
                <UpcomingBookingTab
                  bookings={advancePayments.data || []}
                  customers={customers.data || []}
                />
              )}
              {activeTab === 'messages' && (
                <MessagesTab
                  payments={payments.data || []}
                  advancePayments={advancePayments.data || []}
                  customers={customers.data || []}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPage; 