const express = require("express");
const { registerUser, loginUser } = require("../controllers/userController");

const router = express.Router();

// @route   POST /api/users/register
// @desc    Register a new user
router.post("/register", registerUser);

// @route   POST /api/users/login
// @desc    Login user
router.post("/login", loginUser);

module.exports = router; // ✅ make sure to export router
