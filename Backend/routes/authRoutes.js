const express = require("express");

const router = express.Router();

const {
    register,
    login,
    profile
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// Register User
router.post("/register", register);

// Login User
router.post("/login", login);

// Protected Profile
router.get("/profile", authMiddleware, profile);

module.exports = router;