const express = require("express");

const router = express.Router();

const {
    register,
    login
} = require("../controllers/authController");

// ================= Authentication Routes =================

// Register User
router.post("/register", register);

// Login User
router.post("/login", login);

module.exports = router;