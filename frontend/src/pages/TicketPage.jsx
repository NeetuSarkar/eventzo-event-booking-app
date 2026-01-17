import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaUser,
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import QRCode from "react-qr-code";

function TicketPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/bookings/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setTicket(res.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load ticket details");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id, user.token]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!ticket) return <div className="p-8">Ticket not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back button and header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FaArrowLeft className="mr-2" /> Back to bookings
          </button>
          <h1 className="text-3xl font-bold mt-4">Your Event Ticket</h1>
        </div>

        {/* Ticket container */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          {/* Ticket content */}
          <div className="p-8">
            {/* Ticket header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {ticket.activity?.title}
                </h2>
                <p className="text-gray-600 flex items-center mt-1">
                  <FaMapMarkerAlt className="mr-2" />
                  {ticket.activity?.location}
                </p>
              </div>
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full flex items-center">
                <FaTicketAlt className="mr-2" />
                <span>Confirmed</span>
              </div>
            </div>

            {/* Ticket details grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Event Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <FaCalendarAlt className="text-gray-500 mt-1 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Date & Time</p>
                        <p className="font-medium">
                          {new Date(ticket.activity?.date).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                          <br />
                          {ticket.activity?.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaUser className="text-gray-500 mt-1 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Attendee</p>
                        <p className="font-medium">{user.name}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Booking Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Booking Reference</p>
                      <p className="font-mono font-medium">{ticket._id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tickets</p>
                      <p className="font-medium">
                        {ticket.quantity}{" "}
                        {ticket.quantity > 1 ? "tickets" : "ticket"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Paid</p>
                      <p className="font-medium">
                        ₹{ticket.totalAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code and instructions */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex flex-col items-center">
                <div className="bg-white p-4 border border-gray-200 rounded-lg mb-4">
                  <div className="w-32 h-32 flex items-center justify-center">
                    <QRCode
                      value={ticket._id}
                      size={128}
                      level="H"
                      bgColor="#ffffff"
                      fgColor="#000000"
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-600 text-center max-w-md">
                  Present this ticket at the event entrance. The QR code will be
                  scanned for verification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketPage;
