const Scan = require("../models/Scan");

const getDashboardStats = async (req, res) => {

    try {

        const userId = req.user._id;

        const totalScans = await Scan.countDocuments({ user: userId });

        const safe = await Scan.countDocuments({
            user: userId,
            result: "SAFE"
        });

        const suspicious = await Scan.countDocuments({
            user: userId,
            result: "SUSPICIOUS"
        });

        const phishing = await Scan.countDocuments({
            user: userId,
            result: "PHISHING"
        });

        const scans = await Scan.find({ user: userId });

        let totalRisk = 0;

        scans.forEach(scan => {

            totalRisk += scan.riskScore;

        });

        const averageRisk = totalScans === 0
            ? 0
            : Math.round(totalRisk / totalScans);

        return res.status(200).json({

            success: true,

            stats: {

                totalScans,
                safe,
                suspicious,
                phishing,
                averageRisk

            }

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
    getDashboardStats
};