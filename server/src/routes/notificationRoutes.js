const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} = require("../controller/notificationController");

const router = express.Router();

router.get(
  "/",
  protect,
  getMyNotifications
);

router.get(
  "/unread-count",
  protect,
  getUnreadCount
);

router.patch(
  "/read-all",
  protect,
  markAllAsRead
);

router.patch(
  "/:notificationId/read",
  protect,
  markAsRead
);

module.exports = router;