import React from "react";
import { artists } from '../../../../data/dummyData';
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: "easeOut" },
  }),
};

const MeetTheArtists = () => (
  <motion.section
    className="bg-white text-black py-20 px-2 text-center relative overflow-hidden"
  >
    <h2 className="text-4xl font-serif font-extrabold mb-3 text-black drop-shadow tracking-wide">Meet the Artists</h2>
    <div className="text-lg md:text-xl mb-10 text-gray-700 font-light">Our talented artists bring your vision to life with skill and passion.</div>
    <div className="flex gap-8 overflow-x-auto px-4 pb-2 justify-center max-w-6xl mx-auto">
      {artists.map((artist, idx) => (
        <motion.div
          className={`rounded-2xl border-2 shadow-xl min-w-[260px] max-w-xs flex flex-col items-center p-8 hover:scale-105 hover:shadow-2xl transition bg-offwhite border-black group`}
          key={artist.id}
          custom={idx}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={cardVariants}
        >
          <img src={artist.image} alt={artist.name} className={`w-28 h-28 object-cover rounded-full border-2 mb-4 bg-white border-black`} />
          <div className="flex flex-col items-center">
            <h3 className="text-2xl font-serif font-bold mb-2 text-black group-hover:text-amber-700 transition">{artist.name}</h3>
            <p className="text-base mb-3 text-black opacity-80">{artist.bio}</p>
            <a href={artist.instagram} target="_blank" rel="noopener noreferrer" className={`bg-black text-offwhite px-5 py-2 rounded-full font-bold text-base shadow hover:bg-gray-800 transition`}>Instagram</a>
          </div>
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

export default MeetTheArtists; 