import React from "react";
import { motion } from "framer-motion";

const images = [
  "/assets/images/hero1.jpg",
  "/assets/images/hero2.jpg",
  "/assets/images/hero3.jpg"
];

const HeroBanner = () => {
  const [current, setCurrent] = React.useState(0);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
      <motion.img
        key={images[current]}
        src={images[current]}
        alt="Tattoo Studio Hero"
        className="absolute w-full h-full object-cover z-0 brightness-90"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      />
      <div className="relative z-10 bg-amber-100/90 text-black px-8 py-10 rounded-2xl shadow-xl text-center max-w-xl mx-auto flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2 drop-shadow">Classic Ink, Timeless Art</h1>
        <p className="text-lg md:text-xl mb-6">Step into tradition. Leave with a masterpiece.</p>
        <div className="flex gap-4 justify-center">
          <a href="#contact" className="bg-black text-offwhite px-6 py-2 rounded-full font-bold shadow hover:bg-gray-800 transition">Book Now</a>
          <a href="#categories" className="bg-offwhite border-2 border-black text-black px-6 py-2 rounded-full font-bold shadow hover:bg-gray-100 transition">See Portfolio</a>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner; 