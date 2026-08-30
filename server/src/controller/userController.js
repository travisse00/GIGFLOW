const User = require("../models/User");
const Gig = require("../models/Gig");
const mongoose = require("mongoose");


// ========================================
// GET LOGGED-IN USER PROFILE
// ========================================

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      user,
    });
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ========================================
// GET ANY USER PROFILE
// ========================================

const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const gigs = await Gig.find({
      freelancer: id,
    }).sort({
      createdAt: -1,
    });

    res.json({
      user,
      gigs,
    });
  } catch (error) {
    console.error("GET USER PROFILE ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ========================================
// UPDATE MY PROFILE
// ========================================

const updateProfile = async (req, res) => {
  try {
    const { name, bio, profileImage } = req.body;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Update only fields that were provided
    if (name !== undefined) {
      user.name = name.trim();
    }

    if (bio !== undefined) {
      user.bio = bio.trim();
    }

    if (profileImage !== undefined) {
      user.profileImage = profileImage.trim();
    }

    await user.save();

    const updatedUser = await User.findById(
      req.user.userId
    ).select("-password");

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  getProfile,
  getUserProfile,
  updateProfile,
};