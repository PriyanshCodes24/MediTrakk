const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { getNotifications, clearNotifications } = require("../controllers/notificationController");
const router = express.Router();

router.get("/", protect, getNotifications);
router.delete("/", protect, clearNotifications);
router.put("/:id/read", protect);
router.put("/mark-all-read", protect);

module.exports = router;
