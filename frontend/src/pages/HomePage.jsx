import React from "react";
import { useAppContext } from "../../context/AppContext"; // Fix this import path
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Hero from "../components/Hero";
import FeaturedEvents from "../components/FeaturedEvents";
import UpcomingEvents from "../components/UpcomingEvents";
import NewslettersSignup from "../components/NewslettersSignup";
import Footer from "../components/Footer";
import CitySelectorModal from "../components/CitySelectorModal";
import EventCategories from "../components/EventCategories";

const HomePage = () => {
  const { selectedCity, setSelectedCity, appLoading } = useAppContext();
  const { authLoading } = useContext(AuthContext);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
  };

  if (appLoading || authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {!selectedCity && (
        <CitySelectorModal onClose={() => {}} onSelect={handleCitySelect} />
      )}
      <Hero />
      <FeaturedEvents />
      <UpcomingEvents />
      <EventCategories />
      <NewslettersSignup />
      <Footer />
    </div>
  );
};

export default HomePage;
