import React from "react";
import { motion } from "framer-motion";

const usps = [
  { icon: "🧼", title: "Hygiene First", desc: "Sterile equipment & top safety standards." },
  { icon: "🎨", title: "Custom Designs", desc: "Every tattoo is unique and personal." },
  { icon: "🏆", title: "Expert Artists", desc: "Years of experience in classic & modern styles." },
  { icon: "🤝", title: "Friendly Vibe", desc: "Welcoming, judgment-free environment." },
];

const WhyChooseUs = () => (
  <section className="bg-offwhite text-black py-12 px-2 text-center">
    <h2 className="text-3xl font-serif font-bold mb-8 text-black drop-shadow">Why Choose Us?</h2>
    <div className="flex flex-wrap gap-6 justify-center">
      {usps.map((usp, i) => (
        <motion.div
          className={`rounded-xl border-2 shadow-lg min-w-[180px] max-w-xs flex flex-col items-center p-6 hover:scale-105 transition ${i === 0 ? 'bg-amber-100 border-amber-200' : 'bg-offwhite border-black'}`}
          key={usp.title}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15 }}
          viewport={{ once: true }}
        >
          <span className="text-3xl mb-2 drop-shadow text-black">{usp.icon}</span>
          <h3 className="text-lg font-serif font-semibold mb-1 text-black">{usp.title}</h3>
          <p className="text-base text-black">{usp.desc}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

export default WhyChooseUs; 