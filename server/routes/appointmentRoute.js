const express = require("express");
const router = express.Router();
const { protect, authorizeRole } = require("../middleware/authMiddleware");
const {
  createAppointment,
  getDoctorAppointments,
  updateAppointmentStatus,
} = require("../controllers/appointmentController");

router.post("/", protect, authorizeRole("patient"), createAppointment);
router.get("/doctor", protect, authorizeRole("doctor"), getDoctorAppointments);
router.put(
  "/:appointmentId/status",
  protect,
  authorizeRole("doctor"),
  updateAppointmentStatus
);

module.exports = router;
