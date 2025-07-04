import React from "react";
import { motion } from "framer-motion";

const usps = [
  { icon: "🧼", title: "Hygiene First", desc: "Sterile equipment & top safety standards." },
  { icon: "🎨", title: "Custom Designs", desc: "Every tattoo is unique and personal." },
  { icon: "🏆", title: "Expert Artists", desc: "Years of experience in classic & modern styles." },
  { icon: "🤝", title: "Friendly Vibe", desc: "Welcoming, judgment-free environment." },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.13, duration: 0.7, ease: "easeOut" },
  }),
};

const WhyChooseUs = () => (
  <motion.section
    className="bg-white text-black py-20 px-2 text-center relative overflow-hidden"
  >
    <h2 className="text-4xl font-serif font-extrabold mb-3 text-black drop-shadow tracking-wide">Why Choose Us?</h2>
    <div className="text-lg md:text-xl mb-10 text-gray-700 font-light">We blend tradition, artistry, and comfort to create a unique tattoo experience.</div>
    <div className="flex flex-wrap gap-8 justify-center max-w-6xl mx-auto">
      {usps.map((usp, i) => (
        <motion.div
          className={`rounded-2xl border-2 shadow-xl min-w-[200px] max-w-xs flex flex-col items-center p-8 hover:scale-105 hover:shadow-2xl transition bg-offwhite border-black group`}
          key={usp.title}
          custom={i}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={cardVariants}
        >
          <span className="text-4xl mb-3 drop-shadow text-black group-hover:scale-125 transition-transform">{usp.icon}</span>
          <h3 className="text-lg font-serif font-bold mb-2 text-black group-hover:text-amber-700 transition">{usp.title}</h3>
          <p className="text-base text-black opacity-80">{usp.desc}</p>
        </motion.div>
      ))}
    </div>
    {/* Wavy SVG Divider */}
    <div className="absolute left-0 right-0 bottom-[-1px] w-full overflow-hidden leading-none pointer-events-none select-none">
      <svg viewBox="0 0 1440 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M0 32C240 64 480 0 720 32C960 64 1200 0 1440 32V64H0V32Z" fill="#f7f5f2" />
      </svg>
    </div>
  </motion.section>
);

export default WhyChooseUs; 