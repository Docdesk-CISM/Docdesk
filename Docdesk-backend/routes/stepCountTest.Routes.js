const express = require("express");
const {
  getPatientStepCounterTestResult,
  createStepCountResult,
  deleteStepCounterTestResult,
  deleteOneStepCountResult,
} = require("../controllers/MedicalTests_Controllers/stepCountController");

const router = express.Router();

// //get all results
// router.get("/", getStepCounterTestResult);

//get a Patients results
router.get("/:id", getPatientStepCounterTestResult);

//post a new result
router.post("/", createStepCountResult);

//delete results
router.delete("/PatientData/:id", deleteStepCounterTestResult);

//delete one result
router.delete("/SingleTest/:id", deleteOneStepCountResult);

module.exports = router;
