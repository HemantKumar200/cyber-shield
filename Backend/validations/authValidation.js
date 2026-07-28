const Joi = require("joi");

// ================= Register Validation =================

const registerValidation = (data) => {

    const schema = Joi.object({

        fullName: Joi.string()
            .min(3)
            .max(50)
            .required()
            .messages({
                "string.empty": "Full Name is required",
                "string.min": "Full Name must be at least 3 characters",
                "string.max": "Full Name cannot exceed 50 characters"
            }),

        email: Joi.string()
            .email()
            .required()
            .messages({
                "string.email": "Enter a valid email address",
                "string.empty": "Email is required"
            }),

        password: Joi.string()
            .min(8)
            .max(20)
            .pattern(
                new RegExp(
                    "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,20}$"
                )
            )
            .required()
            .messages({
                "string.empty": "Password is required",
                "string.min": "Password must be at least 8 characters",
                "string.max": "Password cannot exceed 20 characters",
                "string.pattern.base":
                    "Password must contain uppercase, lowercase, number and special character"
            }),

        confirmPassword: Joi.any()
            .valid(Joi.ref("password"))
            .required()
            .messages({
                "any.only": "Passwords do not match",
                "any.required": "Confirm Password is required"
            })

    });

    return schema.validate(data);
};

// ================= Login Validation =================

const loginValidation = (data) => {

    const schema = Joi.object({

        email: Joi.string()
            .email()
            .required(),

        password: Joi.string()
            .required()

    });

    return schema.validate(data);

};

// ================= Export =================

module.exports = {

    registerValidation,
    loginValidation

};