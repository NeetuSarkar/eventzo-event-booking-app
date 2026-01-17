import Booking from "../models/Booking.js";
import Activity from "../models/Activity.js";
import Notification from "../models/Notification.js";

import mongoose from "mongoose";
import { generateTicketPDF } from "../utils/generateTicketPDF.js";
import { sendTicketEmail } from "../utils/sendEmail.js";

export const createBooking = async (req, res) => {
  try {
    const { event, tickets } = req.body;

    //Validate event ID
    if (!mongoose.Types.ObjectId.isValid(event)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid event ID" });
    }

    //Find the event
    const eventData = await Activity.findById(event);
    if (!eventData) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    //Check available seats
    if (eventData.availableSeats < tickets) {
      return res
        .status(400)
        .json({ success: false, message: "Not enough seats available" });
    }

    //Calculate amounts
    const subtotal = eventData.ticketPrice * tickets;
    const platformFee = Math.round(subtotal * 0.05);
    const totalAmount = subtotal + platformFee;

    //Create booking
    const booking = await Booking.create({
      user: req.userId,
      activity: event,
      quantity: tickets,
      ticketPrice: eventData.ticketPrice,
      subtotal,
      platformFee,
      totalAmount,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Booking created",
      data: booking,
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// controllers/bookingController.js

export const verifyPayment = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

    // Validate booking ID
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Booking Id" });
    }

    // Find and populate booking details
    const booking = await Booking.findById(bookingId)
      .populate("activity")
      .populate("user");

    await Notification.create({
      message: `${booking.user.name} booked ${booking.quantity} ticket(s) for ${booking.activity.title}`,
      type: "booking",
    });

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    // Update booking status
    booking.status = "confirmed";
    booking.razorpay_order_id = razorpayOrderId;
    booking.razorpay_payment_id = razorpayPaymentId;
    booking.razorpay_signature = razorpaySignature;
    await booking.save();

    // Update event available seats
    await Activity.findByIdAndUpdate(booking.activity, {
      $inc: {
        availableSeats: -booking.quantity,
        bookingCount: booking.quantity,
      },
    });

    // Generate PDF and send email
    const pdfBuffer = await generateTicketPDF(booking);
    await sendTicketEmail({
      email: booking.user.email,
      name: booking.user.name,
      booking,
      pdfBuffer,
    });

    res.json({
      success: true,
      message: "Payment verified and booking confirmed",
      data: booking,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId }).populate(
      "activity"
    );

    res.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error("My Booking error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

// controllers/bookingController.js
export const getBookingById = async (req, res) => {
  try {
    // Validate booking ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid booking ID format" });
    }

    const booking = await Booking.findById(req.params.id)
      .populate("activity")
      .populate("user", "name email");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Verify the booking belongs to the requesting user
    if (booking.user._id.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Get booking by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
