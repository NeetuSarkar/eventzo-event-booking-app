import Activity from "../models/Activity.js";
import mongoose from "mongoose";
//Get featured events
export const getFeaturedEvents = async (req, res) => {
  try {
    const { city } = req.query;

    const events = await Activity.find({
      isFeatured: true,
      location: city,
    });

    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUpcomingEvents = async (req, res) => {
  try {
    const { city } = req.query;

    const events = await Activity.find({
      date: { $gte: new Date() },
      location: city,
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEvents = async (req, res) => {
  const { city, category, date, priceRange, sortBy } = req.query;

  // Base query
  const query = {
    date: { $gte: new Date() },
  };

  // Add city filter
  if (city) {
    query.location = new RegExp(city, "i");
  }

  // Add category filter
  if (category) {
    query.category = { $regex: new RegExp(category, "i") };
  }

  // Date filters
  if (date) {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const thisWeekend = new Date(now);
    thisWeekend.setDate(thisWeekend.getDate() + (6 - now.getDay()));

    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);

    switch (date) {
      case "today":
        query.date = {
          $gte: new Date(now.setHours(0, 0, 0, 0)),
          $lt: new Date(now.setHours(23, 59, 59, 999)),
        };
        break;
      case "tomorrow":
        query.date = {
          $gte: new Date(tomorrow.setHours(0, 0, 0, 0)),
          $lt: new Date(tomorrow.setHours(23, 59, 59, 999)),
        };
        break;
      case "this-weekend":
        query.date = {
          $gte: new Date(now.setHours(0, 0, 0, 0)),
          $lte: new Date(thisWeekend.setHours(23, 59, 59, 999)),
        };
        break;
      case "next-week":
        query.date = {
          $gte: new Date(nextWeek.setHours(0, 0, 0, 0)),
          $lte: new Date(nextWeek.setDate(nextWeek.getDate() + 7)),
        };
        break;
    }
  }

  // Price range filter
  if (priceRange) {
    const [minPrice, maxPrice] = priceRange.split("-").map(Number);
    query.ticketPrice = { $gte: minPrice, $lte: maxPrice };
  }

  // Sorting
  let sort = {};
  switch (sortBy) {
    case "date-asc":
      sort.date = 1;
      break;
    case "date-desc":
      sort.date = -1;
      break;
    case "price-asc":
      sort.ticketPrice = 1;
      break;
    case "price-desc":
      sort.ticketPrice = -1;
      break;
    default:
      sort.date = 1; // Default sort by soonest events
  }

  // Execute query
  const events = await Activity.find(query)
    .sort(sort)
    .limit(100)
    .select("-__v -createdAt -updatedAt");

  res.json({
    success: true,
    count: events.length,
    data: events,
  });
};

// Get single event by ID
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID format",
      });
    }

    const event = await Activity.findById(id).select("-__v -updatedAt"); // Exclude unnecessary fields

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
