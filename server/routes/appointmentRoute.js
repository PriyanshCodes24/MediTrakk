const express = require("express");
const router = express.Router();
const { protect, authorizeRole } = require("../middleware/authMiddleware");
const {
  createAppointment,
  getDoctorAppointments,
  updateAppointmentStatus,
  getPatientAppointments,
  getAllAppointments,
} = require("../controllers/appointmentController");

router.post("/", protect, authorizeRole("patient"), createAppointment);
router.get("/", protect, authorizeRole("admin"), getAllAppointments);
router.get("/doctor", protect, authorizeRole("doctor"), getDoctorAppointments);
router.get(
  "/patient",
  protect,
  authorizeRole("patient"),
  getPatientAppointments
);
router.put(
  "/:appointmentId/status",
  protect,
  authorizeRole("doctor"),
  updateAppointmentStatus
);

module.exports = router;
