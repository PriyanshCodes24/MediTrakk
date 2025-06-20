const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role = "patient" } = req.body;
  if (role === "admin") {
    return res.status(403).json({ message: "You cannot register as admin" });
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    name: name,
    email: email,
    password: hashedPassword,
    role: role,
  });

  await newUser.save();

  return res.status(201).send("User Registerd Successfully");
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return res.status(401).json({ message: "Wrong Password" });

  const token = await jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return res.status(200).json({
    message: "Login Successfully",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

module.exports = { registerUser, loginUser };
