const express = require("express");
const {
  getPatients,
  getPatient,
  addDocAccess,
  deletePatient,
  updatePatient,
  uploadProfileImage,
  getAccessDoctorList,
  removeDocAccess,
  upload,
} = require("../controllers/Patient.Controller");
const verifyRoles = require("../middleware/verifyRoles");

const router = express.Router();

// Get all patients
router.get("/", verifyRoles("admin", "doctor"), getPatients);

// Get a patient
router.get("/:id", verifyRoles("admin", "doctor", "patient"), getPatient);

// Delete a patient
router.delete("/:id", verifyRoles("admin"), deletePatient);

// update a patient
router.put("/:id", verifyRoles("admin", "doctor", "patient"), updatePatient);

// Give patient access to doctor
router.patch("/addDocAccess/:id", verifyRoles("admin", "patient"), addDocAccess);

// Give patient access to doctor
router.patch("/removeDocAccess/:id", verifyRoles("admin", "patient"), removeDocAccess);

router.get("/accessDoctorList/:id/", verifyRoles("admin", "doctor", "patient"), getAccessDoctorList);

// Upload profile image
router.post("/:id", verifyRoles("admin", "doctor", "patient"), upload.single("image"), uploadProfileImage);

module.exports = router;
