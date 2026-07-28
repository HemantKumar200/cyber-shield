const Scan = require("../models/Scan");

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

        // -----------------------------
        // AI Detection Logic
        // -----------------------------

        let riskScore = 0;

        let reasons = [];

        let result = "SAFE";

        // Suspicious Keywords

        const keywords = [

            "urgent",
            "verify",
            "bank",
            "otp",
            "password",
            "click here",
            "login",
            "gift",
            "winner",
            "claim",
            "account suspended",
            "limited time"

        ];

        const lowerMessage = message.toLowerCase();

        keywords.forEach((word) => {

            if (lowerMessage.includes(word)) {

                riskScore += 10;

                reasons.push(`Keyword Detected : ${word}`);

            }

        });

        // URL Detection

        if (lowerMessage.includes("http://") || lowerMessage.includes("https://")) {

            riskScore += 20;

            reasons.push("URL Found");

        }

        // Email Detection

        if (lowerMessage.includes("@")) {

            riskScore += 5;

            reasons.push("Email Address Found");

        }

        // Result

        if (riskScore >= 70) {

            result = "PHISHING";

        }

        else if (riskScore >= 30) {

            result = "SUSPICIOUS";

        }

        else {

            result = "SAFE";

        }

        // Save Scan

        const scan = await Scan.create({

            user: req.user._id,

            message,

            riskScore,

            result,

            reasons

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