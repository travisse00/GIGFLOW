const Message = require("../models/Message");
const Order = require("../models/Order");
const mongoose = require("mongoose");
const { getIO } = require("../utils/socket");

// ========================================
// SEND MESSAGE
// ========================================

const sendMessage = async (req, res) => {
  try {
    const { orderId, message } = req.body;

    const senderId = req.user.userId;

    if (!orderId || !message) {
      return res.status(400).json({
        message: "Order ID and message are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        message: "Invalid order ID",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // ========================================
    // CHECK THAT USER BELONGS TO ORDER
    // ========================================

    const isClient =
      order.client.toString() === senderId.toString();

    const isFreelancer =
      order.freelancer.toString() === senderId.toString();

    if (!isClient && !isFreelancer) {
      return res.status(403).json({
        message: "You are not part of this order",
      });
    }

    // ========================================
    // DETERMINE RECEIVER
    // ========================================

    const receiverId = isClient
      ? order.freelancer
      : order.client;

    // ========================================
    // CREATE MESSAGE
    // ========================================

    const newMessage = await Message.create({
      order: orderId,
      sender: senderId,
      receiver: receiverId,
      message: message.trim(),
    });

    // Get sender information
    const populatedMessage =
      await Message.findById(newMessage._id)
        .populate("sender", "name profileImage")
        .populate("receiver", "name profileImage");

    // ========================================
    // REAL-TIME MESSAGE
    // ========================================

    const io = getIO();

    io.to(`user_${receiverId}`).emit(
      "newMessage",
      populatedMessage
    );

    // Also send it back to sender
    io.to(`user_${senderId}`).emit(
      "messageSent",
      populatedMessage
    );

    return res.status(201).json({
      message: "Message sent successfully",
      data: populatedMessage,
    });
  } catch (error) {
    console.error("SEND MESSAGE ERROR:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ========================================
// GET ORDER MESSAGES
// ========================================

const getOrderMessages = async (req, res) => {
  try {
    const { orderId } = req.params;

    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        message: "Invalid order ID",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // ========================================
    // CHECK USER ACCESS
    // ========================================

    const isClient =
      order.client.toString() === userId.toString();

    const isFreelancer =
      order.freelancer.toString() === userId.toString();

    if (!isClient && !isFreelancer) {
      return res.status(403).json({
        message: "You are not part of this order",
      });
    }

    // ========================================
    // GET MESSAGES
    // ========================================

    const messages = await Message.find({
      order: orderId,
    })
      .populate("sender", "name profileImage")
      .populate("receiver", "name profileImage")
      .sort({
        createdAt: 1,
      });

    return res.status(200).json({
      messages,
    });
  } catch (error) {
    console.error(
      "GET ORDER MESSAGES ERROR:",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  sendMessage,
  getOrderMessages,
};