const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");


const { scanMessage, getScanHistory } = require("../controllers/scanController");
// ======================================
// Scan Message Route
// ======================================

router.post("/message", authMiddleware, scanMessage);


router.get("/history", authMiddleware, getScanHistory);

module.exports = router;