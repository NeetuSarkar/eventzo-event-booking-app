import express from "express";
import { admin, protect } from "../middleware/authMiddleware.js";
import {
  createEvent,
  deleteEvent,
  getAdminDashboard,
  getAllBookings,
  getAllEvents,
  getAllUsers,
  getBookingById,
  getBookingsByEvent,
  getEventById,
  getNotifications,
  markAllNotificationAsRead,
  markNotficationAsRead,
  updateEvent,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/dashboard", protect, admin, getAdminDashboard);
router.get("/events", getAllEvents);
router.get("/events/:id", getEventById);
// router
router.get("/bookings/event/:id", protect, admin, getBookingsByEvent);
router.put("/events/:id", protect, admin, updateEvent);
router.delete("/events/:id", protect, admin, deleteEvent);
router.post("/events", protect, admin, createEvent);
router.get("/bookings", protect, admin, getAllBookings);
router.get("/bookings/:id", protect, admin, getBookingById);
router.get("/users", protect, admin, getAllUsers);
router.get("/notifications", protect, admin, getNotifications);
router.patch(
  "/notifications/:id/mark-as-read",
  protect,
  admin,
  markNotficationAsRead
);
router.patch(
  "/notifications/mark-all-as-read",
  protect,
  admin,
  markAllNotificationAsRead
);

export default router;
