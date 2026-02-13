const AppointmentIncident = require("../../models/MedicalIncidentModels/Appointment-IncidentModel");
const MedicalRecord = require("../../models/medicalRecord");
const mongoose = require("mongoose");

const createAppointmentIncident = async (req, res) => {
  try {
    const {
      recordID,
      doctorID,
      doctorName,
      appointmentType,
      description,
      appointmentDateTime,
      addedDate
    } = req.body;

    var customDocID = doctorID;

    // *Validation
    if (
      !recordID ||
      (!doctorID && !doctorName) ||
      !appointmentType ||
      !appointmentDateTime ||
      !addedDate
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if the recordID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(recordID)) {
      return res.status(400).json({ error: "Invalid record ID" });
    }

    // Check if the doctorID is a valid ObjectId
    if (doctorID && !mongoose.Types.ObjectId.isValid(doctorID)) {
      console.log("Invalid doctor ID", doctorID);
      return res.status(400).json({ error: "Invalid doctor ID" });
    } else {
      // If doctorID is not provided, set customDocID to null
      customDocID = null;
    }

    // Check if a document with the provided recordID exists
    const currentRecord = await MedicalRecord.findOne({
      _id: recordID,
    });

    if (!currentRecord) {
      return res.status(400).json({ error: "Record does not exist" });
    }

    const currentAppointmentIncident = new AppointmentIncident({
      recordID,
      customDocID, // If doctorID is not provided, customDocID will be null
      doctorName,
      appointmentType,
      description,
      appointmentDateTime,
      addedDate
    });

    // Save the updated incident document
    await currentAppointmentIncident.save();

    // console.log(currentRecord.incidents)

    // Add the incident to the record
    currentRecord.incidents.appointmentIncidents.push(
      currentAppointmentIncident._id
    );
    await currentRecord.save();

    res.status(200).json({ message: "Incident saved successfully" });
  } catch (error) {
    console.error("Error saving incident:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteAppointmentIncident = async (req, res) => {
  try {
    const { incidentID, recordID } = req.params;

    // Check if the incidentID and recordID are valid ObjectId
    if (
      !mongoose.Types.ObjectId.isValid(incidentID) ||
      !mongoose.Types.ObjectId.isValid(recordID)
    ) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    // Find and remove the appointment incident
    const incident = await AppointmentIncident.findByIdAndDelete(incidentID);
    if (!incident) {
      return res.status(404).json({ error: "Incident not found" });
    }

    // Remove the incident reference from the medical record
    const record = await MedicalRecord.findById(recordID);
    if (!record) {
      return res.status(404).json({ error: "Record not found" });
    }

    record.incidents.appointmentIncidents.pull(incidentID);
    await record.save();

    res.status(200).json({ message: "Incident deleted successfully" });
  } catch (error) {
    console.error("Error deleting incident:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createAppointmentIncident,
  deleteAppointmentIncident,
};
