import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import API from "../../api/axios";

const BookingDetails = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await API.get(
          `/api/admin/bookings/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setBooking(res.data);
      } catch (err) {
        console.error("Error fetching booking:", err);
      }
    };

    fetchBooking();
  }, [id]);

  if (!booking)
    return (
      <div className="p-6 text-center text-gray-500">
        Loading booking details...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-xl space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 border-b pb-4">
        Booking Summary
      </h2>

      {/* Booking Info */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Info label="Booking ID" value={booking._id} />
        <Info label="Status" value={booking.status} />
        <Info
          label="Customer"
          value={`${booking.user?.name} (${booking.user?.email})`}
        />
        <Info label="Activity" value={booking.activity?.title || "N/A"} />
        <Info
          label="Booking Date"
          value={new Date(booking.createdAt).toLocaleString()}
        />
        <Info label="Quantity" value={booking.quantity} />
      </section>

      {/* Pricing */}
      <div>
        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">
          Pricing Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <Info label="Ticket Price" value={`₹${booking.ticketPrice}`} />
          <Info label="Subtotal" value={`₹${booking.subtotal}`} />
          <Info label="Platform Fee" value={`₹${booking.platformFee}`} />
          <Info label="Total Amount" value={`₹${booking.totalAmount}`} />
        </div>
      </div>

      {/* Payment Info */}
      <div>
        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">
          Payment Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <Info
            label="Razorpay Order ID"
            value={booking.razorpay_order_id || "N/A"}
          />
          <Info
            label="Payment ID"
            value={booking.razorpay_payment_id || "N/A"}
          />
          <Info label="Signature" value={booking.razorpay_signature || "N/A"} />
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
    <p className="text-sm text-gray-500 font-medium">{label}</p>
    <p className="text-base font-semibold text-gray-800 mt-1 break-words">
      {value}
    </p>
  </div>
);

export default BookingDetails;
