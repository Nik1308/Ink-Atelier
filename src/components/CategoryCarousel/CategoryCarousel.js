import React from "react";
import { useNavigate } from "react-router-dom";
import { categories } from "../../data/dummyData";

const CategoryCarousel = () => {
  const navigate = useNavigate();
  return (
    <section className="py-10 bg-offwhite text-black text-center" id="categories">
      <h2 className="text-3xl font-serif font-bold mb-6 tracking-wide drop-shadow">Tattoo Styles</h2>
      <div className="flex gap-6 overflow-x-auto px-4 pb-2 scroll-smooth">
        {categories.map((cat, idx) => (
          <div
            className={
              `min-w-[260px] bg-offwhite rounded-xl border-2 shadow-lg cursor-pointer flex flex-col items-center hover:scale-105 transition ` +
              (idx === 1 ? 'border-pink-300' : idx === 2 ? 'bg-gray-400 border-gray-500' : idx === 3 ? 'bg-black border-black text-offwhite' : 'border-black')
            }
            key={cat.id}
            onClick={() => navigate(`/category/${cat.id}`)}
          >
            <img src={cat.image} alt={cat.name} className={`w-full h-44 object-cover rounded-t-xl border-b-2 ${idx === 3 ? 'border-black' : 'border-gray-200'}`} />
            <div className="p-4">
              <h3 className={`text-xl font-serif font-semibold mb-2 ${idx === 3 ? 'text-offwhite' : 'text-black'}`}>{cat.name}</h3>
              <p className={`text-base ${idx === 3 ? 'text-gray-200' : 'text-black'}`}>{cat.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryCarousel; 