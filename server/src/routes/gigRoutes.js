const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  createGig,
  getGigs,
  getGig,
  updateGig,
  deleteGig
} = require("../controller/gigController");

const router = express.Router();

router.post("/", protect, createGig);

router.get("/", getGigs);

router.get("/:id", getGig);

router.put("/:id", protect, updateGig);

router.delete("/:id", protect, deleteGig);

module.exports = router;