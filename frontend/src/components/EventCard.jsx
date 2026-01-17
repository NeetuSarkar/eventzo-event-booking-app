import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaMusic,
  FaTicketAlt,
  FaLanguage,
} from "react-icons/fa";

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  const {
    _id,
    title,
    image,
    date,
    time,
    location,
    artists = [],
    ticketPrice,
    category,
    language,
    availableSeats,
  } = event;

  const formattedDate = new Date(date).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  const handleClick = () => {
    navigate(`/events/${_id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-95 group h-full flex flex-col"
    >
      {/* Image section with fixed aspect ratio */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src="/event.jpg"
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/event-placeholder.jpg";
          }}
        />
        {availableSeats < 20 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Selling Fast!
          </div>
        )}
      </div>

      {/* Content section with consistent height */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Title with minimum height */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[3rem]">
          {title}
        </h3>

        {/* Location */}
        <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
          <FaMapMarkerAlt className="mr-2 text-indigo-500 flex-shrink-0" />
          <span className="text-sm line-clamp-1">{location}</span>
        </div>

        {/* Date and Time */}
        <div className="flex justify-between mb-4">
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <FaCalendarAlt className="mr-2 text-indigo-500 flex-shrink-0" />
            <span className="text-sm">{formattedDate}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <FaClock className="mr-2 text-indigo-500 flex-shrink-0" />
            <span className="text-sm">{time}</span>
          </div>
        </div>

        {/* Artists section with consistent spacing */}
        <div
          className={`${
            artists.length > 0 ? "mb-3" : "mb-auto min-h-[1.5rem]"
          }`}
        >
          {artists.length > 0 && (
            <div className="flex items-center text-gray-800 dark:text-gray-200">
              <FaMusic className="mr-2 text-indigo-500 flex-shrink-0" />
              <span className="text-sm line-clamp-1">{artists.join(", ")}</span>
            </div>
          )}
        </div>

        {/* Bottom section - always aligned to bottom */}
        <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <FaTicketAlt className="mr-2 text-indigo-500 flex-shrink-0" />
            <span className="font-bold text-indigo-600 dark:text-indigo-400">
              ₹{ticketPrice}
            </span>
          </div>
          <div className="flex items-center">
            <FaLanguage className="mr-2 text-indigo-500 flex-shrink-0" />
            <span className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">
              {language}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
