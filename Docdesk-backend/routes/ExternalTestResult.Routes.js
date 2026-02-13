const express = require("express");

const {
  addTestResultLink,
  getTestResultLinks,
  deleteTestResultLink,
} = require("../controllers/PatientTestResults.Controller");

const router = express.Router();

router.post("/addLink", addTestResultLink);
router.get("/getLinks", getTestResultLinks);
router.delete("/deleteLink", deleteTestResultLink);

module.exports = router;
