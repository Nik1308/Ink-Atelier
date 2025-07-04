import React from "react";
import { useNavigate } from "react-router-dom";
import { categories } from "../../data/dummyData";
import { motion } from "framer-motion";

const CategoryCarousel = () => {
  const navigate = useNavigate();
  return (
    <motion.section
      className="py-20 bg-[#f7f5f2] text-black text-center relative overflow-hidden"
      id="categories"
    >
      <h2 className="text-4xl font-serif font-extrabold mb-3 tracking-wide drop-shadow">Tattoo Styles</h2>
      <div className="text-lg md:text-xl mb-10 text-gray-700 font-light">Explore our diverse range of tattoo styles, each crafted with passion and precision.</div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4 max-w-6xl mx-auto">
        {categories.map((cat, idx) => (
          <motion.div
            className="bg-offwhite rounded-2xl border-2 border-black shadow-xl cursor-pointer flex flex-col items-center hover:scale-[1.04] hover:shadow-2xl transition h-full group"
            key={cat.id}
            onClick={() => navigate(`/category/${cat.id}`)}
            style={{ minWidth: 0 }}
            custom={idx}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <img
              src={cat.image || "/assets/images/placeholder.jpg"}
              alt={cat.name}
              className="w-full h-44 object-cover rounded-t-2xl border-b-2 border-black group-hover:brightness-95 transition"
            />
            <div className="p-5 flex-1 flex flex-col justify-between w-full">
              <h3 className="text-2xl font-serif font-bold mb-2 text-black group-hover:text-amber-700 transition">{cat.name}</h3>
              <p className="text-base text-black opacity-80">{cat.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
      {/* Wavy SVG Divider */}
      <div className="absolute left-0 right-0 bottom-[-1px] w-full overflow-hidden leading-none pointer-events-none select-none">
        <svg viewBox="0 0 1440 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M0 32C240 64 480 0 720 32C960 64 1200 0 1440 32V64H0V32Z" fill="#fff" />
        </svg>
      </div>
    </motion.section>
  );
};

export default CategoryCarousel; 