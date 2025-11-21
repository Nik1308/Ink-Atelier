import React, { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const GlassModal = ({ open, onClose, children, className = '' }) => {
  useEffect(() => {
    if (!open) return;
    function esc(e) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', esc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', esc);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ backdropFilter: 'blur(5px)' }}>
      <div
        className="absolute inset-0 bg-black/40 cursor-pointer"
        onClick={onClose}
        aria-label="Close modal overlay"
      />
      <div className={`relative bg-gradient-to-br from-slate-900/90 to-black/90 border border-white/10 rounded-2xl shadow-2xl p-8 w-full max-w-lg animate-fadeIn backdrop-blur-xl ${className}`}
        style={{ minWidth: 320, maxWidth: 440 }}
        onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-3xl text-white/70 hover:text-white font-bold p-0.5 px-1 bg-black/20 rounded"
          aria-label="Close"
        ><FiX /></button>
        {children}
      </div>
    </div>
  );
};

export default GlassModal;
