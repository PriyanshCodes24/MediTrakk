const mongoose = require("mongoose");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

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
  const doctors = await User.find({ role: "doctor" }).select(
    "-__v -password -role"
  );
  if (doctors.length === 0) {
    return res.status(404).json({ message: "Doctors not found" });
  }
  return res
    .status(200)
    .json({ message: "Doctor-list fetched successfully", doctors });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  if (users.length === 0)
    return res.status(404).json({ message: "No users found" });

  return res
    .status(200)
    .json({ message: "User-list fetched successfully", users });
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const { name, email } = req.body;

  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already in use" });
    }
  }

  if (!user) return res.status(404).json({ message: "User doesn't exist" });
  user.name = name || user.name;
  user.email = email || user.email;
  const updatedUser = await user.save();
  return res
    .status(200)
    .json({ message: "User Updated Successfully", user: updatedUser });
});
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!mongoose.Types.ObjectId.isValid(user))
    return res.status(400).json({ message: "Invalid user ID" });

  if (!user) return res.status(404).json({ message: "User not found" });

  await user.deleteOne();

  return res.status(200).json({ message: "User deleted successfully", user });
});

const makeDoctor = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.role === "doctor") {
    return res.status(400).json({ message: "User is already a doctor" });
  }

  user.role = "doctor";
  await user.save();
  return res.status(200).json({
    message: `${user.name} has been promoted to doctor`,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

module.exports = {
  getUserProfile,
  updateUserProfile,
  getDoctorList,
  getAllUsers,
  makeDoctor,
  deleteUser,
};
