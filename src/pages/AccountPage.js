import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserData, clearAuthData } from '../utils/authUtils';
import { useAdminData } from '../components/AdminDashboard/useAdminData';
import CustomersTab from '../components/AdminDashboard/CustomersTab';

const AccountPage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('customers');
  const navigate = useNavigate();

  // Use custom hook for admin data
  const { customers, consentForms, payments, loading: dataLoading, error, refreshData } = useAdminData(userData, activeTab);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const userData = getUserData();

    if (!userData) {
      navigate('/login');
      return;
    }

    setUserData(userData);
    setLoading(false);
  };

  const handleLogout = () => {
    clearAuthData();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
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
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Welcome back, {userData?.name || 'Admin'}!
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Sign Out
            </button>
          </div>
        </div>

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage; 