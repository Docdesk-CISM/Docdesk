const { response } = require("express");
const Medication = require("../models/Medication.Model");

//get all medication of a patient
const getMedicationforms = async (req, res) => {
  const { id } = req.params;
  // console.log("ID:", id);
  const medicationData = await Medication.find({
    patientID: id,
  }).sort({ createdAt: -1 });
  res.status(200).json(medicationData);
};

//post medication
const postMedicationForm = async (req, res) => {
  const {
    sDate,
    userID,
    addedBy,
    medicine,
    meditype,
    unit,
    addedDate,
    pills,
    days,
    dayArray,
    times,
    frequency,
    duration,
    baw,
    description,
  } = req.body;

  console.log(req.body);
  console.log("userID", userID);

  //add doc to db
  try {
    const medicationData = await Medication.create({
      sDate,
      patientID: userID,
      addedBy,
      medicine,
      meditype,
      unit,
      addedDate,
      pills,
      days,
      dayArray,
      times,
      frequency,
      duration,
      baw,
      description,
    });
    res.status(200).json(medicationData);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

//delete one
const deleteOneMedication = (req, res, next) => {
  const { id } = req.params;
  Medication.deleteOne({ _id: id })
    .then((response) => {
      res.status(200).json({ response });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

//get medication for a specific day
const getMedicationforDay = async (req, res) => {
  const { date } = req.params;
  const patientID = req.query.patientID;
  console.log(req.query);
  console.log(date, patientID);

  Medication.find({ dayArray: date, patientID: patientID })
    .sort({ createdAt: -1 })
    .then((response) => {
      console.log(response);
      res.status(200).json({ response });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

//update medication
const updateMedication = async (req, res, next) => {
  const { id } = req.params;
  const {
    sDate,
    medicine,
    meditype,
    unit,
    addedDate,
    pills,
    days,
    dayArray,
    times,
    frequency,
    duration,
    baw,
    description,
  } = req.body;
  Medication.updateOne(
    { _id: id },
    {
      $set: {
        sDate: sDate,
        medicine: medicine,
        meditype: meditype,
        unit: unit,
        addedDate: addedDate,
        pills: pills,
        days: days,
        dayArray: dayArray,
        times: times,
        frequency: frequency,
        duration: duration,
        baw: baw,
        description: description,
      },
    }
  )
    .then((response) => {
      console.log(id);
      res.json({ response });
    })
    .then((data) => console.log(data))
    .catch((error) => {
      res.json({ error });
    });
};

module.exports = {
  getMedicationforms,
  postMedicationForm,
  deleteOneMedication,
  getMedicationforDay,
  updateMedication,
};
