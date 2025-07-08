import React from "react";
import { motion } from "framer-motion";
import SwiperCarousel from '../SwiperCarousel';
import { SwiperSlide } from "swiper/react";
import "swiper/css/effect-fade";
import { EffectFade, Autoplay, Pagination } from "swiper/modules";
import OverlayPositioner from '../OverlayPositioner';

const images = [
  "/assets/images/hero1.jpg",
  "/assets/images/hero2.jpg",
  "/assets/images/hero3.jpg"
];

const HeroBanner = () => {
  return (
    <section className="relative w-full h-[75vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-gradient-to-b from-offwhite to-[#f7f5f2]">
      <SwiperCarousel
        slidesPerView={1}
        effect="fade"
        modules={[EffectFade, Autoplay, Pagination]}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        loop
        breakpoints={{}}
        allowTouchMove={true}
        pagination={{ clickable: true }}
        className="w-full h-full hero-swiper"
      >
        {images.map((img, idx) => (
          <SwiperSlide key={img}>
            <motion.img
              src={img}
              alt={`Tattoo Studio Hero ${idx + 1}`}
              className="w-full h-full object-cover brightness-90"
              initial={{ scale: 1.08, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </SwiperSlide>
        ))}
      </SwiperCarousel>
      <OverlayPositioner position="center">
        <div className="bg-white text-black px-10 py-12 rounded-3xl shadow-2xl border border-black text-center max-w-2xl mx-auto flex flex-col items-center pointer-events-auto backdrop-blur-sm">
          <h1 className="text-5xl md:text-6xl font-serif font-extrabold mb-3 drop-shadow tracking-tight">Classic Ink, Timeless Art</h1>
          <div className="text-lg md:text-xl mb-4 font-light text-amber-900">Step into tradition. Leave with a masterpiece.</div>
          <div className="text-base md:text-lg mb-8 text-gray-700">A boho-classic tattoo studio blending timeless artistry with modern comfort.</div>
          <div className="flex gap-4 justify-center">
            <motion.a
              href="#contact"
              className="bg-black text-offwhite px-7 py-3 rounded-full font-bold shadow hover:bg-gray-800 transition pointer-events-auto text-lg"
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.04 }}
            >
              Book Now
            </motion.a>
            <motion.a
              href="#categories"
              className="bg-offwhite border-2 border-black text-black px-7 py-3 rounded-full font-bold shadow hover:bg-gray-100 transition pointer-events-auto text-lg"
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.04 }}
            >
              See Portfolio
            </motion.a>
          </div>
        </div>
      </OverlayPositioner>
      {/* Wavy SVG Divider */}
      <div className="absolute left-0 right-0 bottom-[-1px] w-full overflow-hidden leading-none pointer-events-none select-none">
        <svg viewBox="0 0 1440 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M0 32C240 64 480 0 720 32C960 64 1200 0 1440 32V64H0V32Z" fill="#f7f5f2" />
        </svg>
      </div>
    </section>
  );
};

export default HeroBanner; 