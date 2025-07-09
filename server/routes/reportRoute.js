const express = require("express");
const router = express.Router();
const {
  uploadReportController,
  getReportController,
  getReports,
} = require("../controllers/reportController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");

router.post(
  "/upload",
  protect,
  upload.single("report"),
  uploadReportController
);

router.get("/:id", protect, getReportController);
router.get("/", protect, getReports);

module.exports = router;
