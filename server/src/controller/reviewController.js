const Review = require("../models/reviewModel");
const Order = require("../models/Order");
const createNotification = require("../utils/createNotification");

/*
========================================
CREATE REVIEW
========================================
*/

const createReview = async (req, res) => {
  try {
    const { orderId, rating, comment } = req.body;

    if (!orderId || !rating) {
      return res.status(400).json({
        message: "Order ID and rating are required.",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5.",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    /*
    Only the client who placed the order
    can review the freelancer.
    */

    const clientId =
      order.client?._id?.toString() ||
      order.client?.toString();

    const userId =
      req.user.userId?.toString() ||
      req.user.id?.toString() ||
      req.user._id?.toString();

    if (!clientId || clientId !== userId) {
      return res.status(403).json({
        message: "Only the client can review this order.",
      });
    }

    /*
    Only completed orders can be reviewed.
    */

    if (order.status !== "completed") {
      return res.status(400).json({
        message: "You can only review completed orders.",
      });
    }

    /*
    Prevent duplicate reviews.
    */

    const existingReview = await Review.findOne({
      order: orderId,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this order.",
      });
    }

    const freelancerId =
      order.freelancer?._id ||
      order.freelancer;

    if (!freelancerId) {
      return res.status(400).json({
        message: "Freelancer not found for this order.",
      });
    }

    const review = await Review.create({
      order: orderId,
      reviewer: userId,
      freelancer: freelancerId,
      rating,
      comment: comment || "",
    });

    const populatedReview =
      await Review.findById(review._id)
        .populate("reviewer", "name profileImage")
        .populate("freelancer", "name profileImage");

    await createNotification({
  recipient: freelancerId,
  sender: userId,
  type: "new_review",
  message: `You received a ${rating}-star review.`,
  order: orderId,
  review: review._id,
});

    res.status(201).json({
      message: "Review created successfully.",
      review: populatedReview,
    });
  } catch (error) {
    console.error(
      "CREATE REVIEW ERROR:",
      error
    );

    res.status(500).json({
      message: "Server error.",
    });
  }
};

/*
========================================
GET FREELANCER REVIEWS
========================================
*/

const getFreelancerReviews = async (req, res) => {
  try {
    const { userId } = req.params;

    const reviews = await Review.find({
      freelancer: userId,
    })
      .populate("reviewer", "name profileImage")
      .sort({ createdAt: -1 });

    res.json({
      reviews,
    });
  } catch (error) {
    console.error(
      "GET FREELANCER REVIEWS ERROR:",
      error
    );

    res.status(500).json({
      message: "Server error.",
    });
  }
};

/*
========================================
GET MY REVIEW FOR AN ORDER
========================================
*/

const getOrderReview = async (req, res) => {
  try {
    const { orderId } = req.params;

    const review = await Review.findOne({
      order: orderId,
      reviewer: req.user.userId,
    }).populate("reviewer", "name profileImage");

    res.json({
      review: review || null,
    });
  } catch (error) {
    console.error(
      "GET ORDER REVIEW ERROR:",
      error
    );

    res.status(500).json({
      message: "Server error.",
    });
  }
};

module.exports = {
  createReview,
  getFreelancerReviews,
  getOrderReview,
};