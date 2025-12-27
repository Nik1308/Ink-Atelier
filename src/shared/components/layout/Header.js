import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { homepageContent } from '../../data/homepageContent';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { header } = homepageContent;

  return (
    <header className="w-full bg-black sticky top-0 z-50 border-b border-gray-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img
              src={header.logo}
              alt="Ink Atelier Logo"
              className="h-8 md:h-10 w-auto"
              loading="eager"
              onError={(e) => {
                e.target.style.display = 'none';
                const fallback = e.target.nextElementSibling;
                if (fallback) {
                  fallback.style.display = 'block';
                }
              }}
            />
            <span className="text-xl md:text-2xl font-bold text-white tracking-tight pl-4">
              {header.logoText}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {header.navItems.map((item, index) => (
              <a
                key={index}
                href={item.link}
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                {item.label}
              </a>
            ))}
            <Link
              to={header.signInLink}
              className="text-white hover:text-gray-300 transition-colors font-medium"
            >
              {header.signInText}
            </Link>
            <a
              href="#consultation"
              onClick={(e) => {
                e.preventDefault();
                const element = document.querySelector('#consultation');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="px-6 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-all"
            >
              {header.bookAppointmentText}
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-white hover:text-gray-300 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-6 border-t border-gray-800">
            <div className="flex flex-col gap-4">
              {header.navItems.map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-300 hover:text-white transition-colors font-medium"
                >
                  {item.label}
                </a>
              ))}
              <Link
                to={header.signInLink}
                onClick={() => setIsMenuOpen(false)}
                className="text-white hover:text-gray-300 transition-colors font-medium"
              >
                {header.signInText}
              </Link>
              <a
                href="#consultation"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMenuOpen(false);
                  const element = document.querySelector('#consultation');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="px-6 py-3 bg-white text-black rounded-lg font-semibold text-center hover:bg-gray-100 transition-all"
              >
                {header.bookAppointmentText}
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
