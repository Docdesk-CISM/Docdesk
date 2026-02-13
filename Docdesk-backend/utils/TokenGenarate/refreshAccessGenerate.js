const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const DoctorModel = require("../../models/doctor");
const PatientModel = require("../../models/Patient");
const AdminModel = require("../../models/PortalAdmin.Model");

const { generateAccessToken } = require("./generateAccessToken");

const refreshAccessToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    console.log("decoded", decoded);

    if (!decoded) {
      throw new Error("Invalid refresh token");
    }

    if (decoded.roles === "doctor") {
      const Doctor = await DoctorModel.findOne({ _id: decoded._id });
      if (!Doctor || Doctor.refreshToken !== refreshToken) {
        throw new Error("Invalid or revoked refresh token");
      }
    }
    if (decoded.roles === "patient") {
      const Patient = await PatientModel.findOne({ _id: decoded._id });
      if (!Patient || Patient.refreshToken !== refreshToken) {
        throw new Error("Invalid or revoked refresh token");
      }
    }
    if (decoded.roles === "admin") {
      const Admin = await AdminModel.findOne({ _id: decoded._id });
      console.log("Admin", Admin);
      if (!Admin || Admin.refreshToken !== refreshToken) {
        throw new Error("Invalid or revoked refresh token");
      }
    }

    const accessToken = generateAccessToken({
      _id: decoded._id,
      roles: decoded.roles,
      fName: decoded.fName,
      lName: decoded.lName,
    });

    return { accessToken };
  } catch (err) {
    console.error("Error refreshing access token:", err);
    return null;
  }
};

module.exports = { refreshAccessToken };
