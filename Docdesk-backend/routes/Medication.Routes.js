const express = require("express");
const {
  getMedicationforms,
  postMedicationForm,
  deleteOneMedication,
  getMedicationforDay,
  updateMedication,
} = require("../controllers/Medication.Controller.js");
const router = express.Router();

//get result
router.get("/getOne/:id", getMedicationforms);

//post a new result
router.post("/add/", postMedicationForm);

//delete one
router.delete("/:id", deleteOneMedication);

//get result for specific day
router.get("/date/:date", getMedicationforDay);

//update medication
router.put("/update/:id", updateMedication);

module.exports = router;
