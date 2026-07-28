const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const { scanMessage } = require("../controllers/scanController");

// ======================================
// Scan Message Route
// ======================================

router.post("/message", authMiddleware, scanMessage);

module.exports = router;