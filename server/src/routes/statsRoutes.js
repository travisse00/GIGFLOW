const express = require("express");

const {
  getPlatformStats,
} = require("../controller/statsController");

const router = express.Router();

router.get("/", getPlatformStats);

module.exports = router;