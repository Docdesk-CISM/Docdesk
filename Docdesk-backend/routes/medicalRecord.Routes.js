const express = require("express");
const {
  createRecord,
  getAllRecordsOfPatient,
  getRecord,
  deleteRecord,
  updateRecord,
} = require("../controllers/medicalRecord.Controller.js");
const verifyRoles = require("../middleware/verifyRoles");

const router = express.Router();

//post a new result
router.post("/create/", verifyRoles("doctor"), createRecord);
router.get("/getRecordsPatient/", getAllRecordsOfPatient);
router.get("/getRecord/", getRecord);
router.delete("/record/:recordID", verifyRoles("doctor", "admin"), deleteRecord);
router.put("/update/:recordID", verifyRoles("doctor"), updateRecord);

module.exports = router;
