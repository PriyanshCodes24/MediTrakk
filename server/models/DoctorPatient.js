const mongoose = require("mongoose");

const doctorPatientSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

doctorPatientSchema.index({ doctor: 1, patient: 1 }, { unique: true });

module.exports = mongoose.model("DoctorPatient", doctorPatientSchema);
