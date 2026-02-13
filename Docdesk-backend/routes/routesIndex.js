const express = require("express");
const router = express.Router();

const AuthMiddleware = require("../middleware/AuthMiddleware");

const PatientRoutes = require("./Patients.Routes");
const DoctorRoutes = require("./Doctor.Routes");
const authRoutes = require("./auth.Routes");
const BreathingTestRoutes = require("./breathingTest.Routes");
const StepCounterTestRoutes = require("./stepCountTest.Routes");
const PatientHistoryRoutes = require("./patientHistory.Routes");
const MedicalIncidentRoutes = require("./MedicalIncident.Routes");
const MedicalRecordRoutes = require("./medicalRecord.Routes");

const ExtTestRoutes = require("./ExternalTestResult.Routes");

const PortalAuthRoutes = require("./portalAuth.Routes");
const MedicationNewRoutes = require("./Medication.Routes");

router.use("/doctors", AuthMiddleware, DoctorRoutes);
router.use("/breathingTests", AuthMiddleware, BreathingTestRoutes);
router.use("/stepCounterTests", AuthMiddleware, StepCounterTestRoutes);
router.use("/patientsHistory", AuthMiddleware, PatientHistoryRoutes);
router.use("/patients", AuthMiddleware, PatientRoutes);
//Medical Incident 
router.use("/medicalIncident", AuthMiddleware, MedicalIncidentRoutes);
//Medical Record
router.use("/medicalRecord", AuthMiddleware, MedicalRecordRoutes);

router.use("/extTests", AuthMiddleware, ExtTestRoutes);
router.use("/medication", AuthMiddleware, MedicationNewRoutes);

router.use(authRoutes);
router.use("/portal/auth", PortalAuthRoutes);

router.get("/", (req, res) => {
  res.status(200).json({ message: "DocDesk Test Endpoint v1" });
});

module.exports = router;
