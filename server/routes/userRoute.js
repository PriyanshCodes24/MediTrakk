const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");

router.get("/me", protect, getUserProfile);
router.put("/update", protect, updateUserProfile);

module.exports = router;
