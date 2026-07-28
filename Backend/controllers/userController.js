// ============================================
// Get Logged In User Profile
// ============================================

const getProfile = async (req, res) => {

    try {

        res.status(200).json({

            success: true,

            message: "Profile fetched successfully",

            user: req.user

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};

module.exports = {

    getProfile

};