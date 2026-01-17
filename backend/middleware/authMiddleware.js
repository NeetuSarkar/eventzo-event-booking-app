import jwt from "jsonwebtoken";
import User from "../models/User.js"; // ✅ assuming you have a User model

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Set both userId and user object
    req.userId = decoded.userId;
    req.user = await User.findById(decoded.userId).select("-password"); // add this line

    next();
  } catch (error) {
    return res.status(403).json({ message: "Token is invalid or expired" });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access requred" });
  }
};
