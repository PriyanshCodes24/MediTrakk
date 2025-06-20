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
    body("date")
      .trim()
      .notEmpty()
      .withMessage("Date is required")
      .matches(/^\d{2}-\d{2}-\d{4}$/)
      .withMessage("Date must be in DD-MM-YYYY format"),
    body("time")
      .trim()
      .notEmpty()
      .withMessage("Time is required")
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage("Time must be in HH:mm format (24-hour clock)"),
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
router.put(
  "/:appointmentId/status",
  protect,
  authorizeRole("doctor"),
  [
    body("status")
      .trim()
      .notEmpty()
      .withMessage("Mention a Status")
      .isIn(["approved", "rejected"])
      .withMessage("Status must be either approved or rejected"),
  ],
  validateRequest,
  updateAppointmentStatus
);

module.exports = router;
