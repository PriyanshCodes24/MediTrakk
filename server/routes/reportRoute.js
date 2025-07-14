const express = require("express");
const router = express.Router();
const {
  uploadReportController,
  getReportController,
  getPatientReports,
  getDoctorReports,
  deleteReport,
} = require("../controllers/reportController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");

router.post(
  "/upload",
  protect,
  upload.single("report"),
  uploadReportController
);

router.get("/user/:id", protect, getReportController);
router.get("/patient", protect, getPatientReports);
router.get("/doctor", protect, getDoctorReports);
router.delete("/:id", protect, deleteReport);

module.exports = router;
