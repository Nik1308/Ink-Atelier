import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header/Header";
import HeroBanner from "./components/HeroBanner/HeroBanner";
import CategoryCarousel from "./components/CategoryCarousel/CategoryCarousel";
import GoogleReviewWidget from "./components/GoogleReviewWidget/GoogleReviewWidget";
import ContactUs from "./components/ContactUs/ContactUs";
import MeetTheArtists from "./components/MeetTheArtists/MeetTheArtists";
import WhyChooseUs from "./components/WhyChooseUs/WhyChooseUs";
import InstagramFeed from "./components/InstagramFeed/InstagramFeed";
import Footer from "./components/Footer/Footer";
import CategoryPage from "./pages/CategoryPage/CategoryPage";
import FormsPage from "./pages/FormsPage";
import TattooConsentFormPage from "./pages/TattooConsentFormPage";
import PiercingConsentFormPage from "./pages/PiercingConsentFormPage";
import LoginPage from "./pages/LoginPage";
import AccountPage from "./pages/AccountPage";
import PaymentRecordFormPage from "./pages/PaymentRecordFormPage";

function AppContent() {
  const location = useLocation();
  const hideHeaderRoutes = ["/forms", "/tattoo-consent", "/piercing-consent", "/login", "/account"];
  const hideHeader = hideHeaderRoutes.includes(location.pathname);
  return (
    <div className="bg-offwhite bg-texture min-h-screen text-black">
      {!hideHeader && <Header />}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeroBanner />
              <CategoryCarousel />
              <WhyChooseUs />
              <GoogleReviewWidget />
              <MeetTheArtists />
              <InstagramFeed />
              <ContactUs />
            </>
          }
        />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
        <Route path="/forms" element={<FormsPage />} />
        <Route path="/tattoo-consent" element={<TattooConsentFormPage />} />
        <Route path="/piercing-consent" element={<PiercingConsentFormPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/payment-record" element={<PaymentRecordFormPage />} />
      </Routes>
      <Footer />
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
