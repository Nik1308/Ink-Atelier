import React from "react";

const Footer = () => (
  <footer className="bg-[#181818] text-offwhite py-10 border-t-0 font-serif text-center relative z-20">
    <div className="max-w-5xl mx-auto flex flex-col items-center gap-4 px-4">
      <div className="flex items-center gap-3 text-2xl font-bold">
        <img src={process.env.PUBLIC_URL + "/logo192.png"} alt="Ink Atelier Logo" className="w-10 h-10 rounded-full border-2 border-gray-400 bg-gray-400" />
        <span>Ink Atelier</span>
      </div>
      <div className="flex gap-8 my-2 text-lg">
        <a href="#categories" className="text-offwhite hover:text-amber-200 transition">Styles</a>
        <a href="#contact" className="text-offwhite hover:text-amber-200 transition">Contact</a>
        <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="text-offwhite hover:text-amber-200 transition">Instagram</a>
      </div>
      <div className="text-base text-gray-400">© {new Date().getFullYear()} Ink Atelier. All rights reserved.</div>
    </div>
  </footer>
);

export default Footer; 