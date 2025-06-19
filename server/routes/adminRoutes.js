const express = require("express");
const router = express.Router();
const {
  getAdminStats,
  createAdmin,
} = require("../controllers/adminController");
const { protect, authorizeRole } = require("../middleware/authMiddleware");

router.get("/stats", protect, authorizeRole("admin"), getAdminStats);
router.post("/create-admin", protect, authorizeRole("admin"), createAdmin);

module.exports = router;
