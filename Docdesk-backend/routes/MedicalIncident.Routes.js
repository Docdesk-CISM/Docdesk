const express = require("express");
const {
  createTestIncident,
  deleteTestIncident,
} = require("../controllers/MedicalIncidentControllers/Test-MedicalIncidentController");
const {
  createAppointmentIncident,
  deleteAppointmentIncident,
} = require("../controllers/MedicalIncidentControllers/Appointment-MedicalIncident");
const {
  createPrescriptionIncident,
  deletePrescriptionIncident,
} = require("../controllers/MedicalIncidentControllers/Prescription-MedicalIncident");
const {
  createSymptomIncident,
  deleteSymptomIncident,
} = require("../controllers/MedicalIncidentControllers/Symptom-MedicalIncident");

const router = express.Router();

//Create a new Test Incident
router.post("/testIn/create", createTestIncident);
// Delete a Test Incident
router.delete(
  "/testIncidents/delete/:recordID/:incidentID",
  deleteTestIncident
);

//Create a new Appointment Incident
router.post("/AppointmentIn/create", createAppointmentIncident);
// Delete an Appointment Incident
router.delete(
  "/appointmentIncidents/delete/:recordID/:incidentID",
  deleteAppointmentIncident
);

//Create a new Prescription Incident
router.post("/PrescriptionIn/create", createPrescriptionIncident);
// Delete a Prescription Incident
router.delete(
  "/prescriptionIncidents/delete/:recordID/:incidentID",
  deletePrescriptionIncident
);

//Create a new Symptom Incident
router.post("/symptomIn/create", createSymptomIncident);
//Delete a Symptom Incident
router.delete(
  "/symptomIncidents/delete/:recordID/:incidentID",
  deleteSymptomIncident
);

module.exports = router;
