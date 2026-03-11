const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getNotifications,
  clearNotifications,
  markAllAsRead,
  readNotification,
} = require("../controllers/notificationController");
const router = express.Router();

router.get("/", protect, getNotifications);
router.delete("/", protect, clearNotifications);
router.patch("/:id/read", protect, readNotification);
router.patch("/mark-all-read", protect, markAllAsRead);

module.exports = router;
