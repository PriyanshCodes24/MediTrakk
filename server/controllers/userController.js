const mongoose = require("mongoose");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const Appointment = require("../models/Appointment");
const Notification = require("../models/Notification");

const getUserProfile = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Not authorized" });
  }
  const user = await User.findById(req.user.id).select("-password");
  if (!user) return res.status(401).json({ message: "User not found" });
  return res
    .status(200)
    .json({ message: "User profile fetched successfully", user });
});

const getDoctorList = asyncHandler(async (req, res) => {
  const doctors = await User.find({ role: "doctor", isDeleted: false }).select(
    "-__v -password -role",
  );
  if (doctors.length === 0) {
    return res.status(404).json({ message: "Doctors not found" });
  }
  return res
    .status(200)
    .json({ message: "Doctor-list fetched successfully", doctors });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-__v -password");
  if (users.length === 0)
    return res.status(404).json({ message: "No users found" });

  return res
    .status(200)
    .json({ message: "User-list fetched successfully", users });
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const { name, email, contact } = req.body;

  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already in use" });
    }
  }

  if (!user) return res.status(404).json({ message: "User doesn't exist" });
  user.name = name || user.name;
  user.email = email || user.email;
  user.contact = contact || user.contact;
  const updatedUser = await user.save();
  return res
    .status(200)
    .json({ message: "User Updated Successfully", user: updatedUser });
});

const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const user = await User.findById(userId);
  if (!mongoose.Types.ObjectId.isValid(userId))
    return res.status(400).json({ message: "Invalid user ID" });

  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.role === "doctor") {
    const appointments = await Appointment.find({
      doctor: userId,
      date: { $gt: new Date() },
      status: { $in: ["pending", "approved"] },
    });

    const patientIds = [
      ...new Set(appointments.map((appt) => appt.patient.toString())),
    ];

    const notifications = patientIds.map((patientId) => ({
      user: patientId,
      type: "doctor_removed",
      message: `Your doctor ${user.name} is no longer available. You can transfer your appointments.`,
      relatedId: userId,
      onModel: "User",
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }
  }

  user.isDeleted = true;
  await user.save();

  res.status(200).json({ message: "User deleted successfully" });
});

module.exports = {
  getUserProfile,
  updateUserProfile,
  getDoctorList,
  getAllUsers,
  deleteUser,
};
