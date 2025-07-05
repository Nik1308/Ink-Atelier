import React, { useEffect } from 'react';

const Drawer = ({ open, onClose, children }) => {
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  // Always render for animation, but visually hidden when closed
  return (
    <div className={`fixed inset-0 z-50 flex pointer-events-none`}>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={open ? onClose : undefined}
        aria-label="Close drawer overlay"
      />
      {/* Drawer panel (right side) */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl transform transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : 'translate-x-full'} pointer-events-auto`}
        style={{ willChange: 'transform' }}
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Close drawer"
        >
          &times;
        </button>
        <div className="p-6 overflow-y-auto h-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Drawer; 