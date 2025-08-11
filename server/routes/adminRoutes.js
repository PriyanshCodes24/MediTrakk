const express = require("express");
const router = express.Router();
const {
  getAdminStats,
  changeRole,
  getUserById,
} = require("../controllers/adminController");
const { protect, authorizeRole } = require("../middleware/authMiddleware");

router.get("/user/:id", protect, authorizeRole("admin"), getUserById);

router.get("/stats", protect, authorizeRole("admin"), getAdminStats);
router.patch("/:id/change-role", protect, authorizeRole("admin"), changeRole);

module.exports = router;
