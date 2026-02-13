const express = require("express");

const {
  getDoctor,
  getDoctors,
  deleteDoctor,
  updateDoctor,
  addPatientAccess,
  verifyDoctor,
  uploadProfileImage,
  getPatientsWithAccess,
  removeAccessOfPatient,
  upload
} = require("../controllers/Doctor.Controller");

const verifyRoles = require("../middleware/verifyRoles");

const router = express.Router();

// Get all doctors
router.get("/", verifyRoles("admin", "doctor"), getDoctors);

// Get a doctor
router.get("/:id", verifyRoles("admin", "doctor", "patient"), getDoctor);

// Delete a doctor
router.delete("/:id", verifyRoles("admin"), deleteDoctor);

// Update a doctor
router.put("/:id", verifyRoles("admin", "doctor"), updateDoctor);

// Add patient access to doctor
router.patch("/addPatientAccess/:id", verifyRoles("admin", "doctor"), addPatientAccess);

// Verify a doctor
router.patch("/verifyDoctor/:id", verifyRoles("admin"), verifyDoctor);

// Upload profile image
router.post("/:id", verifyRoles("admin", "doctor"), upload.single('image'), uploadProfileImage);

// Get patients with access
router.get("/getPatientsWithAccess/:id", verifyRoles("admin", "doctor"), getPatientsWithAccess);

// Give patient access to doctor
router.patch("/removeDocAccess/:id", verifyRoles("admin", "doctor"), removeAccessOfPatient);

module.exports = router;
