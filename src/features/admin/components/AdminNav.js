import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Drawer from '../../common/ui/Drawer';
import { FiHome, FiUsers, FiFileText, FiCreditCard, FiBarChart2, FiMessageCircle, FiLogOut, FiMenu, FiUserPlus } from 'react-icons/fi';

const NAV_LINKS = [
  { label: 'Dashboard', key: 'dashboard', icon: <FiHome /> },
  { label: 'Leads', key: 'leads', icon: <FiUserPlus /> },
  { label: 'Customers', key: 'customers', icon: <FiUsers /> },
  { label: 'Consents', key: 'consents', icon: <FiFileText /> },
  { label: 'Payments', key: 'payments', icon: <FiCreditCard /> },
  // { label: 'Ledger', key: 'ledger', icon: <FiBarChart2 /> },
  { label: 'Messages', key: 'messages', icon: <FiMessageCircle /> }
];

const AdminNav = ({ onLogout, activeTab, onTabChange, allowedTabs }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);
  const handleLinkClick = (key) => {
    onTabChange(key);
    closeDrawer();
  };
  // Only show links from allowedTabs if provided
  const filteredLinks = allowedTabs ? NAV_LINKS.filter(l => allowedTabs.includes(l.key)) : NAV_LINKS;
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/60 bg-blur-xl drop-shadow-lg border-b border-white/10 dark:border-white/30 backdrop-blur-lg select-none">
      {/* ROW LAYOUT */}
      <div className="max-w-8xl mx-auto px-3 sm:px-6 h-16 flex items-center relative">
        {/* Hamburger (mobile left) */}
        <button
          type="button"
          className="md:hidden flex items-center justify-center p-2 rounded-lg text-white/80 hover:text-white/100 transition z-10"
          aria-label="Open navigation menu"
          onClick={openDrawer}
        >
          <FiMenu className="text-2xl" />
        </button>
        {/* Logo - left on desktop, absolutely centered on mobile */}
        <div className="hidden md:flex items-center h-full mr-4">
          <Link to="/admin" className="flex items-center gap-2 sm:gap-3 py-2">
            <img src={process.env.PUBLIC_URL + '/logo192.png'}
                alt="Ink Atelier Logo"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border-2 border-white/20" />
          </Link>
        </div>
        {/* On mobile - absolutely centered logo */}
        <div className="md:hidden absolute left-1/2 transform -translate-x-1/2 z-0">
          <Link to="/admin" className="flex items-center gap-2 sm:gap-3 py-2 justify-center">
            <img src={process.env.PUBLIC_URL + '/logo192.png'}
                alt="Ink Atelier Logo"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border-2 border-white/20" />
          </Link>
        </div>
        {/* Nav Tabs - always centered on desktop (flex-1) */}
        <nav className="hidden md:flex flex-1 justify-center gap-1 lg:gap-3">
          {filteredLinks.map(link => (
            <button
              type="button"
              key={link.key}
              onClick={() => onTabChange(link.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white/80 font-semibold transition hover:bg-white/10 hover:text-white focus:text-white focus:bg-white/10
                ${activeTab === link.key ? 'bg-white/20 text-white shadow font-bold' : ''}`}
              aria-current={activeTab === link.key ? 'page' : undefined}
            >
              <span className="text-lg">{link.icon}</span>
              <span>{link.label}</span>
            </button>
          ))}
        </nav>
        {/* Desktop logout - right side always */}
        <div className="hidden md:flex items-center h-full ml-4">
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-rose-500/80 hover:bg-rose-700 text-white font-semibold text-base ml-2 shadow-sm focus:outline-none"
          >
            <FiLogOut className="text-lg" />
            <span>Logout</span>
          </button>
        </div>
        {/* Mobile Logout (right) */}
        <div className="flex md:hidden items-center ml-auto z-10">
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-500/80 hover:bg-rose-700 text-white font-semibold text-base ml-2 shadow-sm focus:outline-none"
          >
            <FiLogOut className="text-lg" />
          </button>
        </div>
      </div>
      {/* Drawer for mobile (left side) */}
      <Drawer
        open={drawerOpen}
        onClose={closeDrawer}
        maxWidth="max-w-xs"
        side="left"
      >
        <div className="flex flex-col gap-1 pt-2 px-1">
          {/* Drawer close btn mobile only */}
          <div className="flex items-center justify-between mb-2 px-2">
            <h2 className="font-bold text-xl text-black dark:text-white">Menu</h2>
            <button onClick={closeDrawer} aria-label="Close Drawer" className="text-2xl font-bold text-gray-500 hover:text-gray-900 -mr-2">×</button>
          </div>
          {filteredLinks.map(link => (
            <button
              type="button"
              key={link.key}
              onClick={() => handleLinkClick(link.key)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-black dark:text-white/90 font-semibold text-base w-full text-left transition hover:bg-black/5 dark:hover:bg-white/10 hover:text-black dark:hover:text-white focus:text-black dark:focus:text-white focus:bg-black/5 dark:focus:bg-white/10
                ${activeTab === link.key ? 'bg-black/10 dark:bg-white/20 text-black dark:text-white shadow font-bold' : ''}`}
              aria-current={activeTab === link.key ? 'page' : undefined}
            >
              <span className="text-[1.35em]">{link.icon}</span>
              <span>{link.label}</span>
            </button>
          ))}
        </div>
        <div className="border-t border-white/10 p-4 mt-4">
          <button
            onClick={() => { onLogout(); closeDrawer(); }}
            className="w-full flex items-center gap-3 justify-center px-4 py-2 rounded-xl bg-rose-500/80 hover:bg-rose-700 text-white font-bold text-base shadow focus:outline-none"
          >
            <FiLogOut className="text-lg" /> Logout
          </button>
        </div>
      </Drawer>
    </header>
  );
};

export default AdminNav;
