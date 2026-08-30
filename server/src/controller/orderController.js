const Order = require("../models/Order");
const createNotification = require("../utils/createNotification");
const Gig = require("../models/Gig");
const { getIO } = require("../utils/socket");

const createOrder = async (req, res) => {
  try {
    const { gigId } = req.body; // Check if gig ID was provided
    if (!gigId) {
      return res.status(400).json({ message: "Gig ID is required" });
    } // Only clients can place orders
    if (req.user.role !== "client") {
      return res.status(403).json({ message: "Only clients can place orders" });
    } // Find the gig
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    } // Don't allow a freelancer to hire themselves
    if (gig.freelancer.toString() === req.user.userId.toString()) {
      return res.status(400).json({ message: "You cannot hire yourself" });
    } // Create the order
    const order = await Order.create({
      gig: gig._id,
      client: req.user.userId,
      freelancer: gig.freelancer,
      price: gig.price,
    }); // ========================= // SOCKET.IO // =========================
    const io = getIO();
    io.to(`user_${gig.freelancer.toString()}`).emit("newOrder", {
      message: "You received a new order!",
      order,
    }); // ========================= // RESPONSE // =========================
    await createNotification({
  recipient: gig.freelancer,
  sender: req.user.userId,
  type: "new_order",
  message: `${req.user.name || "A client"} placed a new order for your gig.`,
  order: order._id,
});
    return res
      .status(201)
      .json({ message: "Order created successfully", order });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getMyOrders = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "client") {
      filter.client = req.user.userId;
    } else if (req.user.role === "freelancer") {
      filter.freelancer = req.user.userId;
    }

    const orders = await Order.find(filter)
      .populate("gig", "title price image category")
      .populate("client", "name email profileImage")
      .populate("freelancer", "name email profileImage")
      .sort({ createdAt: -1 });

    res.json({
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["pending", "active", "completed", "cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Only the freelancer can update the order
    if (order.freelancer.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You are not allowed to update this order",
      });
    }

    order.status = status;

    await order.save();

    res.json({
      message: "Order status updated",
      order,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// =========================
// ACCEPT ORDER
// =========================

const acceptOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const freelancerId =
      order.freelancer?.toString();

    const userId =
      req.user?.userId?.toString() ||
      req.user?._id?.toString() ||
      req.user?.id?.toString();

    console.log("========== ACCEPT ORDER ==========");
    console.log("Order ID:", req.params.id);
    console.log("Order freelancer:", freelancerId);
    console.log("Logged in user:", req.user);
    console.log("Logged in user ID:", userId);
    console.log("Logged in role:", req.user?.role);
    console.log("===================================");

    if (!userId) {
      return res.status(401).json({
        message: "User ID not found.",
      });
    }

    if (!freelancerId) {
      return res.status(400).json({
        message: "This order has no freelancer assigned.",
      });
    }

    // Only the freelancer assigned to the order
    // can accept it.
    if (freelancerId !== userId) {
      return res.status(403).json({
        message:
          "You are not authorized to accept this order.",
        debug: {
          freelancerId,
          userId,
          role: req.user?.role,
        },
      });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        message:
          "Only pending orders can be accepted.",
      });
    }

    order.status = "active";

    await order.save();

    await createNotification({
  recipient: order.client,
  sender: order.freelancer,
  type: "order_accepted",
  message: "Your order has been accepted by the freelancer.",
  order: order._id,
});

    console.log(
      "Order accepted:",
      order._id.toString()
    );

    // Socket notification
    const io = getIO();

    io.to(
      `user_${order.client.toString()}`
    ).emit("orderUpdated", {
      message: "Your order was accepted!",
      order,
    });

    io.to(
      `user_${order.freelancer.toString()}`
    ).emit("orderUpdated", {
      message: "Order accepted successfully.",
      order,
    });

    return res.status(200).json({
      message: "Order accepted successfully.",
      order,
    });

  } catch (error) {
    console.error(
      "ACCEPT ORDER ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to accept order.",
      error: error.message,
    });
  }
};


// =========================
// DECLINE ORDER
// =========================

const declineOrder = async (req, res) => {
  try {
    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const freelancerId =
      order.freelancer?.toString();

    const userId =
      req.user.userId?.toString();

    if (!freelancerId) {
      return res.status(400).json({
        message:
          "This order has no freelancer assigned.",
      });
    }

    if (!userId) {
      return res.status(401).json({
        message: "User ID not found.",
      });
    }

    if (freelancerId !== userId) {
      return res.status(403).json({
        message:
          "You are not authorized to decline this order.",
      });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        message:
          "Only pending orders can be declined.",
      });
    }

    order.status = "cancelled";

    await order.save();

    // =========================
    // SOCKET.IO
    // =========================

    const io = getIO();

    // Notify the client
    io.to(
      `user_${order.client.toString()}`
    ).emit("orderUpdated", {
      message: "Your order was declined.",
      order,
    });

    // Update freelancer dashboard
    io.to(
      `user_${order.freelancer.toString()}`
    ).emit("orderUpdated", {
      message: "Order declined.",
      order,
    });

    await createNotification({
  recipient: order.client,
  sender: order.freelancer,
  type: "order_declined",
  message: "Your order was declined by the freelancer.",
  order: order._id,
});

    return res.status(200).json({
      message:
        "Order declined successfully.",
      order,
    });

  } catch (error) {
    console.error(
      "DECLINE ORDER ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to decline order.",
      error: error.message,
    });
  }
};


// =========================
// COMPLETE ORDER
// =========================

const completeOrder = async (req, res) => {
  try {
    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const freelancerId =
      order.freelancer?.toString();

    const userId =
      req.user.userId?.toString();

    if (!freelancerId) {
      return res.status(400).json({
        message:
          "This order has no freelancer assigned.",
      });
    }

    if (!userId) {
      return res.status(401).json({
        message: "User ID not found.",
      });
    }

    if (freelancerId !== userId) {
      return res.status(403).json({
        message:
          "You are not authorized to complete this order.",
      });
    }

    if (order.status !== "active") {
      return res.status(400).json({
        message:
          "Only active orders can be completed.",
      });
    }

    order.status = "completed";

    await createNotification({
  recipient: order.client,
  sender: order.freelancer,
  type: "order_completed",
  message: "Your order has been completed by the freelancer.",
  order: order._id,
});

    await order.save();

    // =========================
    // SOCKET.IO
    // =========================

    const io = getIO();

    // Notify client
    io.to(
      `user_${order.client.toString()}`
    ).emit("orderUpdated", {
      message:
        "Your order has been completed!",
      order,
    });

    // Update freelancer dashboard
    io.to(
      `user_${order.freelancer.toString()}`
    ).emit("orderUpdated", {
      message:
        "Order completed successfully.",
      order,
    });

    return res.status(200).json({
      message:
        "Order completed successfully.",
      order,
    });

  } catch (error) {
    console.error(
      "COMPLETE ORDER ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to complete order.",
      error: error.message,
    });
  }
};


// =========================
// CANCEL ORDER
// =========================

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const clientId =
      order.client?.toString();

    const freelancerId =
      order.freelancer?.toString();

    const userId =
      req.user.userId?.toString();

    if (!userId) {
      return res.status(401).json({
        message: "User ID not found.",
      });
    }

    if (
      userId !== clientId &&
      userId !== freelancerId
    ) {
      return res.status(403).json({
        message:
          "You are not authorized to cancel this order.",
      });
    }

    if (
      order.status === "completed" ||
      order.status === "cancelled"
    ) {
      return res.status(400).json({
        message:
          "This order cannot be cancelled.",
      });
    }

    order.status = "cancelled";

    await order.save();

    // =========================
    // SOCKET.IO
    // =========================

    const io = getIO();

    // Notify client
    io.to(
      `user_${order.client.toString()}`
    ).emit("orderUpdated", {
      message:
        "This order has been cancelled.",
      order,
    });

    // Notify freelancer
    io.to(
      `user_${order.freelancer.toString()}`
    ).emit("orderUpdated", {
      message:
        "This order has been cancelled.",
      order,
    });

    return res.status(200).json({
      message:
        "Order cancelled successfully.",
      order,
    });

  } catch (error) {
    console.error(
      "CANCEL ORDER ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to cancel order.",
      error: error.message,
    });
  }
};

module.exports = {
  // your existing controllers...
  acceptOrder,
  declineOrder,
  createOrder,
  getMyOrders,
  updateOrderStatus,
  completeOrder,
  cancelOrder,
};
