import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Public pages
import HomePage from './features/public/pages/HomePage';
import FormsPage from './features/public/pages/FormsPage';
import TattooConsentFormPage from './features/public/pages/TattooConsentFormPage';
import PiercingConsentFormPage from './features/public/pages/PiercingConsentFormPage';

// Admin pages
import LoginPage from './features/admin/pages/LoginPage';
import AdminPage from './features/admin/pages/AdminPage';
import CsvUploadPage from './features/admin/pages/CsvUploadPage';

const queryClient = new QueryClient();

function AppContent() {
  return (
    <div className="min-h-screen text-black">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/forms" element={<FormsPage />} />
        <Route path="/tattoo-consent" element={<TattooConsentFormPage />} />
        <Route path="/piercing-consent" element={<PiercingConsentFormPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/csv-upload" element={<CsvUploadPage />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppContent />
      </Router>
    </QueryClientProvider>
  );
}
