import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiMapPin, FiClock } from 'react-icons/fi';
import { homepageContent } from '../../data/homepageContent';

const Footer = () => {
  const { footer } = homepageContent;

  return (
    <footer className="w-full bg-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8 pb-8 border-b border-gray-800">
          {/* Logo */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center">
              <img
                src={footer.logo}
                alt="Ink Atelier Logo"
                className="h-10 md:h-12 w-auto"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <span className="text-xl md:text-2xl font-bold text-white tracking-tight pl-4">
                INK ATELIER
              </span>
            </Link>
          </div>

          {/* Studio Location */}
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-3">
              <FiMapPin className="text-white mt-1 flex-shrink-0" size={20} />
              <div>
                <p className="text-white font-medium mb-1">Studio Location</p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {footer.location}
                </p>
              </div>
            </div>
          </div>

          {/* Studio Timing */}
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-3">
              <FiClock className="text-white mt-1 flex-shrink-0" size={20} />
              <div>
                <p className="text-white font-medium mb-1">Studio Hours</p>
                <p className="text-gray-400 text-sm">
                  {footer.timing}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm text-center md:text-left">
            {footer.copyright}
          </p>
          
          <a
            href={footer.instagramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Follow us on Instagram"
          >
            <FiInstagram size={20} />
            <span className="text-sm">Instagram</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
