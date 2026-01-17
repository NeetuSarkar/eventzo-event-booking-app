import React from "react";
import { FaTimes } from "react-icons/fa";

const MobileSortPopup = ({ show, onClose, sortBy, setSortBy }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-4/5 h-full overflow-y-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Sort By</h2>
          <button onClick={onClose} className="text-gray-500">
            <FaTimes size={24} />
          </button>
        </div>

        <div className="space-y-2">
          {[
            { value: "relevance", label: "Relevance" },
            { value: "date-asc", label: "Date (Earliest)" },
            { value: "date-desc", label: "Date (Latest)" },
            { value: "price-asc", label: "Price (Low to High)" },
            { value: "price-desc", label: "Price (High to Low)" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setSortBy(option.value);
                onClose();
              }}
              className={`block w-full text-left px-4 py-3 rounded-lg ${
                sortBy === option.value
                  ? "bg-indigo-100 text-indigo-700"
                  : "hover:bg-gray-100"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileSortPopup;
