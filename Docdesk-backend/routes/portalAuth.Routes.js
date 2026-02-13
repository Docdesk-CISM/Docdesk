const {
  adminSignUp,
  adminSignIn,
  adminChangePass,
} = require("../controllers/portalAuth.Controller");

const express = require("express");
const router = express.Router();

const AuthMiddleware = require("../middleware/AuthMiddleware");
const verifyRoles = require("../middleware/verifyRoles");

// Admin Sign-up
router.post("/signup", AuthMiddleware, verifyRoles("admin"), adminSignUp);

// Admin Sign-in
router.post("/signin", adminSignIn);

// Change Password
router.post("/changepass", adminChangePass);

module.exports = router;
