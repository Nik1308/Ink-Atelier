import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from './features/common/ui/Header/Header';
import Footer from './features/common/ui/Footer/Footer';
import HomePage from './features/home/HomePage';
import CategoryPage from './features/home/CategoryPage';
import FormsPage from './pages/FormsPage';
import { TattooConsentFormPage, PiercingConsentFormPage } from './features/forms/pages';
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import CsvUploadPage from "./pages/CsvUploadPage";
// import PaymentRecordFormPage from "./pages/forms/PaymentRecordFormPage";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  const hideHeaderRoutes = ["/forms", "/tattoo-consent", "/piercing-consent", "/login", "/admin", "/csv-upload"];
  const hideHeader = hideHeaderRoutes.includes(location.pathname);
  const hideFooter = hideHeaderRoutes.includes(location.pathname);
  
  return (
    <div className="min-h-screen text-black">
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
        <Route path="/forms" element={<FormsPage />} />
        <Route path="/tattoo-consent" element={<TattooConsentFormPage />} />
        <Route path="/piercing-consent" element={<PiercingConsentFormPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/csv-upload" element={<CsvUploadPage />} />
        {/* <Route path="/payment-record" element={<PaymentRecordFormPage />} /> */}
      </Routes>
      {!hideFooter && <Footer />}
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
