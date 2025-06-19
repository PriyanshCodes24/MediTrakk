const express = require("express");
const router = express.Router();
const { getAdminStats } = require("../controllers/adminController");
const { protect, authorizeRole } = require("../middleware/authMiddleware");

router.get("/stats", protect, authorizeRole("admin"), getAdminStats);

module.exports = router;
