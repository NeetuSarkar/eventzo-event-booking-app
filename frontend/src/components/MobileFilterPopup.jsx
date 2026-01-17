import React from "react";
import { FaTimes } from "react-icons/fa";

const MobileFilterPopup = ({
  show,
  onClose,
  filters,
  setFilters,
  currentCategory,
}) => {
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
    const newCategory = currentCategory === cat ? "" : cat;
    setFilters({ ...filters, category: newCategory });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-4/5 h-full overflow-y-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Filters</h2>
          <button onClick={onClose} className="text-gray-500">
            <FaTimes size={24} />
          </button>
        </div>

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
          <h4 className="text-sm font-semibold mb-2">Date</h4>
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
          <h4 className="text-sm font-semibold mb-2">Price Range</h4>
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

        <button
          onClick={() => {
            setFilters({
              date: "",
              priceRange: [0, 5000],
              category: "",
            });
            onClose();
          }}
          className="w-full py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded"
        >
          Reset Filters
        </button>

        <button
          onClick={onClose}
          className="w-full py-2 mt-4 bg-indigo-600 text-white rounded-lg"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default MobileFilterPopup;
