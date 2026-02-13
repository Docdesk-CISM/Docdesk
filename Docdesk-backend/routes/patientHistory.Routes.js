const express = require("express");
const {
  getPatientsHistory,
  enterData,
} = require("../controllers/PatientHistory.Controller");

const router = express.Router();

router.get("/", getPatientsHistory);
router.post("/", enterData);

module.exports = router;
