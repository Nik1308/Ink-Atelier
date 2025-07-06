import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO/SEO";

const FormsPage = () => (
  <>
    <SEO 
      title="Consent Forms & Payment Records - Ink Atelier"
      description="Complete your tattoo consent form, piercing consent form, or payment record. Required forms for all body art procedures at Ink Atelier."
      keywords="tattoo consent form, piercing consent form, payment record, body art consent, tattoo waiver, piercing waiver, ink atelier forms"
              image="/assets/images/logo.jpg"
              url="https://inkatelier.in/forms"
      type="website"
    />
    <section className="min-h-screen bg-gradient-to-br from-[#f7f5f2] to-[#f9fafb] flex flex-col items-center justify-center py-16 px-2">
      <div className="bg-white rounded-3xl shadow-lg border border-gray-200 max-w-lg w-full px-8 py-12 mx-auto flex flex-col items-center gap-8">
        <h2 className="text-3xl font-sans font-semibold mb-2 text-center tracking-tight">Forms</h2>
        <p className="text-gray-500 text-base mb-6 text-center">Fill out a consent or payment form below</p>
        <div className="flex flex-col w-full gap-5">
          <Link
            to="/tattoo-consent"
            className="w-full text-center bg-black text-white rounded-full px-6 py-4 font-semibold text-lg shadow-sm hover:bg-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black/30"
          >
            Tattoo Consent Form
          </Link>
          <Link
            to="/piercing-consent"
            className="w-full text-center bg-black text-white rounded-full px-6 py-4 font-semibold text-lg shadow-sm hover:bg-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black/30"
          >
            Piercing Consent Form
          </Link>
          <Link
            to="/payment-record"
            className="w-full text-center bg-black text-white rounded-full px-6 py-4 font-semibold text-lg shadow-sm hover:bg-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black/30"
          >
            Payment Record Form
          </Link>
        </div>
      </div>
    </section>
  </>
);

export default FormsPage; 