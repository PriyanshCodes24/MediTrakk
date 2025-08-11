const User = require("../models/User");
const Appointment = require("../models/Appointment");
const Report = require("../models/Report");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const getAdminStats = asyncHandler(async (req, res) => {
  const users = await User.countDocuments();
  const doctors = await User.countDocuments({ role: "doctor" });
  const patients = await User.countDocuments({ role: "patient" });
  const reports = await Report.countDocuments();
  const appointments = await Appointment.countDocuments();
  const cancelledAppointments = await Appointment.countDocuments({
    status: "cancelled",
  });
  const pendingAppointments = await Appointment.countDocuments({
    status: "pending",
  });
  const approvedAppointments = await Appointment.countDocuments({
    status: "approved",
  });
  const rejectedAppointments = await Appointment.countDocuments({
    status: "rejected",
  });
  const completedAppointments = await Appointment.countDocuments({
    status: "completed",
  });

  return res.status(200).json({
    message: "Stats fetched successfully",
    users,
    doctors,
    patients,
    reports,
    appointments,
    cancelledAppointments,
    pendingAppointments,
    approvedAppointments,
    rejectedAppointments,
    completedAppointments,
  });
});

const getUserById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "Invalid Target User ID" });
  const user = await User.findById(id).select("-__v");
  if (!user) return res.status(404).json({ message: "User not found" });

  res
    .status(200)
    .json({ message: "User Data Fetched Successfully", user: user });
});

const changeRole = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const validRoles = ["admin", "doctor", "patient"];
  const newRole = req.body.role?.toLowerCase();
  const user = req.user;

  if (!validRoles.includes(newRole)) {
    return res.status(400).json({ message: "Invalid role selected" });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  const target = await User.findById(userId);
  if (!target) return res.status(404).json({ message: "User not found" });

  if (target.role === newRole) {
    return res.status(400).json({ message: `User is already an ${newRole}` });
  }

  target.role = newRole;
  await target.save();
  return res.status(200).json({
    message: `${target.name}'s role is changed to ${target.role} by ${user.name}`,
    user: {
      id: target._id,
      name: target.name,
      email: target.email,
      role: target.role,
    },
  });
});

module.exports = {
  getAdminStats,
  changeRole,
  getUserById,
};
