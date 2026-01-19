import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaUsers,
  FaTicketAlt,
  FaShare,
  FaHeart,
  FaArrowLeft,
} from "react-icons/fa";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import MapContainer from "../components/MapContainer";
import API from "../api/axios";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [event, setEvent] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/api/activities/${id}`);
      if (res.data) {
        setEvent(res.data.data);
      } else {
        setError("Event not found");
      }
    } catch (error) {
      console.error("Error fetching event:", error);
      setError(error.response?.data?.message || "Failed to load event details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);
  useEffect(() => {
    const timer = setTimeout(() => {
      API
        .post(
          "/api/activity-tracker/track-user-visit",
          { id },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        )
        .catch((error) => {
          console.error("Error tracking  event view:", error);
        });
    }, 3000);

    return () => clearTimeout(timer);
  }, [id]);

  const handleBookNow = () => {
    if (!event) return;

    if (!user) {
      sessionStorage.setItem("prevPath", `/events/${id}`);

      navigate("/login", {
        state: {
          from: {
            pathname: `/events/${id}`,
            search: window.location.search,
          },
        },
      });
      return;
    }
    // Proceed to payment if logged in
    navigate(`/events/${id}/payment`, {
      state: {
        bookingDetails: {
          eventId: id,
          eventTitle: event.title,
          eventDate: event.date,
          ticketPrice: event.ticketPrice,
          quantity,
          totalPrice: quantity * event.ticketPrice,
        },
      },
    });
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    console.log(`${isFavorite ? "Removing from" : "Adding to"} favorites`);
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${period}`;
  };

  // Early returns should be inside the component function
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!event) return <ErrorMessage message="Event not found" />;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
      >
        <FaArrowLeft className="text-gray-700" />
      </button>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Event header with image */}
          <div className="relative">
            <img
              src="/event.jpg"
              alt={event.title}
              className="w-full h-64 sm:h-96 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-2xl sm:text-4xl font-bold text-white">
                    {event.title}
                  </h1>
                  <p className="text-gray-200 mt-2 flex items-center">
                    <FaMapMarkerAlt className="mr-1" /> {event.location}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={toggleFavorite}
                    className={`p-2 rounded-full ${
                      isFavorite
                        ? "bg-red-500 text-white"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    <FaHeart />
                  </button>
                  <button className="bg-white p-2 rounded-full text-gray-700">
                    <FaShare />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Event details grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6">
            {/* Left column - Event info */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-4">About the Event</h2>
                <p className="text-gray-700">{event.description}</p>
              </div>
              {/* Artists section */}
              {event.artists?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Featured Artists
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {event.artists.map((artist, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 px-3 py-1 rounded-full"
                      >
                        {artist}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <MapContainer event={event} />
            </div>

            {/* Right column - Booking section */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-bold mb-4">Event Details</h3>

                <div className="space-y-3">
                  <div className="flex items-start">
                    <FaCalendarAlt className="text-gray-500 mt-1 mr-3" />
                    <div>
                      <p className="font-medium">Date</p>
                      <p className="text-gray-600">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FaClock className="text-gray-500 mt-1 mr-3" />
                    <div>
                      <p className="font-medium">Time</p>
                      <p className="text-gray-600">
                        {formatTime(event.time)}{" "}
                        {event.duration && `• ${event.duration}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FaUsers className="text-gray-500 mt-1 mr-3" />
                    <div>
                      <p className="font-medium">Age Limit</p>
                      <p className="text-gray-600">
                        {event.ageLimit > 0
                          ? `${event.ageLimit}+ years`
                          : "All ages"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FaTicketAlt className="text-gray-500 mt-1 mr-3" />
                    <div>
                      <p className="font-medium">Price</p>
                      <p className="text-gray-600">
                        ₹{event.ticketPrice.toLocaleString()} per ticket
                      </p>
                      <p className="text-sm text-gray-500">
                        {event.availableSeats} of {event.totalSeats} seats
                        available
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking form */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-bold mb-4">Book Tickets</h3>

                {event.status === "sold-out" ? (
                  <div className="bg-red-100 text-red-800 p-3 rounded-lg">
                    This event is sold out
                  </div>
                ) : event.status === "cancelled" ? (
                  <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg">
                    This event has been cancelled
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity
                      </label>
                      <select
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        className="w-full border border-gray-300 rounded-md p-2"
                      >
                        {[
                          ...Array(Math.min(10, event.availableSeats)).keys(),
                        ].map((num) => (
                          <option key={num + 1} value={num + 1}>
                            {num + 1}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mt-6">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">
                          ₹{(quantity * event.ticketPrice).toLocaleString()}
                        </span>
                      </div>
                      <button
                        onClick={handleBookNow}
                        disabled={event.availableSeats === 0}
                        className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg ${
                          event.availableSeats === 0
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {event.availableSeats === 0 ? "Sold Out" : "Book Now"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
