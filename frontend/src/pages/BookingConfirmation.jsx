import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { FaCheckCircle, FaCalendarAlt, FaTicketAlt } from "react-icons/fa";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState(null);
  const [event, setEvent] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        setError("");

        // First try to get data from location state
        if (location.state?.booking) {
          setBooking(location.state.booking);

          // Check if we already have the event data (might be populated from backend)
          if (
            location.state.booking.activity &&
            typeof location.state.booking.activity === "object"
          ) {
            setEvent(location.state.booking.activity);
          } else {
            // Fetch event details if not populated
            const eventRes = await axios.get(
              `http://localhost:5000/api/events/${
                location.state.booking.activity || location.state.booking.event
              }`,
              {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              }
            );
            setEvent(eventRes.data.data);
          }
        } else {
          // Fallback - fetch booking from API
          const bookingRes = await axios.get(
            `http://localhost:5000/api/bookings/${bookingId}`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );

          setBooking(bookingRes.data.data);

          // Check if event is populated in the response
          if (
            bookingRes.data.data.activity &&
            typeof bookingRes.data.data.activity === "object"
          ) {
            setEvent(bookingRes.data.data.activity);
          } else {
            // Fetch event separately
            const eventRes = await axios.get(
              `http://localhost:5000/api/events/${
                bookingRes.data.data.activity || bookingRes.data.data.event
              }`,
              {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              }
            );
            setEvent(eventRes.data.data);
          }
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load booking or event details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId, location.state, user.token]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!booking) return <ErrorMessage message="Booking not found" />;

  return (
    <div className="min-h-screen bg-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="flex items-center justify-center text-green-600 text-3xl mb-4">
            <FaCheckCircle />
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-800">
            Booking Confirmed!
          </h1>
          <p className="mt-2 text-center text-gray-600">
            Thank you for booking. Here are your booking details:
          </p>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between text-gray-700">
              <span className="font-medium">Event</span>
              <span>{event?.title || "N/A"}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span className="font-medium">Date</span>
              <span>
                {event?.date
                  ? new Date(event.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span className="font-medium">Tickets</span>
              <span>{booking?.quantity || "N/A"}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span className="font-medium">Total Paid</span>
              <span>₹{booking?.totalAmount?.toLocaleString() || "N/A"}</span>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
