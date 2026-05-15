const express = require("express");
const router = express.Router();
const { login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/login", login);           // Public: login
router.get("/me", protect, getMe);      // Protected: get current admin

module.exports = router;
