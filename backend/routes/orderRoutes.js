import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Order from "../models/Order.js";

const router = express.Router();

// Place order
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { cart, paymentMethod, total } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const order = new Order({
      user: req.user.id, // set in authMiddleware
      cart,
      paymentMethod,
      total,
      status: "Pending",
    });

    await order.save();
    res.json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to place order" });
  }
});

export default router;
