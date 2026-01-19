import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaInfoCircle, FaRupeeSign } from "react-icons/fa";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import API from "../api/axios";

const PaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bookingDetails, setBookingDetails] = useState(null);
  const [platformFee, setPlatformFee] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  //Get user from AuthContext
  const { user } = useContext(AuthContext);

  // Calculate platform fee (5%) and total amount
  useEffect(() => {
    if (location.state?.bookingDetails) {
      const details = location.state.bookingDetails;
      setBookingDetails(details);

      const calculatedFee = Math.round(details.totalPrice * 0.05);
      setPlatformFee(calculatedFee);
      setTotalAmount(details.totalPrice + calculatedFee);
    } else {
      navigate(`/events/${id}`);
    }
  }, [location, id, navigate]);

  // Add this useEffect to load Razorpay script
  useEffect(() => {
    const loadRazorpay = () => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => {
          resolve(true);
        };
        script.onerror = () => {
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    loadRazorpay();
  }, []);

  // Update the handlePayment function to handle errors better
  const handlePayment = async () => {
    if (!bookingDetails) return;

    setLoading(true);
    setError("");

    try {
      // Check if user is authenticated
      if (!user || !user.token) {
        throw new Error("User not authenticated");
      }

      // 1. Create booking
      const bookingResponse = await API.post(
        "/api/bookings",
        {
          event: id,
          tickets: bookingDetails.quantity,
          ticketPrice: bookingDetails.ticketPrice,
          subtotal: bookingDetails.totalPrice,
          platformFee,
          totalAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      // Store bookingId in a variable outside the handler scope
      const bookingId = bookingResponse.data.data._id;

      // 2. Create Razorpay order
      const orderResponse = await API.post(
        "/api/payments/create-order",
        {
          amount: totalAmount * 100,
          currency: "INR",
          receipt: `booking_${bookingId}`,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      // 3. Initialize Razorpay payment
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderResponse.data.data.amount,
        currency: orderResponse.data.data.currency,
        order_id: orderResponse.data.data.id,
        name: "Event Booking Platform",
        description: `Booking for ${bookingDetails.eventTitle}`,
        image: "/logo.png",
        handler: async function (response) {
          try {
            // Verify payment
            const verificationResponse = await API.post(
              `/api/bookings/${bookingId}/verify`,
              {
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              },
            );

            // Only navigate if verification was successful
            if (verificationResponse.data.success) {
              navigate(`/bookings/${bookingId}/confirmation`, {
                state: { booking: verificationResponse.data.data },
              });
            } else {
              setError("Payment verification failed. Please contact support.");
            }
          } catch (error) {
            console.error("Payment verification failed:", error);
            setError("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user.name || "",
          email: user.email || "",
          contact: user.phone || "",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        setError(
          `Payment failed: ${response.error.description || "Unknown error"}`,
        );
      });
    } catch (error) {
      console.error("Payment error:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to initialize payment. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!bookingDetails) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
      >
        <FaArrowLeft className="text-gray-700" />
      </button>

      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Complete Your Payment
              </h1>
              <p className="mt-2 text-gray-600">{bookingDetails.eventTitle}</p>
              <p className="text-gray-500">
                {new Date(bookingDetails.eventDate).toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  },
                )}
              </p>
            </div>
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Payment
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>

            <div className="mt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Tickets</span>
                <span className="font-medium">
                  {bookingDetails.quantity} × ₹
                  {bookingDetails.ticketPrice.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  ₹{bookingDetails.totalPrice.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <div className="flex items-center text-gray-600">
                  <span>Platform Fee (5%)</span>
                  <FaInfoCircle className="ml-1 text-gray-400" />
                </div>
                <span className="font-medium">
                  ₹{platformFee.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between border-t border-gray-200 pt-3">
                <span className="text-lg font-medium">Total Amount</span>
                <span className="text-lg font-bold">
                  ₹{totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {error && <ErrorMessage message={error} className="mt-4" />}

          <div className="mt-8">
            <button
              onClick={handlePayment}
              disabled={loading}
              className={`w-full flex items-center justify-center py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <LoadingSpinner size="small" />
              ) : (
                <>
                  <FaRupeeSign className="mr-2" />
                  Pay ₹{totalAmount.toLocaleString()}
                </>
              )}
            </button>
          </div>

          <div className="mt-4 text-center text-sm text-gray-500">
            Secure payment powered by Razorpay
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
