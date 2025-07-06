import React from "react";
import HeroBanner from "../components/HeroBanner/HeroBanner";
import CategoryCarousel from "../components/CategoryCarousel/CategoryCarousel";
import GoogleReviewWidget from "../components/GoogleReviewWidget/GoogleReviewWidget";
import ContactUs from "../components/ContactUs/ContactUs";
import MeetTheArtists from "../components/MeetTheArtists/MeetTheArtists";
import WhyChooseUs from "../components/WhyChooseUs/WhyChooseUs";
import InstagramFeed from "../components/InstagramFeed/InstagramFeed";
import SEO from "../components/SEO/SEO";

const HomePage = () => {
  return (
    <>
      <SEO 
        title="Ink Atelier - Premium Tattoo & Piercing Studio"
        description="Premium tattoo and piercing studio offering custom designs, traditional styles, and professional body art services. Book your consultation today."
        keywords="tattoo, piercing, body art, custom tattoo, traditional tattoo, tattoo studio, professional tattoo artist, body piercing, tattoo consultation, ink atelier"
        image="/assets/images/logo.jpg"
        url="https://inkatelier.in/"
        type="website"
      />
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