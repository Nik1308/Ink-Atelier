import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import FormsPage from "./pages/FormsPage";
import TattooConsentFormPage from "./pages/forms/TattooConsentFormPage";
import PiercingConsentFormPage from "./pages/forms/PiercingConsentFormPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import PaymentRecordFormPage from "./pages/forms/PaymentRecordFormPage";

function AppContent() {
  const location = useLocation();
  const hideHeaderRoutes = ["/forms", "/tattoo-consent", "/piercing-consent", "/login", "/admin"];
  const hideHeader = hideHeaderRoutes.includes(location.pathname);
  const hideFooter = hideHeaderRoutes.includes(location.pathname);
  
  return (
    <div className="bg-offwhite bg-texture min-h-screen text-black">
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
        <Route path="/forms" element={<FormsPage />} />
        <Route path="/tattoo-consent" element={<TattooConsentFormPage />} />
        <Route path="/piercing-consent" element={<PiercingConsentFormPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/payment-record" element={<PaymentRecordFormPage />} />
      </Routes>
      {!hideFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
