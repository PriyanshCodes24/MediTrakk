const User = require("../models/User");
const Appointment = require("../models/Appointment");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const getAdminStats = asyncHandler(async (req, res) => {
  const users = await User.countDocuments();
  const doctors = await User.countDocuments({ role: "doctor" });
  const patients = await User.countDocuments({ role: "patient" });
  const appointments = await Appointment.countDocuments();

  return res.status(200).json({
    message: "Stats fetched successfully",
    users,
    doctors,
    patients,
    appointments,
  });
});

const createAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const role = "admin";
  const userExists = await User.findOne({ email });
  if (userExists)
    return res.status(400).json({ message: "User already exists" });

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new User({ name, email, password: hashedPassword, role });
  await user.save();
  return res.status(201).json({ message: "Created Successfully" });
});

module.exports = { getAdminStats, createAdmin };
