const express = require("express");
const router = express.Router();
const { protect, authorizeRole } = require("../middleware/authMiddleware");
const { createAppointment } = require("../controllers/appointmentController");

router.post("/", protect, authorizeRole("patient"), createAppointment);

module.exports = router;
