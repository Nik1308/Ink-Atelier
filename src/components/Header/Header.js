import React from "react";

const Header = () => {
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-offwhite text-black border-b-2 border-black font-serif sticky top-0 z-50 shadow-md">
      <div className="flex items-center">
        <img src={process.env.PUBLIC_URL + "/logo192.png"} alt="Ink Atelier Logo" className="w-12 h-12 mr-3 rounded-full border-2 border-gray-400 bg-white" />
        <span className="text-2xl font-bold tracking-wider drop-shadow-sm">Ink Atelier</span>
      </div>
      <a
        href="https://wa.me/1234567890"
        className="bg-black text-offwhite px-4 py-2 rounded-full font-semibold flex items-center shadow hover:bg-gray-800 hover:scale-105 transition"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span role="img" aria-label="WhatsApp" className="mr-2">💬</span> WhatsApp Us
      </a>
    </header>
  );
};

export default Header; 