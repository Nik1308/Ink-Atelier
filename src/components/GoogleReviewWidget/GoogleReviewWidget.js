import React from "react";
import { reviews } from "../../data/dummyData";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const starVariants = {
  hidden: { opacity: 0, scale: 0.7 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: 0.2 + i * 0.08, duration: 0.3, ease: "easeOut" },
  }),
};

const GoogleReviewWidget = () => {
  return (
    <motion.section
      className="py-20 px-4 flex flex-col items-center bg-[#f7f5f2] relative overflow-hidden"
    >
      <h2 className="text-4xl font-serif font-extrabold mb-3 text-black drop-shadow tracking-wide">Google Reviews</h2>
      <div className="text-lg md:text-xl mb-10 text-gray-700 font-light">See what our happy clients have to say about their experience at Ink Atelier.</div>
      <Swiper
        slidesPerView={1}
        spaceBetween={32}
        pagination={{ clickable: true }}
        modules={[Pagination, Autoplay]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop
        className="max-w-2xl w-full"
      >
        {reviews.map((review, idx) => (
          <SwiperSlide key={review.id}>
            <motion.div
              className="bg-offwhite text-black border-2 border-black rounded-3xl shadow-2xl p-12 min-w-[320px] max-w-2xl w-full min-h-[220px] md:min-h-[260px] font-serif animate-fadeIn flex flex-col items-center justify-center hover:shadow-amber-200 transition-shadow"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={cardVariants}
            >
              <div className="flex text-yellow-400 text-2xl mb-4">
                {[...Array(5)].map((_, i) => (
                  <motion.span
                    key={i}
                    className={i < review.rating ? "animate-pulse" : "opacity-40"}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={starVariants}
                  >
                    ★
                  </motion.span>
                ))}
              </div>
              <div className="italic mb-3 text-black text-xl text-center font-serif font-medium">"{review.text}"</div>
              <div className="text-gray-500 mb-2 text-lg">- {review.name}</div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
      <motion.a
        href="https://www.google.com/search?q=ink+atelier+tattoo+studio+reviews"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-10 inline-block bg-pink-300 text-black px-8 py-3 rounded-full font-bold text-xl shadow hover:bg-pink-400 transition"
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.04 }}
      >
        See More Reviews
      </motion.a>
      {/* Wavy SVG Divider */}
      <div className="absolute left-0 right-0 bottom-[-1px] w-full overflow-hidden leading-none pointer-events-none select-none">
        <svg viewBox="0 0 1440 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M0 32C240 64 480 0 720 32C960 64 1200 0 1440 32V64H0V32Z" fill="#fff" />
        </svg>
      </div>
    </motion.section>
  );
};

export default GoogleReviewWidget; 