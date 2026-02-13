const SymptomMedicalIncident = require("../../models/MedicalIncidentModels/Symptom-IncidentModel");
const MedicalRecord = require("../../models/medicalRecord");
const mongoose = require("mongoose");

const createSymptomIncident = async (req, res) => {
    try {
        const {
            recordID,
            symptomDate,
            symptomType,
            symptomDescription,
            symptomFrequency,
            severity,
            symptomDuration,
            appetite,
            weight,
        } = req.body;

        // *Validation
        if (
            !recordID ||
            !symptomType ||
            !symptomDate ||
            !symptomFrequency ||
            !symptomDuration ||
            !severity ||
            !appetite ||
            !weight
        ) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if the recordID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(recordID)) {
            return res.status(400).json({ error: "Invalid record ID" });
        }

        // Check if a document with the provided recordID exists
        const currentRecord = await MedicalRecord.findOne({
            _id: recordID,
        });

        if (!currentRecord) {
            return res.status(400).json({ error: "Record does not exist" });
        }

        const currentSymptomIncident = new SymptomMedicalIncident({
            recordID,
            symptomDate,
            symptomType,
            symptomDescription,
            symptomFrequency,
            severity,
            symptomDuration,
            appetite,
            weight,
        });

        // Save the updated incident document
        await currentSymptomIncident.save();

        // Add the incident to the record
        currentRecord.incidents.symptomIncidents.push(currentSymptomIncident._id);
        await currentRecord.save();

        res.status(200).json({ message: "Incident saved successfully" });
    } catch (error) {
        console.error("Error saving incident:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

const deleteSymptomIncident = async (req, res) => {
    try {
        const { incidentID, recordID } = req.params;

        // Check if the incidentID and recordID are valid ObjectId
        if (
            !mongoose.Types.ObjectId.isValid(incidentID) ||
            !mongoose.Types.ObjectId.isValid(recordID)
        ) {
            return res.status(400).json({ error: "Invalid ID" });
        }

        // Find and remove the symptom incident
        const incident = await SymptomMedicalIncident.findByIdAndDelete(incidentID);
        if (!incident) {
            return res.status(404).json({ error: "Incident not found" });
        }

        // Remove the incident reference from the medical record
        const record = await MedicalRecord.findById(recordID);
        if (!record) {
            return res.status(404).json({ error: "Record not found" });
        }

        record.incidents.symptomIncidents.pull(incidentID);
        await record.save();

        res.status(200).json({ message: "Incident deleted successfully" });
    } catch (error) {
        console.error("Error deleting incident:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    createSymptomIncident,
    deleteSymptomIncident,
};
