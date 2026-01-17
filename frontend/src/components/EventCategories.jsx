import React from "react";
import { useNavigate } from "react-router-dom";

const EventCategories = () => {
  const navigate = useNavigate();
  const eventCategories = [
    { name: "Comedy Shows", url: "/images/events/comedyShow.jpg" },
    { name: "Amusement Park", url: "/images/events/amusement Park.jpg" },
    { name: "Theater Shows", url: "/images/events/theater show.jpg" },
    { name: "Adventures And Fun", url: "/images/events/adventure.jpg" },
    { name: "Music Shows", url: "/images/events/music show.webp" },
    { name: "Art And Craft", url: "/images/events/art and craft.jpg" },
    { name: "Upskills And Training", url: "/images/events/training.jpg" },
    { name: "Workshops", url: "/images/events/workshops.jpg" },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          Browse Events By Category
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Discover amazing experiences in your city
        </p>
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
        {eventCategories.map((category, index) => (
          <div
            key={index}
            className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="aspect-w-3 aspect-h-2 w-full">
              <img
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                src={category.url}
                alt={category.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://source.unsplash.com/random/400x300/?event," +
                    category.name.split(" ").join(",");
                }}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex items-end p-5">
              <h3 className="text-white text-xl font-semibold">
                {category.name}
              </h3>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                className="px-6 py-2 bg-white text-gray-900 font-medium rounded-full shadow-md hover:bg-gray-100 transition-colors"
                onClick={() => {
                  navigate(
                    `/events?category=${encodeURIComponent(category.name)}`
                  );
                }}
              >
                Explore
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Carousel */}
      <div className="md:hidden relative">
        <div className="flex space-x-4 pb-4 overflow-x-auto scrollbar-hide px-2">
          {eventCategories.map((category, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-64 h-72 relative rounded-xl overflow-hidden shadow-md"
            >
              <img
                className="w-full h-full object-cover"
                src={category.url}
                alt={category.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://source.unsplash.com/random/400x300/?event," +
                    category.name.split(" ").join(",");
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex items-end p-4">
                <h3 className="text-white text-lg font-semibold">
                  {category.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-white to-transparent"></div>
        <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-white to-transparent"></div>
      </div>
    </div>
  );
};

export default EventCategories;
