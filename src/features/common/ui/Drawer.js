import React, { useEffect } from 'react';

const Drawer = ({ open, isOpen, onClose, children, maxWidth = 'max-w-lg', side = 'right' }) => {
  // Support both 'open' and 'isOpen' props for compatibility
  const visible = typeof open !== 'undefined' ? open : isOpen;

  useEffect(() => {
    if (!visible) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [visible, onClose]);

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [visible]);

  // Determine panel side classes
  const panelSideClasses =
    side === 'left'
      ? `fixed left-0 top-0 h-full w-full ${maxWidth} bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${visible ? 'translate-x-0' : '-translate-x-full'} pointer-events-auto`
      : `fixed right-0 top-0 h-full w-full ${maxWidth} bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${visible ? 'translate-x-0' : 'translate-x-full'} pointer-events-auto`;

  return (
    <div className={`fixed inset-0 z-[9999] flex pointer-events-none`}>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 transition-opacity duration-300 ${visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={visible ? onClose : undefined}
        aria-label="Close drawer overlay"
      />
      {/* Drawer panel (now supports left/right) */}
      <div
        className={panelSideClasses}
        style={{ willChange: 'transform', zIndex: 10000 }}
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