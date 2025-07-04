import React from "react";
import { Swiper } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

const defaultBreakpoints = {
  640: { slidesPerView: 2 },
  1024: { slidesPerView: 3 },
};

const SwiperCarousel = ({ children, slidesPerView = 1, spaceBetween = 20, pagination = true, breakpoints = defaultBreakpoints, className = "", ...props }) => {
  return (
    <Swiper
      slidesPerView={slidesPerView}
      spaceBetween={spaceBetween}
      pagination={pagination ? { clickable: true } : false}
      breakpoints={breakpoints}
      modules={[Pagination]}
      className={className}
      {...props}
    >
      {children}
    </Swiper>
  );
};

export default SwiperCarousel; 