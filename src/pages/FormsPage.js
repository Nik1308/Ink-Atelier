import React from "react";
import { Link } from "react-router-dom";

const FormsPage = () => (
  <section className="min-h-screen bg-[#f7f5f2] flex flex-col items-center justify-center py-16 px-2">
    <div className="bg-white rounded-2xl shadow-2xl border-2 border-black max-w-xl w-full p-10 mx-auto flex flex-col items-center gap-8">
      <h2 className="text-3xl font-serif font-bold mb-6 text-center">Consent Forms</h2>
      <Link
        to="/tattoo-consent"
        className="w-full text-center bg-black text-offwhite rounded-xl px-6 py-4 font-bold text-xl shadow hover:bg-gray-800 transition mb-4"
      >
        Tattoo Consent Form
      </Link>
      <Link
        to="/piercing-consent"
        className="w-full text-center bg-black text-offwhite rounded-xl px-6 py-4 font-bold text-xl shadow hover:bg-gray-800 transition"
      >
        Piercing Consent Form
      </Link>
    </div>
  </section>
);

export default FormsPage; 