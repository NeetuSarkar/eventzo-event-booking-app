import express from "express";
import {
  createBooking,
  getBookingById,
  getMyBookings,
  verifyPayment,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createBooking);
router.post("/:bookingId/verify", protect, verifyPayment);
router.get("/my", protect, getMyBookings);
router.get("/:id", protect, getBookingById);

export default router;
