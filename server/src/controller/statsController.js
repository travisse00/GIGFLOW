const User = require("../models/User");
const Gig = require("../models/Gig");
const Order = require("../models/Order");

const getPlatformStats = async (req, res) => {
  try {
    const [
      freelancers,
      gigs,
      completedOrders,
      totalOrders,
    ] = await Promise.all([
      User.countDocuments({
        role: "freelancer",
      }),

      Gig.countDocuments(),

      Order.countDocuments({
        status: "completed",
      }),

      Order.countDocuments(),
    ]);

    res.json({
      freelancers,
      gigs,
      completedOrders,
      totalOrders,
    });
  } catch (error) {
    console.error("PLATFORM STATS ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getPlatformStats,
};