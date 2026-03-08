const Appointment = require("../models/Appointment");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const mongoose = require("mongoose");
const DoctorPatient = require("../models/DoctorPatient");
const Notification = require("../models/Notification");

const updateStatus = async () => {
  const now = new Date();
  try {
    await Appointment.updateMany(
      {
        status: "approved",
        date: { $lt: now },
      },
      { $set: { status: "completed" } },
    );

    await Appointment.deleteMany({
      status: { $in: ["rejected", "cancelled"] },
      date: { $lt: now },
    });
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

  const now = new Date();
  now.setHours(0, 0);

  if (appointmentDate.getTime() <= now.getTime()) {
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

  const appointmentExists = await Appointment.findOne({
    patient: req.user.id,
    doctor,
    date: appointmentDate,
    status: { $in: ["pending", "approved"] },
  });

  if (appointmentExists) {
    return res.status(400).json({
      message: "You already have an appointment at this time  with this doctor",
    });
  }

  const MAX_APPOINTMENTS_PER_SLOT = 3;

  const minutes = appointmentDate.getMinutes();
  appointmentDate.setMinutes(minutes < 30 ? 0 : 30, 0, 0);

  const slotStart = new Date(appointmentDate);

  const slotEnd = new Date(slotStart);
  slotEnd.setMinutes(slotEnd.getMinutes() + 30);

  const count = await Appointment.countDocuments({
    doctor,
    date: {
      $gte: slotStart,
      $lt: slotEnd,
    },
    status: {
      $in: ["pending", "approved"],
    },
  });

  if (count >= MAX_APPOINTMENTS_PER_SLOT) {
    return res.status(400).json({ message: "This time slot is fully booked" });
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

  await Notification.create({
    user: req.user.role === "doctor" ? appointment.patient : appointment.doctor,
    type: "appointment_status",
    relatedId: appointmentId,
    onModel: "Appointment",
    message: "Your appointment has been cancelled",
  });
  return res
    .status(200)
    .json({ message: "Appointment canceled successfully", appointment });
});

const getAvailability = async (req, res) => {
  const { date, doctor } = req.query;

  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);

  const appointments = await Appointment.find({
    doctor,
    date: {
      $gte: startDate,
      $lt: endDate,
    },
    status: { $in: ["pending", "approved"] },
  });

  const slotCounts = {};

  appointments.forEach((appt) => {
    const d = appt.date;

    const time = d.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    slotCounts[time] = (slotCounts[time] || 0) + 1;
  });

  res.json({ slotCounts });
};

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

    await Notification.create({
      user: appointment.patient,
      type: "appointment_status",
      message: `Your appointment has been ${newStatus}`,
      relatedId: appointmentId,
      onModel: "Appointment",
    });
  });

const transferAppointments = asyncHandler(async (req, res) => {
  const { oldDoctorId, newDoctorId } = req.body;
  const patientId = req.user.id;

  const MAX_PER_SLOT = 3;

  const appointments = await Appointment.find({
    patient: patientId,
    doctor: oldDoctorId,
    date: { $gt: new Date() },
    status: { $in: ["pending", "approved"] },
  });

  const transferred = [];
  const failed = [];

  for (const appt of appointments) {
    const slotStart = new Date(appt.date);
    slotStart.setSeconds(0, 0);

    const slotEnd = new Date(slotStart);
    slotEnd.setMinutes(slotEnd.getMinutes() + 30);

    const count = await Appointment.countDocuments({
      doctor: newDoctorId,
      date: {
        $gte: slotStart,
        $lt: slotEnd,
      },
      status: { $in: ["pending", "approved"] },
    });

    if (count >= MAX_PER_SLOT) {
      failed.push(appt._id);
      continue;
    }

    appt.doctor = newDoctorId;
    await appt.save();

    transferred.push(appt._id);
  }

  await Notification.updateMany(
    {
      user: patientId,
      type: "doctor_removed",
      relatedId: oldDoctorId,
    },
    { $set: { read: true } },
  );

  res.json({
    message: "Transfer completed",
    transferred,
    failed,
  });
});

module.exports = {
  createAppointment,
  getDoctorAppointments,
  updateAppointmentStatus,
  getPatientAppointments,
  getAllAppointments,
  cancelAppointment,
  getAvailability,
  transferAppointments,
};
