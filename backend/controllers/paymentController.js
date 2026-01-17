import razorpay from "../config/razorpay.js";

export const createOrder = async (req, res) => {
  try {
    const { amount, currency, receipt } = req.body;

    const options = {
      amount,
      currency: currency || "INR",
      receipt, // ✅ fixed here
    };

    const order = await razorpay.orders.create(options);

    res.json({ success: true, message: "Razorpay order created", data: order });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};
