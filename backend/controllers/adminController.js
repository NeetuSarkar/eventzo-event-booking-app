import Booking from "../models/Booking.js";
import Activity from "../models/Activity.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

export const getAdminDashboard = async (req, res) => {
  try {
    //Total Events
    const totalEvents = await Activity.countDocuments();

    //Total bookings
    const totalBookings = await Booking.countDocuments();

    //Total Earnings (only confirmend bookings)
    const confirmedBookings = await Booking.find({ status: "confirmed" });

    const totalEarnings = confirmedBookings.reduce(
      (acc, booking) => acc + booking.totalAmount,
      0
    );

    // Total upcoming events
    const upcomingEventsCount = await Activity.countDocuments({
      status: "upcoming",
    });

    // 5 most recent upcoming events
    const recentUpcomingEvents = await Activity.find({ status: "upcoming" })
      .sort({ date: 1 }) // soonest upcoming
      .limit(5);

    //5 most recent bookings
    const recentBookings = await Booking.find()
      .sort({ createdAt: 1 })
      .limit(5)
      .populate("user", "name email")
      .populate("activity", "title");

    res.json({
      totalEvents,
      totalBookings,
      totalEarnings,
      upcomingEventsCount,
      recentUpcomingEvents,
      recentBookings,
    });
  } catch (error) {
    console.error("Error in admin dashboard: ", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllEvents = async (req, res) => {
  const events = await Activity.find({});
  res.json(events);
};

// Get single event by ID
export const getEventById = async (req, res) => {
  try {
    const event = await Activity.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//Get bookings By Event
export const getBookingsByEvent = async (req, res) => {
  try {
    const bookings = await Booking.find({ activity: req.params.id }).populate(
      "user",
      "name email"
    );
    res.json(bookings);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching bookings", error: error.message });
  }
};

//Update Event
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    //find the event by ID
    const event = await Activity.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not Found" });
    }

    Object.assign(event, req.body);

    const updatedEvent = await event.save();
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("Error updating event: ", error.message);
    res
      .status(500)
      .json({ message: "Failed to update Event", error: error.message });
  }
};

//Delete Event Controller
export const deleteEvent = async (req, res) => {
  try {
    const event = await Activity.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    await event.deleteOne();
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting Event: ", error);
    res.status(500).json({ message: "Server error while deleting event" });
  }
};

//Create New Event
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      image,
      description,
      location,
      coordinates,
      category,
      language,
      isFeatured,
      date,
      time,
      duration,
      artists,
      ticketPrice,
      totalSeats,
      availableSeats,
      ageLimit,
      status,
      tags,
      createdBy,
    } = req.body;

    // Optional: Validate required fields
    if (
      !title ||
      !image ||
      !description ||
      !location ||
      !category ||
      !language ||
      !date ||
      !time ||
      !ticketPrice ||
      !totalSeats ||
      !availableSeats
    ) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields" });
    }

    const newEvent = new Activity({
      title,
      image,
      description,
      location,
      coordinates,
      category,
      language,
      isFeatured,
      date,
      time,
      duration,
      artists,
      ticketPrice,
      totalSeats,
      availableSeats,
      ageLimit,
      status,
      tags,
      createdBy,
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error("Error creating event:", error.message);
    res.status(500).json({
      message: "Server error while creating event",
      error: error.message,
    });
  }
};

//Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("activity", "title");
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err.message); // Log error for debugging
    res
      .status(500)
      .json({ error: "Failed to load bookings", message: error.message });
  }
};

//Get Booking Details by Id
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email")
      .populate("activity", "title");

    if (!booking) {
      res.json({ message: "Booking data not found" });
    }

    res.json(booking);
  } catch (error) {
    res.json({ message: error.message });
  }
};

//Get all Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    if (!users) {
      res.json({ message: "Users Data not found" });
    }
    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.json();
  }
};

//Get all Notification
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error("Get notifications Errror", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//Mark A Notficiation As Read
export const markNotficationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: "Error marking notification as read" });
  }
};


// Mark All Notifications Read
export const markAllNotificationAsRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { read: false },
      { $set: { read: true } }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} notifications marked as read`,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ message: "Error marking notifications as read" });
  }
};