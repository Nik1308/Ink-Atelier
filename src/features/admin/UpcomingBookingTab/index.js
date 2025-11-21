import React from 'react';
import GlassCard from '../components/GlassCard';

const BookingsTab = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh]">
    <GlassCard className="w-full max-w-xl mx-auto min-h-[220px] flex items-center justify-center bg-white/10 border-white/20">
      <span className="text-2xl md:text-3xl font-semibold text-white/80">Bookings <span className="font-thin">— Coming Soon...</span></span>
    </GlassCard>
  </div>
);

export default BookingsTab; 