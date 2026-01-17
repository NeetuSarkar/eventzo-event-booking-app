// Load environment variables
import dotenv from "dotenv";
dotenv.config();

// Import dependencies
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js"; // Adjust path if needed
import connectDB from "../config/db.js"; // Your custom DB connection file

// Define the admin data
const adminData = {
  name: "Neetu Sarkar",
  email: "neetusarkar202@gmail.com",
  phone: "7077336912",
  password: "Neetu@202",
  isAdmin: true,
};

export const createAdmin = async () => {
  try {
    // Check if the admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log("⚠️ Admin user already exists.");
      return mongoose.connection.close();
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    // Create new admin
    const adminUser = new User({
      ...adminData,
      password: hashedPassword,
    });

    await adminUser.save();
    console.log("🌟 Admin user created successfully!");
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
  } finally {
    // Always close the DB connection
    mongoose.connection.close();
  }
};


