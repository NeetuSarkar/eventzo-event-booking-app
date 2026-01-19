import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import {
  FaTicketAlt,
  FaCalendarAlt,
  FaUserFriends,
  FaRupeeSign,
  FaCheckCircle,
  FaEye,
  FaArrowRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import API from "../api/axios";

function MyBookings() {
  const { user, authLoading } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        const res = await API.get("/api/bookings/my", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        // Filter to only show confirmed bookings
        const confirmedBookings = res.data.data.filter(
          (booking) => booking.status === "confirmed",
        );

        setBookings(confirmedBookings);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        setError("Failed to load bookings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchBookings();
    }
  }, [user, authLoading]);

  const handleViewTicket = (bookingId) => {
    navigate(`/bookings/${bookingId}/ticket`);
  };

  const handleGoToEvent = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Bookings</h1>
          <div className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
            <FaCheckCircle className="text-blue-600" />
            <span>Confirmed Tickets</span>
          </div>
        </div>

        {bookings.length === 0 ? (
          <EmptyState
            title="No confirmed bookings yet"
            description="Your confirmed event tickets will appear here"
            icon={<FaTicketAlt className="text-gray-400 text-5xl" />}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col"
              >
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 truncate">
                      {booking.activity?.title || "Event"}
                    </h3>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Confirmed
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium">
                          {new Date(booking.activity?.date).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <FaUserFriends className="text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Tickets</p>
                        <p className="font-medium">
                          {booking.quantity}{" "}
                          {booking.quantity > 1 ? "tickets" : "ticket"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <FaRupeeSign className="text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="font-medium">
                          ₹{booking.totalAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Booking ID</span>
                      <span className="text-sm font-mono text-gray-600">
                        {booking._id.slice(-8).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleViewTicket(booking._id)}
                      className="flex-1 flex items-center justify-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <FaEye className="mr-2" />
                      View Ticket
                    </button>
                    <button
                      onClick={() => handleGoToEvent(booking.activity._id)}
                      className="flex-1 flex items-center justify-center py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
                    >
                      <FaArrowRight className="mr-2" />
                      Event
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookings;
