import React, { useState } from "react";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: "easeOut" },
  }),
};

const ContactUs = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "", whatsapp: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <motion.section
      className="bg-white text-black py-20 px-2 text-center relative overflow-hidden"
      id="contact"
    >
      <h2 className="text-4xl font-serif font-extrabold mb-3 text-black drop-shadow tracking-wide">Contact Us</h2>
      <div className="text-lg md:text-xl mb-10 text-gray-700 font-light">Ready to book or have a question? Reach out and we'll get back to you soon.</div>
      <div className="flex flex-wrap gap-10 justify-center items-start max-w-5xl mx-auto mb-8">
        <motion.form
          className="bg-offwhite rounded-2xl border-2 border-black shadow-xl p-10 min-w-[300px] max-w-xs flex flex-col gap-4 mx-auto"
          onSubmit={handleSubmit}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={cardVariants}
          custom={0}
        >
          <input name="name" type="text" placeholder="Your Name" value={form.name} onChange={handleChange} required className="bg-offwhite text-black border border-gray-400 rounded px-3 py-2 focus:outline-none focus:border-black" />
          <input name="email" type="email" placeholder="Your Email" value={form.email} onChange={handleChange} required className="bg-offwhite text-black border border-gray-400 rounded px-3 py-2 focus:outline-none focus:border-black" />
          <input name="whatsapp" type="text" placeholder="WhatsApp (optional)" value={form.whatsapp} onChange={handleChange} className="bg-offwhite text-black border border-gray-400 rounded px-3 py-2 focus:outline-none focus:border-black" />
          <textarea name="message" placeholder="Your Message" value={form.message} onChange={handleChange} required className="bg-offwhite text-black border border-gray-400 rounded px-3 py-2 min-h-[80px] focus:outline-none focus:border-black" />
          <motion.button
            type="submit"
            className="bg-black text-offwhite rounded-full px-6 py-2 font-bold shadow hover:bg-gray-800 transition"
            whileTap={{ scale: 0.95 }}
            animate={submitted ? { backgroundColor: "#25d366", color: "#181818" } : {}}
            transition={{ duration: 0.3 }}
            disabled={submitted}
          >
            {submitted ? "Sent!" : "Send Message"}
          </motion.button>
        </motion.form>
        <motion.div
          className="bg-gray-400 rounded-2xl border-2 border-gray-500 shadow-xl p-10 min-w-[260px] max-w-xs flex flex-col gap-6 mx-auto items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={cardVariants}
          custom={1}
        >
          <div>
            <h3 className="text-lg font-bold text-black mb-1">Studio Address</h3>
            <p className="mb-2">123 Classic Lane<br />Old Town, City 12345</p>
            <h4 className="font-semibold text-black mb-1">Opening Hours</h4>
            <p>Mon-Sat: 11am - 8pm<br />Sun: Closed</p>
          </div>
          <div className="bg-pink-300 rounded-lg px-4 py-3 text-black flex flex-col items-center">
            <span role="img" aria-label="map" className="text-2xl mb-1">🗺️</span>
            <p className="text-sm">Map Coming Soon</p>
          </div>
        </motion.div>
      </div>
      {/* Wavy SVG Divider */}
      <div className="absolute left-0 right-0 bottom-[-1px] w-full overflow-hidden leading-none pointer-events-none select-none">
        <svg viewBox="0 0 1440 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M0 32C240 64 480 0 720 32C960 64 1200 0 1440 32V64H0V32Z" fill="#181818" />
        </svg>
      </div>
    </motion.section>
  );
};

export default ContactUs; 