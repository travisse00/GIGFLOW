const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  getProfile,
  getUserProfile,
  updateProfile,
} = require("../controller/userController");

const router = express.Router();


// Logged-in user's own profile
router.get(
  "/profile",
  protect,
  getProfile
);


// Update logged-in user's profile
router.patch(
  "/profile",
  protect,
  updateProfile
);


// View another user's profile
router.get(
  "/:id",
  getUserProfile
);


module.exports = router;