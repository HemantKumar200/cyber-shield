
const Scan = require("../models/Scan");
const detectPhishing = require("../utils/phishingDetector");

// ============================================
// Scan Message Controller
// ============================================

const scanMessage = async (req, res) => {

    try {

        const { message } = req.body;

        if (!message) {

            return res.status(400).json({

                success: false,
                message: "Message is required."

            });

        }

        const analysis = detectPhishing(message);

        // Save Scan

        const scan = await Scan.create({

            user: req.user._id,

            message,

            riskScore: analysis.riskScore,

            result: analysis.result,

            reasons: analysis.reasons

        });

        return res.status(200).json({

            success: true,

            message: "Message scanned successfully.",

            data: scan

        });

    }

    catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};

module.exports = {

    scanMessage

};

const getScanHistory = async (req, res) => {

    try {

        const scans = await Scan.find({

            user: req.user._id

        }).sort({

            scannedAt: -1

        });

        return res.status(200).json({

            success: true,

            total: scans.length,

            data: scans

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};
module.exports = {

    scanMessage,
    getScanHistory

};