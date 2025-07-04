import React from "react";
import SwiperCarousel from "../common/SwiperCarousel";
import { SwiperSlide } from "swiper/react";
import Fetch from "../../utils/Fetch";
import { INSTAGRAM_API_URL } from "../../utils/apiUrls";
import { motion } from "framer-motion";

const filterPosts = (data) => {
  if (!data || !data.data) return [];
  return data.data.filter(post => post.media_type === "IMAGE" || post.media_type === "CAROUSEL_ALBUM");
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: "easeOut" },
  }),
};

const InstagramFeed = () => (
  <motion.section
    className="bg-[#f7f5f2] text-black py-20 px-2 text-center relative overflow-hidden"
  >
    <motion.h2
      className="text-4xl font-serif font-extrabold mb-3 text-black drop-shadow tracking-wide"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.7 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      Instagram Feed
    </motion.h2>
    <div className="text-lg md:text-xl mb-10 text-gray-700 font-light">Follow us for the latest ink, inspiration, and studio moments.</div>
    <Fetch url={INSTAGRAM_API_URL}>
      {({ data, loading, error }) => {
        if (loading) return <div className="text-gray-400">Loading latest posts...</div>;
        if (error) return <div className="text-gray-400">No posts found or API not configured.</div>;
        const posts = filterPosts(data);
        if (!posts.length) return <div className="text-gray-400">No posts found or API not configured.</div>;
        return (
          <SwiperCarousel
            slidesPerView={1}
            spaceBetween={20}
            className="max-w-4xl mx-auto"
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {posts.map((post, idx) => (
              <SwiperSlide key={post.id}>
                <motion.a
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-offwhite rounded-2xl border-2 border-black shadow-lg w-72 flex flex-col items-center p-3 hover:scale-105 hover:shadow-2xl transition"
                  custom={idx}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={cardVariants}
                >
                  <img src={post.media_url || post.thumbnail_url} alt={post.caption || "Instagram post"} className="w-full h-60 object-cover rounded-lg border-2 border-gray-200 mb-2 bg-white" />
                  <div className="text-sm text-black mt-1 line-clamp-2">{post.caption}</div>
                </motion.a>
              </SwiperSlide>
            ))}
          </SwiperCarousel>
        );
      }}
    </Fetch>
    {/* Wavy SVG Divider */}
    <div className="absolute left-0 right-0 bottom-[-1px] w-full overflow-hidden leading-none pointer-events-none select-none">
      <svg viewBox="0 0 1440 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M0 32C240 64 480 0 720 32C960 64 1200 0 1440 32V64H0V32Z" fill="#fff" />
      </svg>
    </div>
  </motion.section>
);

export default InstagramFeed; 