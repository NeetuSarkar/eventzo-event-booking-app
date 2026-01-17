import React, { useEffect, useState } from "react";
import axios from "axios";
import EventCard from "./EventCard";
import { useAppContext } from "../../context/AppContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { selectedCity } = useAppContext();

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5000/api/activities/events/upcoming?city=${selectedCity}&limit=6`
        );
        setEvents(res.data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching upcoming events:", err);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, [selectedCity]);

  return (
    <div className="bg-gradient-to-r from-blue-800 to-blue-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Upcoming Events in {selectedCity}
          </h2>
          <p className="mt-2 text-blue-100">
            Discover what's happening soon in your city
          </p>
        </div>

        {loading ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <Skeleton key={index} height={350} className="rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10 bg-white/10 rounded-lg">
            <p className="text-red-300">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-white text-blue-800 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-10 bg-white/10 rounded-lg">
            <p className="text-blue-100">
              No upcoming events found in {selectedCity}. Check back later!
            </p>
          </div>
        ) : (
          <>
            <Swiper
              modules={[Navigation]}
              spaceBetween={30}
              slidesPerView={1}
              navigation={{
                nextEl: ".swiper-button-next-upcoming",
                prevEl: ".swiper-button-prev-upcoming",
              }}
              breakpoints={{
                640: { slidesPerView: 1.5 },
                768: { slidesPerView: 2.2 },
                1024: { slidesPerView: 3.2 },
              }}
              className="pb-12"
            >
              {events.slice(0, 6).map((event) => (
                <SwiperSlide key={event._id}>
                  <EventCard event={event} />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Buttons */}
            <div className="swiper-button-prev-upcoming absolute top-1/2 -left-4 z-10 -translate-y-1/2 bg-white/80 text-blue-800 rounded-full w-10 h-10 flex items-center justify-center hover:bg-white transition-colors shadow-lg">
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
            <div className="swiper-button-next-upcoming absolute top-1/2 -right-4 z-10 -translate-y-1/2 bg-white/80 text-blue-800 rounded-full w-10 h-10 flex items-center justify-center hover:bg-white transition-colors shadow-lg">
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
          </>
        )}

        {events.length > 0 && (
          <div className="mt-10 text-center">
            <a
              href="/events"
              className="inline-block px-6 py-3 bg-white text-blue-800 font-medium rounded-lg hover:bg-blue-50 transition-colors"
            >
              View All Events
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingEvents;
