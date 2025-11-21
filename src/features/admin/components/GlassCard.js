import React from 'react';

/**
 * GlassCard - A reusable glassmorphism card for analytics/metrics
 * Props: className, children
 */
const GlassCard = ({ className = '', children }) => {
  return (
    <div
      className={`backdrop-blur-lg bg-white/10 border border-white/20 shadow-xl rounded-2xl p-4 sm:p-6 md:p-8 transition hover:scale-[1.02] hover:shadow-2xl ${className}`}
      style={{ boxShadow: '0 4px 32px rgba(0,0,0,0.25)' }}
    >
      {children}
    </div>
  );
};

export default GlassCard;
