import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { getUserData } from "../../../../utils/authUtils";

const Header = () => {
  const userData = getUserData();
  return (
    <header className="flex justify-between items-center px-10 py-4 bg-offwhite text-black border-b-2 border-black font-serif sticky top-0 z-50 shadow-md">
      <div className="flex items-center">
        <Link to="/login" className="flex items-center">
          <img src={process.env.PUBLIC_URL + "/logo192.png"} alt="Ink Atelier Logo" className="w-12 h-12 mr-3 rounded-full border-2 border-gray-400 bg-white" />
          <span className="text-2xl font-bold tracking-wider drop-shadow-sm">Ink Atelier</span>
        </Link>
      </div>
      <div className="flex items-center gap-8">
        {userData ? (
          <>
            <Link to="/forms" className="text-black font-semibold hover:underline text-lg">Consent Forms</Link>
            <Link to="/admin" className="text-black font-semibold hover:underline text-lg">Admin</Link>
          </>
        ) : (
          <>
            <a
              href="https://wa.me/9636301625"
              className="text-offwhite rounded-full font-semibold flex items-center hover:scale-105 transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp className="text-green-400 text-3xl" />
            </a>
            <a
              href="https://www.instagram.com/_ink_atelier_/"
              className="text-pink-400 rounded-full font-semibold flex items-center hover:scale-105 transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="text-pink-400 text-3xl" />
            </a>
          </>
        )}
      </div>
    </header>
  );
};

export default Header; 