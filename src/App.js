import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import HeroBanner from "./components/HeroBanner/HeroBanner";
import CategoryCarousel from "./components/CategoryCarousel/CategoryCarousel";
import GoogleReviewWidget from "./components/GoogleReviewWidget/GoogleReviewWidget";
import ContactUs from "./components/ContactUs/ContactUs";
import MeetTheArtists from "./components/MeetTheArtists/MeetTheArtists";
import WhyChooseUs from "./components/WhyChooseUs/WhyChooseUs";
import InstagramFeed from "./components/InstagramFeed/InstagramFeed";
import Footer from "./components/Footer/Footer";
import CategoryPage from "./pages/CategoryPage/CategoryPage";

function App() {
  return (
    <div className="bg-offwhite bg-texture min-h-screen text-black">
      <Router>
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <HeroBanner />
                <CategoryCarousel />
                <WhyChooseUs />
                <GoogleReviewWidget />
                <MeetTheArtists />
                <InstagramFeed />
                <ContactUs />
              </>
            }
          />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
