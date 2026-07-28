// ==========================================
// Dashboard Controller
// ==========================================

const dashboard = async (req, res) => {

    try {

        const dashboardData = {

            user: {

                id: req.user._id,
                fullName: req.user.fullName,
                email: req.user.email

            },

            statistics: {

                totalScans: 0,
                safeMessages: 0,
                phishingDetected: 0,
                riskScore: 0

            },

            recentScans: [],

            recentAlerts: [],

            recommendations: [

                "Always verify unknown email senders.",
                "Never click suspicious links.",
                "Enable Two-Factor Authentication.",
                "Keep your browser updated."

            ]

        };

        return res.status(200).json({

            success: true,

            message: "Dashboard loaded successfully",

            data: dashboardData

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

    dashboard

};