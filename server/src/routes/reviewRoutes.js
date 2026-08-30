const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  createReview,
  getFreelancerReviews,
  getOrderReview,
} = require("../controller/reviewController");

const router = express.Router();

/*
Create a review
POST /api/reviews
*/

router.post(
  "/",
  protect,
  createReview
);

/*
Get reviews for a freelancer
GET /api/reviews/freelancer/:userId
*/

router.get(
  "/freelancer/:userId",
  getFreelancerReviews
);

/*
Get review for an order
GET /api/reviews/order/:orderId
*/

router.get(
  "/order/:orderId",
  protect,
  getOrderReview
);

module.exports = router;