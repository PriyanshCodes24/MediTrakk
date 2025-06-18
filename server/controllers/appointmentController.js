const Appointment = require("../models/Appointment");

const createAppointment = async (req, res) => {
  try {
    const { doctor, date, time, reason } = req.body;
    const patient = req.user.id;
    const appointment = new Appointment({
      patient,
      doctor,
      date,
      time,
      reason,
    });
    await appointment.save();
    return res
      .status(201)
      .json({ message: "Appointment created", appointment });
  } catch (e) {
    console.error(e.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { createAppointment };
