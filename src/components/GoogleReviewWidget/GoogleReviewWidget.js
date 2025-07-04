import React from "react";
import { reviews } from "../../data/dummyData";

const GoogleReviewWidget = () => {
  const [current, setCurrent] = React.useState(0);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const review = reviews[current];

  return (
    <div className="fixed bottom-8 right-8 bg-offwhite text-black border-2 border-black rounded-2xl shadow-2xl p-5 min-w-[260px] z-50 font-serif animate-fadeIn">
      <div className="flex text-yellow-400 text-lg mb-1">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < review.rating ? "animate-pulse" : "opacity-40"}>★</span>
        ))}
      </div>
      <div className="italic mb-1 text-black">"{review.text}"</div>
      <div className="text-gray-500 mb-2 text-sm">- {review.name}</div>
      <a
        href="https://www.google.com/search?q=ink+atelier+tattoo+studio+reviews"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-pink-300 text-black px-4 py-1 rounded-full font-bold text-sm shadow hover:bg-pink-400 transition"
      >
        See More Reviews
      </a>
    </div>
  );
};

export default GoogleReviewWidget; 