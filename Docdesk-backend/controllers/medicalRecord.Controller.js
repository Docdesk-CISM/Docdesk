const MedicalRecord = require("../models/medicalRecord");
const Patient = require("../models/Patient");
const mongoose = require("mongoose");

const createRecord = async (req, res) => {
  try {
    const { recordName, recordDescription, date, patientID } = req.body;

    // *Validation

    // Check if all fields are provided
    if (!recordName || !recordDescription || !date || !patientID) {
      return res.status(400).json({ error: "All fields are required" });
    }
    // Check if the patientID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(patientID)) {
      return res.status(400).json({ error: "Invalid patient ID" });
    }

    // Check if a document with the provided recordName and recordDescription exists
    let medicalRecordVal = await MedicalRecord.findOne({
      recordName,
    });

    if (medicalRecordVal) {
      return res.status(400).json({ error: "Record already exists" });
    }

    // If no document is found, create a new one
    medicalRecordVal = new MedicalRecord({
      recordName: recordName,
      description: recordDescription,
      patientID: patientID,
      recordDate: date,
    });

    // Save the updated document
    await medicalRecordVal.save();

    const patient = await Patient.findOneAndUpdate(
      { _id: patientID },
      {
        $addToSet: { medicalRecords: medicalRecordVal._id },
      }
    );

    res.status(200).json({ message: "Medical Record saved successfully" });
  } catch (error) {
    console.error("Error saving medical record:", error.message);
    res
      .status(500)
      .json({ error: "Internal server error : Medical Record Creation" });
  }
};

const getAllRecordsOfPatient = async (req, res) => {
  try {
    const { patientID } = req.query;

    // Validation
    if (!patientID) {
      console.log("Patient ID is required");
      return res.status(400).json({ error: "Patient ID is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(patientID)) {
      console.log("Invalid patient ID");
      return res.status(400).json({ error: "Invalid patient ID" });
    }

    console.log("Fetching Records");

    const patientRecords = await Patient.findOne({ _id: patientID })
      .populate({
        path: "medicalRecords",
      })
      .select("medicalRecords");

    if (!patientRecords) {
      console.log("No records found");
      return res.status(400).json({ error: "No records found" });
    }

    // console.log("Records fetched:", patientRecords);
    res.status(200).json({ patientRecords });
  } catch (error) {
    console.error("Error fetching tests:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getRecord = async (req, res) => {
  try {
    const { recordID } = req.query;

    // Validation
    if (!recordID) {
      return res.status(400).json({ error: "RecordID is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(recordID)) {
      return res.status(400).json({ error: "Invalid RecordID" });
    }

    // console.log("Fetching Record");

    const currentRecord = await MedicalRecord.findOne({
      _id: recordID,
    })
      .populate([
        {
          path: "incidents",
          populate: {
            path: "testIncidents",
            model: "TestIncident",
          },
        },
      ])
      .populate([
        {
          path: "incidents",
          populate: {
            path: "appointmentIncidents",
            model: "AppointmentIncident",
          },
        },
      ])
      .populate([
        {
          path: "incidents",
          populate: {
            path: "symptomIncidents",
            model: "SymptomIncident",
          },
        },
      ])
      .populate([
        {
          path: "incidents",
          populate: {
            path: "prescriptionIncidents",
            model: "PrescriptionIncident",
          },
        },
      ]);
    // .select("medicalRecords");

    if (!currentRecord) {
      return res.status(400).json({ error: "No records found" });
    }

    // console.log("Records fetched:", currentRecord);
    res.status(200).json({ currentRecord });
  } catch (error) {
    console.error("Error fetching tests:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteRecord = async (req, res) => {
  try {
    const { recordID } = req.params;

    // Validation
    if (!recordID) {
      return res.status(400).json({ error: "RecordID is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(recordID)) {
      return res.status(400).json({ error: "Invalid RecordID" });
    }

    // Find and delete the medical record
    const deletedRecord = await MedicalRecord.findByIdAndDelete(recordID);

    if (!deletedRecord) {
      return res.status(404).json({ error: "Record not found" });
    }

    // Remove the record reference from the patient's medicalRecords array
    await Patient.updateOne(
      { _id: deletedRecord.patientID },
      { $pull: { medicalRecords: recordID } }
    );

    res.status(200).json({ message: "Medical Record deleted successfully" });
  } catch (error) {
    console.error("Error deleting medical record:", error.message);
    res
      .status(500)
      .json({ error: "Internal server error : Medical Record Deletion" });
  }
};

const updateRecord = async (req, res) => {
  try {
    const { recordID } = req.params;
    const { recordName, recordDescription, date } = req.body;

    // Validation
    if (!recordID) {
      return res.status(400).json({ error: "RecordID is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(recordID)) {
      return res.status(400).json({ error: "Invalid RecordID" });
    }
    // if (!recordName || !recordDescription || !date) {
    //   return res.status(400).json({ error: "All fields are required" });
    // }

    // Update the medical record
    const updatedRecord = await MedicalRecord.findByIdAndUpdate(
      recordID,
      {
        recordName,
        description: recordDescription,
        recordDate: date,
      },
      { new: true } // Return the updated document
    );

    if (!updatedRecord) {
      return res.status(404).json({ error: "Record not found" });
    }

    res
      .status(200)
      .json({ message: "Medical Record updated successfully", updatedRecord });
  } catch (error) {
    console.error("Error updating medical record:", error.message);
    res
      .status(500)
      .json({ error: "Internal server error : Medical Record Update" });
  }
};
module.exports = {
  createRecord,
  getAllRecordsOfPatient,
  getRecord,
  deleteRecord,
  updateRecord,
};
