const Appointment = require("../models/Appointment");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const mongoose = require("mongoose");

const createAppointment = asyncHandler(async (req, res) => {
  const { doctor, date, time, reason } = req.body;
  if (!mongoose.Types.ObjectId.isValid(doctor)) {
    return res.status(400).json({ message: "Invalid Doctor ID" });
  }
  const doctorExists = await User.findOne({
    _id: doctor,
    role: "doctor",
  }).lean();
  if (!doctorExists)
    return res.status(404).json({ message: "Doctor not found" });

  const patient = req.user.id;
  const appointment = new Appointment({
    patient,
    doctor,
    date,
    time,
    reason,
  });
  await appointment.save();
  return res.status(201).json({ message: "Appointment created", appointment });
});

const getDoctorAppointments = asyncHandler(async (req, res) => {
  const doctorId = req.user.id;
  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    return res.status(400).json({ message: "Invalid Doctor ID" });
  }
  const appointments = await Appointment.find({ doctor: doctorId })
    .lean()
    .populate("patient", "name email")
    .select("-__v");
  if (appointments.length === 0) {
    return res.status(404).json({ message: "No appointments found" });
  }

  return res.status(200).json({
    message: "Appointments fetched successfully",
    appointments,
  });
});

const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const doctor = req.user.id;
  const { appointmentId } = req.params;
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status))
    return res.status(400).json({ message: "Invalid status value" });

  if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
    return res.status(400).json({ message: "Invalid Doctor ID" });
  }
  const appointment = await Appointment.findOne({
    _id: appointmentId,
    doctor,
  }).lean();

  if (!appointment)
    return res.status(404).json({ message: "Appointment not found" });

  appointment.status = status;
  await appointment.save();

  return res.status(200).json({
    message: `Appointment status was updated to '${status}' successfully`,
    appointment,
  });
});

const getPatientAppointments = asyncHandler(async (req, res) => {
  const patient = req.user.id;
  if (!mongoose.Types.ObjectId.isValid(patient)) {
    return res.status(400).json({ message: "Invalid Patient ID" });
  }
  const appointments = await Appointment.find({ patient })
    .lean()
    .select("-__v")
    .populate("doctor", "name email");
  if (appointments.length === 0)
    return res.status(404).json({ message: "No appointments found" });
  return res
    .status(200)
    .json({ message: "Appointments Fetched Successfully", appointments });
});

const getAllAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find()
    .lean()
    .populate("patient doctor", "name email")
    .select("-__v");
  if (appointments.length === 0)
    return res.status(404).json({ message: "No appointments found" });
  return res
    .status(200)
    .json({ message: "Appointments Fetched Successfully", appointments });
});

module.exports = {
  createAppointment,
  getDoctorAppointments,
  updateAppointmentStatus,
  getPatientAppointments,
  getAllAppointments,
};
