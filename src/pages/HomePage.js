import React from "react";
import HeroBanner from "../components/HeroBanner/HeroBanner";
import CategoryCarousel from "../components/CategoryCarousel/CategoryCarousel";
import GoogleReviewWidget from "../components/GoogleReviewWidget/GoogleReviewWidget";
import ContactUs from "../components/ContactUs/ContactUs";
import MeetTheArtists from "../components/MeetTheArtists/MeetTheArtists";
import WhyChooseUs from "../components/WhyChooseUs/WhyChooseUs";
import InstagramFeed from "../components/InstagramFeed/InstagramFeed";

const HomePage = () => {
  return (
    <>
      <HeroBanner />
      <CategoryCarousel />
      <WhyChooseUs />
      <GoogleReviewWidget />
      <MeetTheArtists />
      <InstagramFeed />
      <ContactUs />
    </>
  );
};

export default HomePage; 