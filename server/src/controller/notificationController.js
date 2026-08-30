const Notification = require("../models/notificationModel");

/*
========================================
GET MY NOTIFICATIONS
========================================
*/

const getMyNotifications = async (req, res) => {
  try {
    const userId =
      req.user.userId ||
      req.user.id ||
      req.user._id;

    const notifications = await Notification.find({
      recipient: userId,
    })
      .populate("sender", "name")
      .populate("order", "gig price status")
      .sort({ createdAt: -1 });

    res.json({
      notifications,
    });
  } catch (error) {
    console.error(
      "GET NOTIFICATIONS ERROR:",
      error
    );

    res.status(500).json({
      message: "Server error.",
    });
  }
};

/*
========================================
GET UNREAD COUNT
========================================
*/

const getUnreadCount = async (req, res) => {
  try {
    const userId =
      req.user.userId ||
      req.user.id ||
      req.user._id;

    const count = await Notification.countDocuments({
      recipient: userId,
      read: false,
    });

    res.json({
      count,
    });
  } catch (error) {
    console.error(
      "GET UNREAD COUNT ERROR:",
      error
    );

    res.status(500).json({
      message: "Server error.",
    });
  }
};

/*
========================================
MARK ONE AS READ
========================================
*/

const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const userId =
      req.user.userId ||
      req.user.id ||
      req.user._id;

    const notification =
      await Notification.findOneAndUpdate(
        {
          _id: notificationId,
          recipient: userId,
        },
        {
          read: true,
        },
        {
          new: true,
        }
      );

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found.",
      });
    }

    res.json({
      message: "Notification marked as read.",
      notification,
    });
  } catch (error) {
    console.error(
      "MARK NOTIFICATION READ ERROR:",
      error
    );

    res.status(500).json({
      message: "Server error.",
    });
  }
};

/*
========================================
MARK ALL AS READ
========================================
*/

const markAllAsRead = async (req, res) => {
  try {
    const userId =
      req.user.userId ||
      req.user.id ||
      req.user._id;

    await Notification.updateMany(
      {
        recipient: userId,
        read: false,
      },
      {
        read: true,
      }
    );

    res.json({
      message: "All notifications marked as read.",
    });
  } catch (error) {
    console.error(
      "MARK ALL NOTIFICATIONS READ ERROR:",
      error
    );

    res.status(500).json({
      message: "Server error.",
    });
  }
};

module.exports = {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
};