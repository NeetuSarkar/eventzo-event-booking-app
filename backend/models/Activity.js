import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },

    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },

    category: { type: String, required: true },
    language: { type: String, required: true },

    isFeatured: { type: Boolean, default: false },

    date: { type: Date, required: true },
    time: { type: String, required: true }, // e.g., "18:30" or "6:30 PM"
    duration: { type: String }, // e.g., "2h 30m"

    artists: [{ type: String }],

    ticketPrice: { type: Number, required: true },
    totalSeats: { type: Number, required: true },
    availableSeats: { type: Number, required: true },

    bookingCount: { type: Number, default: 0 },
    ageLimit: { type: Number, default: 0 }, 

    status: {
      type: String,
      enum: ["upcoming", "cancelled", "sold-out", "completed"],
      default: "upcoming",
    },

    tags: [{ type: String }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const Activity = mongoose.model("Activity", activitySchema);
export default Activity;
