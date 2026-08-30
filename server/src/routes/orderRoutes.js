const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  createOrder,
  getMyOrders,
  updateOrderStatus,
  acceptOrder,
  declineOrder,
  completeOrder,
  cancelOrder,
} = require("../controller/orderController");

const router = express.Router();

router.post("/", protect, createOrder);

router.patch("/:id/status", protect, updateOrderStatus);

router.get("/my-orders", protect, getMyOrders);

router.patch(
  "/:id/accept",
  protect,
  acceptOrder
);

// Decline order
router.patch(
  "/:id/decline",
  protect,
  declineOrder
);

router.patch(
  "/:id/complete",
  protect,
  completeOrder
);

router.patch(
  "/:id/cancel",
  protect,
  cancelOrder
);

module.exports = router;