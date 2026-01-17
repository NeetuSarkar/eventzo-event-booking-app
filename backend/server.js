import "dotenv/config"; // This must be the VERY FIRST import

import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import activityTrackerRoutes from "./routes/activityTrackerRoutes.js";

import connectDB from "./config/db.js";

// Verify env variables are loaded
console.log("Env check:", {
  port: process.env.PORT,
  razorpayKey: process.env.RAZORPAY_KEY_ID ? "exists" : "missing",
});

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/activity-tracker", activityTrackerRoutes);

app.get("/", (req, res) => {
  res.end("hello to server");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
