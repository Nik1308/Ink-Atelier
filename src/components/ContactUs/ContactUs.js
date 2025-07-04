import React, { useState } from "react";
import { motion } from "framer-motion";

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
    <section className="bg-offwhite text-black py-12 px-2 text-center" id="contact">
      <h2 className="text-3xl font-serif font-bold mb-8 text-black drop-shadow">Contact Us</h2>
      <div className="flex flex-wrap gap-8 justify-center items-start">
        <form className="bg-offwhite rounded-2xl border-2 border-black shadow-lg p-8 min-w-[300px] max-w-xs flex flex-col gap-4 mx-auto" onSubmit={handleSubmit}>
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
        </form>
        <div className="bg-gray-400 rounded-2xl border-2 border-gray-500 shadow-lg p-8 min-w-[260px] max-w-xs flex flex-col gap-6 mx-auto items-center">
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
        </div>
      </div>
    </section>
  );
};

export default ContactUs; 