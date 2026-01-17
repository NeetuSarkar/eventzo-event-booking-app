import React from "react";
import { FaFilter, FaCalendarAlt, FaRupeeSign, FaSort } from "react-icons/fa";

const FilterSidebar = ({ filters, setFilters, currentCategory }) => {
  const categories = [
    "Comedy Shows",
    "Amusement Park",
    "Theater Shows",
    "Adventures And Fun",
    "Music Shows",
    "Art And Craft",
    "Upskills And Training",
    "Workshops",
  ];

  const handleCategorySelect = (cat) => {
    // If clicking the already selected category, deselect it
    const newCategory = currentCategory === cat ? "" : cat;
    setFilters({ ...filters, category: newCategory });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm sticky top-4">
      <h3 className="font-bold mb-4 flex items-center">
        <FaFilter className="mr-2" /> Filters
      </h3>

      {/* Category Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold mb-2">Categories</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`block w-full text-left px-2 py-1 rounded ${
                currentCategory === cat
                  ? "bg-indigo-100 text-indigo-700"
                  : "hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Date Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold mb-2 flex items-center">
          <FaCalendarAlt className="mr-2" /> Date
        </h4>
        <select
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          className="w-full p-2 border rounded"
        >
          <option value="">All Dates</option>
          <option value="today">Today</option>
          <option value="tomorrow">Tomorrow</option>
          <option value="this-weekend">This Weekend</option>
          <option value="next-week">Next Week</option>
        </select>
      </div>

      {/* Price Range Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold mb-2 flex items-center">
          <FaRupeeSign className="mr-2" /> Price Range
        </h4>
        <input
          type="range"
          min="0"
          max="5000"
          value={filters.priceRange[1]}
          onChange={(e) =>
            setFilters({ ...filters, priceRange: [0, e.target.value] })
          }
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>₹0</span>
          <span>₹{filters.priceRange[1]}</span>
        </div>
      </div>

      {/* Sort By */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold mb-2 flex items-center">
          <FaSort className="mr-2" /> Sort By
        </h4>
        <select
          value={filters.sortBy}
          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
          className="w-full p-2 border rounded"
        >
          <option value="relevance">Relevance</option>
          <option value="date-asc">Date (Earliest)</option>
          <option value="date-desc">Date (Latest)</option>
          <option value="price-asc">Price (Low to High)</option>
          <option value="price-desc">Price (High to Low)</option>
        </select>
      </div>

      <button
        onClick={() =>
          setFilters({
            date: "",
            priceRange: [0, 5000],
            sortBy: "relevance",
            category: "",
          })
        }
        className="w-full py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded"
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default FilterSidebar;
