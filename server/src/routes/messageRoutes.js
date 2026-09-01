const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  sendMessage,
  getOrderMessages,
} = require("../controller/messageController");

const router = express.Router();

// Send message
router.post("/", protect, sendMessage);

// Get messages for an order
router.get(
  "/order/:orderId",
  protect,
  getOrderMessages
);

router.post("/order/:receiverId", protect, sendMessage);

module.exports = router;