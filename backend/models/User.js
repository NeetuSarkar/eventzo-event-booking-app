import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },

    // 👇 New Stuff Starts Here

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    location: {
      type: String, // city or area, e.g., "Koramangala"
      trim: true,
    },

    interests: {
      type: [String], // e.g., ["music", "tech", "standup"]
      default: [],
    },

    lastViewedEvents: [
      {
        eventId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Event",
        },
        viewedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    previousBookings: [
      {
        eventId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Event",
        },
        bookedAt: Date,
      },
    ],

    // Optional: For push notifications, reminders
    notificationTokens: {
      type: [String], // For web or mobile push notification tokens
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
