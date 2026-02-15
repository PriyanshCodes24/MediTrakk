const express = require("express");
const router = express.Router();
const { protect, authorizeRole } = require("../middleware/authMiddleware");
const {
  createAppointment,
  getDoctorAppointments,
  updateAppointmentStatus,
  getPatientAppointments,
  getAllAppointments,
  cancelAppointment,
} = require("../controllers/appointmentController");
const { body } = require("express-validator");
const validateRequest = require("../middleware/validateRequest");

router.post(
  "/",
  protect,
  authorizeRole("patient"),
  [
    body("doctor")
      .trim()
      .notEmpty()
      .withMessage("Doctor ID is required")
      .isMongoId()
      .withMessage("Invalid Doctor ID"),
    body("reason")
      .notEmpty()
      .withMessage("Reason is required")
      .isString()
      .trim()
      .isLength({ max: 200 })
      .withMessage("Reason must be a string under 200 characters"),
  ],
  validateRequest,
  createAppointment
);
router.get("/", protect, authorizeRole("admin"), getAllAppointments);
router.get("/doctor", protect, authorizeRole("doctor"), getDoctorAppointments);
router.get(
  "/patient",
  protect,
  authorizeRole("patient"),
  getPatientAppointments
);

router.patch(
  "/:id/cancel",
  protect,
  authorizeRole("patient", "doctor", "admin"),
  cancelAppointment
);

router.patch(
  "/:id/approve",
  protect,
  authorizeRole("doctor"),
  updateAppointmentStatus("approved")
);
router.patch(
  "/:id/reject",
  protect,
  authorizeRole("doctor"),
  updateAppointmentStatus("rejected")
);

module.exports = router;
