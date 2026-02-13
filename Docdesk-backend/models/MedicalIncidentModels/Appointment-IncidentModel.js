const mongoose = require("mongoose");
const { Schema } = mongoose;

const AppointmentIncidentSchema = new Schema(
  {
    recordID: {
      type: Schema.Types.ObjectId,
      ref: "MedicalRecord",
      required: true,
    },
    doctorID: {
      type: Schema.Types.ObjectId || String,
      ref: "Doctor",
    },
    doctorName: {
      type: String,
    },
    appointmentDateTime: {
      type: Date,
      required: true,
    },
    appointmentType: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    addedDate: {
      type: Date,
      required: true,
    },


  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "AppointmentIncident",
  AppointmentIncidentSchema
);
