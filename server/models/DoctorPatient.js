const mongoose = require("mongoose");

const doctorPatientSchema = mongoose.Schema(
  {
    patient: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      //   required: true,
      unique: true,
    },
    doctor: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      //   required: true,
      unique: true,
    },
  },
  { doctor: 1, patient: 1 }
);
