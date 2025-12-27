import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserData, clearAuthData } from '../../../shared/utils/auth';
import { SEO } from '../../../shared/components/ui';
import AdminNav from '../components/AdminNav';
import DashboardTab from '../tabs/DashboardTab';
import CustomersTab from '../tabs/CustomersTab';
import ConsentsTab from '../tabs/ConsentFormsTab';
import PaymentsTab from '../tabs/PaymentTab';
import LedgerTab from '../tabs/LedgerTab';
import BookingsTab from '../tabs/UpcomingBookingTab';
import MessagesTab from '../tabs/MessagesTab';
import LeadsTab from '../tabs/LeadsTab';
import { useLazyAdminResources } from '../hooks/useLazyAdminResources';

const TAB_LABELS = {
  dashboard: 'Dashboard',
  customers: 'Customers',
  consents: 'Consents',
  payments: 'Payments',
  ledger: 'Ledger',
  bookings: 'Bookings',
  messages: 'Messages',
  leads: 'Leads'
};

const ROLE_TAB_KEYS = {
  admin: ['dashboard', 'leads', 'customers', 'consents', 'payments', 'ledger', 'bookings', 'messages'],
  manager: ['leads','consents', 'payments', 'messages'],
};

const AdminPage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  
  // Lazy load resources based on active tab
  // Only fetch data for the current tab
  useLazyAdminResources({
    enableCustomers: activeTab === 'customers' || activeTab === 'messages' || activeTab === 'dashboard',
    enablePayments: activeTab === 'payments' || activeTab === 'messages' || activeTab === 'dashboard' || activeTab === 'ledger',
    enableAdvancePayments: activeTab === 'bookings' || activeTab === 'dashboard',
    enableTattooConsents: activeTab === 'consents' || activeTab === 'customers',
    enablePiercingConsents: activeTab === 'consents' || activeTab === 'customers',
    enableExpenses: activeTab === 'ledger' || activeTab === 'dashboard',
    enableLeads: activeTab === 'leads',
  });

  // Only allow tabs for the user's role
  const allowedTabs = userData?.role === 'manager' ? ROLE_TAB_KEYS.manager : ROLE_TAB_KEYS.admin;

  // (1) Always at top level — runs after allowedTabs is calculated
  useEffect(() => {
    if (!allowedTabs.includes(activeTab)) {
      setActiveTab(allowedTabs[0]);
    }
    // eslint-disable-next-line
  }, [userData, allowedTabs, activeTab]);

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
          description="Admin dashboard for Ink Atelier. Business analytics and metrics overview."
          keywords="admin dashboard, analytics, glassmorphism, ink atelier admin, tattoo studio management"
          image="/assets/images/logo.jpg"
          url="https://inkatelier.in/admin"
          type="website"
        />
        <div className="min-h-screen bg-black bg-opacity-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO 
        title="Admin Dashboard - Ink Atelier"
        description={`Business overview for ${userData?.name || 'Admin'}`}
        keywords="admin dashboard, analytics, glassmorphism, ink atelier admin, tattoo studio management"
        image="/assets/images/logo.jpg"
        url="https://inkatelier.in/admin"
        type="website"
      />
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-white pb-10">
        <AdminNav onLogout={handleLogout} activeTab={activeTab} onTabChange={setActiveTab} allowedTabs={allowedTabs} />
        <div className="pt-20 max-w-7xl mx-auto px-2 sm:px-6">
          {activeTab === 'dashboard' && allowedTabs.includes('dashboard') && <DashboardTab />}
          {activeTab === 'leads' && <LeadsTab />}
          {activeTab === 'customers' && allowedTabs.includes('customers') && <CustomersTab />}
          {activeTab === 'consents' && <ConsentsTab />}
          {activeTab === 'payments' && <PaymentsTab />}
          {/* {activeTab === 'ledger' && <LedgerTab />} */}
          {activeTab === 'bookings' && <BookingsTab />}
          {activeTab === 'messages' && <MessagesTab />}
        </div>
      </div>
    </>
  );
};

export default AdminPage; 