import React from "react";
import HeroBanner from '../common/ui/HeroBanner/HeroBanner';
import CategoryCarousel from '../common/ui/CategoryCarousel/CategoryCarousel';
import GoogleReviewWidget from '../common/ui/GoogleReviewWidget/GoogleReviewWidget';
import ContactUs from '../common/ui/ContactUs/ContactUs';
import MeetTheArtists from '../common/ui/MeetTheArtists/MeetTheArtists';
import WhyChooseUs from '../common/ui/WhyChooseUs/WhyChooseUs';
import InstagramFeed from '../common/ui/InstagramFeed/InstagramFeed';
import SEO from '../common/ui/SEO';

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