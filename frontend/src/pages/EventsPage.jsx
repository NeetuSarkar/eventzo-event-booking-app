import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import EventCard from "../components/EventCard";
import FilterSidebar from "../components/FilterSidebar";
import { useAppContext } from "../../context/AppContext";
import EventCardSkeleton from "../components/EventCardSkeleton";
import MobileFilterPopup from "../components/MobileFilterPopup";
import MobileSortPopup from "../components/MobileSortPopup";
import { FaFilter, FaSort } from "react-icons/fa";
import API from "../api/axios";

const EventsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  // Get category from URL query params
  const urlCategory = queryParams.get("category") || "";

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    date: queryParams.get("date") || "",
    priceRange: queryParams.get("priceRange")
      ? queryParams.get("priceRange").split("-").map(Number)
      : [0, 5000],
    sortBy: queryParams.get("sortBy") || "relevance",
    category: urlCategory, // Initialize with URL category
  });

  const { selectedCity } = useAppContext();
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [showSortPopup, setShowSortPopup] = useState(false);

  // Fetch events based on filters
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = {
        ...(selectedCity && { city: selectedCity }),
        ...(filters.date && { date: filters.date }),
        priceRange: filters.priceRange.join("-"),
        sortBy: filters.sortBy,
        ...(filters.category && { category: filters.category }),
      };

      const res = await API.get("/api/activities/events", { params });

      setEvents(res.data.data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Update URL when filters change
  useEffect(() => {
    const newQueryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        if (Array.isArray(value)) {
          newQueryParams.set(key, value.join("-"));
        } else {
          newQueryParams.set(key, value);
        }
      }
    });

    navigate(`${location.pathname}?${newQueryParams.toString()}`, {
      replace: true,
    });

    fetchEvents();
  }, [filters, navigate, location.pathname]);

  // Reset filters (keeps category if present in URL)
  const resetFilters = () => {
    setFilters({
      date: "",
      priceRange: [0, 5000],
      sortBy: "relevance",
      category: urlCategory, // Preserve category from URL
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Mobile Filter/Sort Buttons */}
      <div className="md:hidden flex gap-4 mb-4 sticky top-16 z-10 bg-white p-2 shadow-sm">
        <button
          onClick={() => setShowFilterPopup(true)}
          className="flex-1 py-2 border border-gray-300 rounded-lg flex items-center justify-center gap-2"
        >
          <FaFilter /> Filters
        </button>
        <button
          onClick={() => setShowSortPopup(true)}
          className="flex-1 py-2 border border-gray-300 rounded-lg flex items-center justify-center gap-2"
        >
          <FaSort /> Sort
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filter Sidebar - Hidden on mobile */}
        <div className="hidden md:block md:w-1/4">
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            currentCategory={filters.category}
          />
        </div>

        {/* Events List */}
        <div className="md:w-3/4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">
              {filters.category ? `${filters.category} Events` : "All Events"}
              {selectedCity && ` in ${selectedCity}`}
            </h1>
            <p className="text-gray-600">{events.length} events found</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <EventCardSkeleton key={i} />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No events found matching your criteria
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Popups */}
      <MobileFilterPopup
        show={showFilterPopup}
        onClose={() => setShowFilterPopup(false)}
        filters={filters}
        setFilters={setFilters}
        currentCategory={filters.category}
      />

      <MobileSortPopup
        show={showSortPopup}
        onClose={() => setShowSortPopup(false)}
        sortBy={filters.sortBy}
        setSortBy={(value) => setFilters({ ...filters, sortBy: value })}
      />
    </div>
  );
};

export default EventsPage;
