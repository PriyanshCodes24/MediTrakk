const Appointment = require("../models/Appointment");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const mongoose = require("mongoose");
const DoctorPatient = require("../models/DoctorPatient");

const updateStatus = async () => {
  const now = new Date();
  try {
    const updated = await Appointment.updateMany(
      {
        status: "approved",
        date: { $lt: now },
      },
      { $set: { status: "completed" } },
    );
    console.log(`${updated.modifiedCount} appointments marked as completed.`);

    const deleted = await Appointment.deleteMany({
      status: { $in: ["rejected", "cancelled"] },
      date: { $lt: now },
    });
    console.log(`${deleted.modifiedCount} appointments marked as completed.`);
  } catch (error) {
    console.error("Status update failed:", error.message);
  }
};

const createAppointment = asyncHandler(async (req, res) => {
  const { doctor, date, reason } = req.body;

  const appointmentDate = new Date(date);
  if (isNaN(appointmentDate.getTime())) {
    return res.status(400).json({ message: "Invalid date" });
  }

  if (appointmentDate <= new Date()) {
    return res
      .status(400)
      .json({ message: "Cannot create appointment in past" });
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

  const slotStart = new Date(appointmentDate);
  const slotEnd = new Date(appointmentDate);
  slotStart.setMinutes(slotStart.getMinutes() - 15);
  slotEnd.setMinutes(slotEnd.getMinutes() + 15);

  const alreadyBooked = await Appointment.findOne({
    doctor,
    date: {
      $gte: slotStart,
      $lt: slotEnd,
    },
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
    date: appointmentDate,
    reason,
  });
  await DoctorPatient.updateOne(
    { doctor, patient },
    {},
    { upsert: true, setDefaultsOnInsert: true },
  );
  return res.status(201).json({ message: "Appointment created", appointment });
});

const getDoctorAppointments = asyncHandler(async (req, res) => {
  const doctorId = req.user.id;
  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    return res.status(400).json({ message: "Invalid Doctor ID" });
  }
  await updateStatus();
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

const getPatientAppointments = asyncHandler(async (req, res) => {
  const patient = req.user.id;
  if (!mongoose.Types.ObjectId.isValid(patient)) {
    return res.status(400).json({ message: "Invalid Patient ID" });
  }
  await updateStatus();

  const now = new Date();
  const appointments = await Appointment.find({
    patient,
    date: { $gte: now },
  })
    .sort({ date: 1 })
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
  await updateStatus();
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

  appointment.status = "cancelled";
  appointment.save();
  return res
    .status(200)
    .json({ message: "Appointment canceled successfully", appointment });
});

const updateAppointmentStatus = (newStatus) =>
  asyncHandler(async (req, res) => {
    const user = req.user.id;
    const appointmentId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(appointmentId))
      return res.status(400).json({ message: "Invalid Appointment ID" });

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    if (appointment.status !== "pending")
      return res
        .status(400)
        .json({ message: "Appointment is not in pending state" });

    if (appointment.doctor.toString() !== user)
      return res
        .status(403)
        .json({ message: "Not authorized to approve this appointment" });

    appointment.status = newStatus;
    await appointment.save();
    res.status(200).json({
      message: `Appointment ${newStatus} successfully`,
      appointment,
    });
  });

module.exports = {
  createAppointment,
  getDoctorAppointments,
  updateAppointmentStatus,
  getPatientAppointments,
  getAllAppointments,
  cancelAppointment,
};
