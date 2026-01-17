import Razorpay from "razorpay";

// Debug check
console.log("Razorpay Env Check:", {
  key: process.env.RAZORPAY_KEY_ID ? "***" : "MISSING",
  secret: process.env.RAZORPAY_KEY_SECRET ? "***" : "MISSING",
});

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default razorpay;
