const User = require("../models/User");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

const {
    registerValidation,
    loginValidation
} = require("../validations/authValidation");

// ======================================
// Register Controller
// ======================================

const register = async (req, res) => {

    try {

        // Validate Request
        const { error } = registerValidation(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const {
            fullName,
            email,
            password
        } = req.body;

        // Check Existing User
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered."
            });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User
        const user = await User.create({
            fullName,
            email,
            password: hashedPassword
        });

        // Generate JWT Token
        const token = generateToken(user);

        return res.status(201).json({

            success: true,
            message: "Registration Successful",

            token,

            user: {

                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role

            }

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            message: "Internal Server Error"

        });

    }

};

// ======================================
// Login Controller
// ======================================

const login = async (req, res) => {

    try {

        const { error } = loginValidation(req.body);

        if (error) {

            return res.status(400).json({

                success: false,
                message: error.details[0].message

            });

        }

        const { email, password } = req.body;

        // Find User

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(404).json({

                success: false,
                message: "User not found"

            });

        }

        // Compare Password

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {

            return res.status(401).json({

                success: false,
                message: "Invalid Password"

            });

        }

        // Generate Token

        const token = generateToken(user);

        return res.status(200).json({

            success: true,

            message: "Login Successful",

            token,

            user: {

                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role

            }

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            message: "Internal Server Error"

        });

    }

};

const profile = async (req, res) => {

    try {

        return res.status(200).json({

            success: true,
            message: "Profile fetched successfully",

            user: req.user

        });

    } catch (error) {

        return res.status(500).json({

            success: false,
            message: "Internal Server Error"

        });

    }

};

module.exports = {

    register,
    login,
    profile
};