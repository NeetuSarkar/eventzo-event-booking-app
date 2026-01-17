import User from "../models/User.js";
import mongoose from "mongoose";

export const trackUserVisit = async (req, res) => {
  const userId = req.userId;
  const { id } = req.body;
  try {
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const existingIndex = user.lastViewedEvents.findIndex(
      (e) => e.eventId && e.eventId.toString() === id
    );

    const now = Date.now();

    if (existingIndex > -1) {
      user.lastViewedEvents[existingIndex].viewedAt = now;
    } else {
      user.lastViewedEvents.push({ eventId: id, viewedAt: now });

      //Keep only last 10 events
      if (user.lastViewedEvents.length > 10) {
        user.lastViewedEvents.shift();
      }
    }

    await user.save();

    return res.status(200).json({ message: "Viewed event updated" });
  } catch (error) {
    console.error("Error updating viewed events: ", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};


