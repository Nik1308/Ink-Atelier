import React from "react";
import { useParams } from "react-router-dom";
import { categories } from "../../data/dummyData";

const CategoryPage = () => {
  const { categoryId } = useParams();
  const category = categories.find((cat) => cat.id === categoryId);

  if (!category) return <div className="bg-orange-50 min-h-[80vh] flex items-center justify-center"><h2 className="text-2xl font-serif text-amber-900">Category Not Found</h2></div>;

  return (
    <div className="bg-orange-50 text-amber-900 min-h-[80vh] py-10 px-2 text-center">
      <h2 className="text-3xl font-serif font-bold mb-4 text-amber-800 drop-shadow">{category.name}</h2>
      <img src={category.image} alt={category.name} className="w-full max-w-xl h-64 object-cover rounded-2xl border-2 border-amber-300 mx-auto mb-6 shadow-lg" />
      <p className="text-lg mb-8 text-amber-700">{category.description}</p>
      <div className="flex flex-wrap gap-4 justify-center">
        {[1,2,3,4].map((i) => (
          <img
            key={i}
            src={`/assets/images/${category.id}-gallery${i}.jpg`}
            alt={`${category.name} tattoo ${i}`}
            className="w-44 h-44 object-cover rounded-xl border-2 border-amber-200 shadow bg-white"
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage; 