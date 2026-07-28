const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {

    try {

        // Get Token From Header

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {

            return res.status(401).json({

                success: false,
                message: "Access Denied. No Token Provided."

            });

        }

        // Extract Token

        const token = authHeader.split(" ")[1];

        // Verify Token

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find User

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {

            return res.status(404).json({

                success: false,
                message: "User not found."

            });

        }

        // Attach User to Request

        req.user = user;

        next();

    }

    catch (error) {

        return res.status(401).json({

            success: false,
            message: "Invalid or Expired Token."

        });

    }

};

module.exports = authMiddleware;