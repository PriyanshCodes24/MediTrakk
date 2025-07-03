const Appointment = require("../models/Appointment");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const mongoose = require("mongoose");

const createAppointment = asyncHandler(async (req, res) => {
  const { doctor, date, time, reason } = req.body;

  const [day, month, year] = date.split("-");
  const formattedDate = new Date(`${year}-${month}-${day}`);
  if (isNaN(formattedDate.getTime())) {
    return res.status(400).json({ message: "Invalid date" });
  }

  if (!mongoose.Types.ObjectId.isValid(doctor)) {
    return res.status(400).json({ message: "Invalid Doctor ID" });
  }
  const doctorExists = await User.findOne({
    _id: doctor,
    role: "doctor",
  }).lean();
  if (!doctorExists)
    return res.status(404).json({ message: "Doctor not found" });

  const alreadyBooked = await Appointment.findOne({
    doctor,
    date: formattedDate,
    time,
  });
  if (alreadyBooked) {
    return res
      .status(400)
      .json({ message: "Doctor already has an appointment at this time" });
  }
  const patient = req.user.id;
  const appointment = await Appointment.create({
    patient,
    doctor,
    date: formattedDate,
    time,
    reason,
  });
  // await appointment.save();
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
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const appointments = await Appointment.find({
    patient,
    $expr: {
      $gte: [{ $dateTrunc: { date: "$date", unit: "day" } }, today],
    },
  })
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

const cancelAppointment = asyncHandler(async (req, res) => {
  const user = req.user.id;
  const role = req.user.role;
  const appointmentId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(appointmentId))
    return res.status(400).json({ message: "Invalid Appointment ID" });

  const appointment = await Appointment.findById(appointmentId);
  if (!appointment)
    return res.status(404).json({ message: "Appointment not found" });

  if (
    role !== "admin" &&
    ((role === "patient" && appointment.patient.toString() !== user) ||
      (role === "doctor" && appointment.doctor.toString() !== user))
  )
    return res
      .status(403)
      .json({ message: "Not authorized to cancel this appointment" });

  await appointment.deleteOne();
  return res
    .status(200)
    .json({ message: "Appointment deleted successfully", appointment });
});

module.exports = {
  createAppointment,
  getDoctorAppointments,
  updateAppointmentStatus,
  getPatientAppointments,
  getAllAppointments,
  cancelAppointment,
};
