import React from "react";
import Spotlight from "./ui/SpotLight";
import { motion } from "framer-motion"; // For animations
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section
      className="relative h-[90vh] flex items-center justify-center text-white bg-cover bg-center"
      style={{ backgroundImage: "url(/hero-bg.jpg)" }}
    >
      <Spotlight />
      <div className="bg-black bg-opacity-60 absolute inset-0" />{" "}
      {/* Slightly more opacity for contrast */}
      <div className="relative z-10 max-w-3xl text-center space-y-6 px-4">
        <motion.h1
          className="text-4xl md:text-6xl font-bold"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Discover & Book Local Events
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          Concerts, meetups, and more — all in one place
        </motion.p>

        {/* Optional additional section like a tagline or testimonial */}
        <motion.div
          className="text-sm  text-gray-300 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <p>"Your go-to platform for discovering events near you!"</p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-2 justify-center mt-4">
          <motion.button
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded text-white text-lg"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
            onClick={() => navigate("/events")}
          >
            Browse Events
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
