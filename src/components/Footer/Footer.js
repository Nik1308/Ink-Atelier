import React from "react";

const Footer = () => (
  <footer className="bg-offwhite text-black py-6 border-t-2 border-black font-serif text-center mt-8">
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2 text-lg font-bold">
        <img src={process.env.PUBLIC_URL + "/logo192.png"} alt="Ink Atelier Logo" className="w-9 h-9 rounded-full border-2 border-gray-400 bg-gray-400" />
        <span>Ink Atelier</span>
      </div>
      <div className="flex gap-6 my-2">
        <a href="#categories" className="text-black hover:text-gray-600 transition">Styles</a>
        <a href="#contact" className="text-black hover:text-gray-600 transition">Contact</a>
        <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-600 transition">Instagram</a>
      </div>
      <div className="text-sm text-gray-500">© {new Date().getFullYear()} Ink Atelier. All rights reserved.</div>
    </div>
  </footer>
);

export default Footer; 