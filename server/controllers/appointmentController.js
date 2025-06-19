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

const getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const appointments = await Appointment.find({ doctor: doctorId }).populate(
      "patient",
      "name email"
    );
    return res.status(200).json({ appointments });
  } catch (e) {
    console.error(err.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

const updateAppointmentStatus = async (req, res) => {
  const doctor = req.user.id;
  const { appointmentId } = req.params;
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status))
    return res.status(400).json({ message: "Invalid status value" });

  const appointment = await Appointment.findOne({ _id: appointmentId, doctor });

  if (!appointment)
    return res.status(400).json({ message: "Appointment not found" });

  appointment.status = status;
  await appointment.save();

  return res.status(200).json({
    message: `Appointment status was updated to '${status}' successfully`,
    appointment,
  });
};

module.exports = {
  createAppointment,
  getDoctorAppointments,
  updateAppointmentStatus,
};
