const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

// Test Protected Route
router.get("/profile", authMiddleware, (req, res) => {

    res.status(200).json({

        success: true,

        message: "Profile fetched successfully",

        user: req.user

    });

});

module.exports = router;