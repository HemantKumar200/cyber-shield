const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");

const app = express();

// Connect Database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Home Route
app.get("/", (req, res) => {

    res.json({

        success: true,
        message: "🚀 Welcome to Cyber Shield API"

    });

});

// Authentication Routes
app.use("/api/auth", authRoutes);

module.exports = app;