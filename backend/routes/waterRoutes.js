const express = require("express");
const router = express.Router();
const {
  addWaterData,
  getWaterData,
  getLatestData,
  getStats,
  deleteWaterData,
} = require("../controllers/waterController");
const { protect } = require("../middleware/authMiddleware");

// Public routes (accessible by ESP32 and frontend)
router.post("/add", addWaterData);          // ESP32 sends data here
router.get("/", getWaterData);              // Get all data with pagination
router.get("/latest", getLatestData);       // Get latest reading
router.get("/stats", getStats);             // Get statistics

// Protected routes (admin only)
router.delete("/:id", protect, deleteWaterData);

module.exports = router;
