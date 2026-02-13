const mongoose = require("mongoose");
const { Schema } = mongoose;

const MedicationSchema = new Schema(
  {
    sDate: {
      type: String,
      required: true,
    },
    patientID: {
      type: String,
      required: true,
    },
    addedBy: {
      type: String,
      required: true,
    },
    medicine: {
      type: String,
      required: true,
    },
    meditype: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    addedDate: {
      type: String,
      required: true,
    },
    pills: {
      type: Number,
      required: true,
    },
    days: {
      type: Number,
      required: true,
    },
    dayArray: {
      type: Array,
      required: true,
    },
    times: {
      type: Number,
      required: true,
    },
    frequency: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    baw: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Medication", MedicationSchema);
