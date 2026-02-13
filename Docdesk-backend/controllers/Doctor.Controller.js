const mongoose = require("mongoose");
const DocModel = require("../models/doctor");

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

require("dotenv").config();

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Configure Multer with Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profile_images",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage: storage });

//Get all doctors
const getDoctors = async (req, res) => {
  const doctors = await DocModel.find({}).sort({ createdAt: -1 });
  res.status(200).json(doctors);
};

//Get a single doctor by ID
const getDoctor = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such Doctor" });
  }

  const doc = await DocModel.findById(id);
  if (!doc) {
    return res.status(400).json({ error: "No such Doctor" });
  }

  res.status(200).json(doc);
};

// Create new doctor
// const createDoctor = async (req, res) => {
//   const { name, doctorID, spec } = req.body;

//   // add document to db
//   try {
//     const doc = await DocModel.create({ name, doctorID, spec });
//     res.status(200).json(doc);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// delete a doctor
const deleteDoctor = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "no such doctor" });
  }

  const doctor = await DocModel.findOneAndDelete({ _id: id });

  if (!doctor) {
    return res.status(400).json({ error: "No such doctor" });
  }
  res.status(200).json({ message: "Doctor deleted" });
};

// update a doctor
const updateDoctor = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such doctor" });
  }

  const doctor = await DocModel.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!doctor) {
    return res.status(400).json({ error: "No such doctor" });
  }
  res.status(200).json(doctor);
};

// Add a patient's profile access to doctor
const addPatientAccess = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  console.log(req.body.patientID);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such doctor" });
  }
  if (!mongoose.Types.ObjectId.isValid(req.body.patientID)) {
    return res.status(404).json({ error: "No such patient" });
  }

  const doctor = await DocModel.findOneAndUpdate(
    { _id: id },
    {
      $addToSet: { accessPatients: req.body.patientID },
    }
  );

  res.status(200).json(doctor);
};

// Verify a doctor
const verifyDoctor = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such Doctor" });
  }

  const doctor = await DocModel.findOneAndUpdate(
    { _id: id },
    {
      medicalIdVerify: true,
    }
  );
  console.log(doctor);
  res.status(200).json({ message: "Doctor Verified" });
};

const uploadProfileImage = async (req, res) => {
  try {
    console.log("req.file:", req.file);

    if (!req.file || !req.file.path) {
      console.log("No file uploaded");
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imageUrl = req.file.path;
    const updatedDoctor = await DocModel.findByIdAndUpdate(
      req.params.id,
      { profileImage: imageUrl },
      { new: true }
    );

    res.status(200).json({
      message: "Profile image uploaded successfully",
      doctor: updatedDoctor,
    });
  } catch (error) {
    console.error("Full error:", error); // log full error object
    res.status(500).json({ message: "Error uploading profile image", error });
  }
};


const getPatientsWithAccess = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such Doctor" });
  }

  const doctor = await DocModel.findById(id)
    .populate("accessPatients")
    .select("accessPatients")
    .exec();
  if (!doctor) {
    return res.status(400).json({ error: "No such Doctor" });
  }

  // console.log(doctor.accessPatients);

  res.status(200).json(doctor.accessPatients);
};

// Remove patient access from doctor
const removeAccessOfPatient = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such Doctor" });
  }

  const doctor = await DocModel.findOneAndUpdate(
    { _id: id },
    {
      $pull: { accessPatients: req.body.patientID },
    }
  );

  res.status(200).json(doctor);
};

module.exports = {
  getDoctors,
  getDoctor,
  deleteDoctor,
  updateDoctor,
  addPatientAccess,
  verifyDoctor,
  uploadProfileImage,
  getPatientsWithAccess,
  removeAccessOfPatient,
  upload,
};
