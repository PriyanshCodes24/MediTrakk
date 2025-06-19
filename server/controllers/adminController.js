const User = require("../models/User");
const Appointment = require("../models/Appointment");
const asyncHandler = require("express-async-handler");

const getAdminStats = asyncHandler(async (req, res) => {
  //   try {
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
  //   } catch (e) {
  //     console.error(e.message);
  //     return res.status(500).json({ message: "server error" });
  //   }
});

module.exports = { getAdminStats };
