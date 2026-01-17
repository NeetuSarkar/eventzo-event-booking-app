import React, { useEffect, useState } from "react";
import axios from "axios";
import EventCard from "./EventCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useAppContext } from "../../context/AppContext";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const FeaturedEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { selectedCity } = useAppContext();

  useEffect(() => {
    const fetchFeaturedEvents = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5000/api/activities/events/featured?city=${selectedCity}`
        );
        setEvents(res.data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedEvents();
  }, [selectedCity]);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Recommended Events in {selectedCity}
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Discover the best experiences happening around you
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} height={400} className="rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400">
            No featured events found in {selectedCity}. Check back later!
          </p>
        </div>
      ) : (
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            navigation={{
              nextEl: ".swiper-button-next-featured",
              prevEl: ".swiper-button-prev-featured",
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={events.length > 1}
            breakpoints={{
              640: {
                slidesPerView: 1.5,
                spaceBetween: 25,
                pagination: { enabled: false },
              },
              768: {
                slidesPerView: 2.2,
                spaceBetween: 25,
                pagination: { enabled: false },
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
                pagination: { enabled: false },
              },
              1280: {
                slidesPerView: 3.5,
                spaceBetween: 30,
                pagination: { enabled: false },
              },
            }}
            className="px-2 pb-10"
          >
            {events.map((event) => (
              <SwiperSlide key={event._id}>
                <div className="h-full pb-4">
                  <EventCard event={event} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation buttons - hidden on mobile */}
          <div className="hidden sm:block">
            <div className="swiper-button-prev-featured absolute top-1/2 -left-4 z-10 -translate-y-1/2 bg-white/80 text-indigo-600 rounded-full w-10 h-10 flex items-center justify-center hover:bg-white transition-colors shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="swiper-button-next-featured absolute top-1/2 -right-4 z-10 -translate-y-1/2 bg-white/80 text-indigo-600 rounded-full w-10 h-10 flex items-center justify-center hover:bg-white transition-colors shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturedEvents;
