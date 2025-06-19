const User = require("../models/User");
const asyncHandler = require("express-async-handler");

const getUserProfile = asyncHandler((req, res) => {
  const user = req.user;
  if (!user) return res.status(401).json({ message: "User not found" });
  return res
    .status(200)
    .json({ message: "User profile fetched successfully", user: user });
});
const updateUserProfile = asyncHandler(async (req, res) => {
  // try {
  const user = await User.findById(req.user.id);
  const { name, email } = req.body;

  if (!user) return res.status(404).json({ message: "User doesn't exist" });
  user.name = name || user.name;
  user.email = email || user.email;
  const updatedUser = await user.save();
  return res
    .status(200)
    .json({ message: "User Updated Successfully", user: updatedUser });
  // } catch (e) {
  //   console.error(e.message);
  //   return res.status(500).json({ message: "Server Error" });
  // }
});

module.exports = { getUserProfile, updateUserProfile };
