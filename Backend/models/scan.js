const mongoose = require("mongoose");

const scanSchema = new mongoose.Schema({

    user: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true

    },

    message: {

        type: String,

        required: true

    },

    riskScore: {

        type: Number,

        default: 0

    },

    result: {

        type: String,

        enum: ["SAFE", "SUSPICIOUS", "PHISHING"],

        default: "SAFE"

    },

    reasons: [

        {

            type: String

        }

    ],

    scannedAt: {

        type: Date,

        default: Date.now

    }

});

module.exports = mongoose.model("Scan", scanSchema);