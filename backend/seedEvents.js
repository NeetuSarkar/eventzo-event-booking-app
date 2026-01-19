import mongoose from "mongoose";
import dotenv from "dotenv";
import Activity from "./models/Activity.js";

dotenv.config();

/* -------------------- MASTER DATA -------------------- */

const cities = [
  { name: "Delhi", lat: 28.6139, lng: 77.209 },
  { name: "Mumbai", lat: 19.076, lng: 72.8777 },
  { name: "Bangalore", lat: 12.9716, lng: 77.5946 },
  { name: "Hyderabad", lat: 17.385, lng: 78.4867 },
  { name: "Chennai", lat: 13.0827, lng: 80.2707 },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
  { name: "Pune", lat: 18.5204, lng: 73.8567 },
  { name: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
];

const categories = [
  "Comedy Shows",
  "Music Shows",
  "Theater Shows",
  "Workshops",
  "Art And Craft",
  "Adventures And Fun",
  "Upskills And Training",
  "Amusement Park",
];

const languages = [
  "English",
  "Hindi",
  "English/Hindi",
  "English/Telugu",
  "Tamil",
  "Bengali",
  "Gujarati",
  "Marathi",
];

const artistsPool = [
  "Local Artists",
  "Industry Experts",
  "Stand-up Stars",
  "Music Bands",
  "Theatre Group",
  "Tech Mentors",
  "Creative Studio",
  "Adventure Instructors",
];

/* -------------------- HELPERS -------------------- */

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomFutureDate = () => {
  const now = new Date();
  const future = new Date();
  future.setMonth(future.getMonth() + 4);
  return new Date(now.getTime() + Math.random() * (future - now));
};

/* -------------------- GENERATOR -------------------- */

const generateActivities = (count = 150) => {
  const activities = [];

  for (let i = 1; i <= count; i++) {
    const city = randomFrom(cities);
    const category = randomFrom(categories);

    const totalSeats = randomInt(20, 800);
    const bookingCount = randomInt(0, totalSeats);
    const availableSeats = totalSeats - bookingCount;

    activities.push({
      title: `${category} Experience #${i}`,
      image: `https://source.unsplash.com/800x600/?event,india,${i}`,
      description:
        "A curated experience designed for entertainment, learning, and fun across major Indian cities.",
      location: city.name,
      coordinates: {
        lat: city.lat + Math.random() * 0.03,
        lng: city.lng + Math.random() * 0.03,
      },
      category,
      language: randomFrom(languages),
      date: randomFutureDate(),
      time: `${randomInt(9, 21)}:${randomFrom(["00", "30"])}`,
      duration: `${randomInt(2, 6)}h`,
      artists: [randomFrom(artistsPool)],
      ticketPrice: randomInt(199, 1999),
      totalSeats,
      availableSeats,
      bookingCount,
      ageLimit: randomInt(10, 21),
      isFeatured: Math.random() > 0.75,
      status: "upcoming",
    });
  }

  return activities;
};

/* -------------------- SEED EXECUTION -------------------- */

(async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    await Activity.deleteMany({});
    console.log("🧹 Old activities cleared");

    const activities = generateActivities(150); // 🔥 change count anytime
    await Activity.insertMany(activities);

    console.log(`🎉 ${activities.length} activities seeded successfully`);
  } catch (err) {
    console.error("❌ Seeding error:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected");
    process.exit(0);
  }
})();
